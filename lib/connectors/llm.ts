/**
 * LLM connector — backs agent & Conductor chat through the Claude Agent SDK,
 * authenticated with CLAUDE_CODE_OAUTH_TOKEN (draws on the Claude subscription
 * plan's usage, not metered per-token API billing). Two models: the Conductor's
 * routing decision (pickAgent, in lib/agents/conductor.ts) uses Opus 5 — better
 * judgment for picking the right agent; department-head/agent chat (chat.ts's
 * chatWithAgent) uses Sonnet 5 — the workhorse model for actual replies. Each
 * caller sets `model` on its LlmChatRequest; CONDUCTOR_MODEL / AGENT_MODEL are
 * exported for that purpose.
 *
 * Mirrors the previous provider shape: a real `claude-agent-sdk` provider
 * (default) plus a `stub` provider (LLM_PROVIDER=stub) that is deterministic
 * and makes NO subprocess call — so the whole agent-chat stack is testable
 * offline. Status stays honest: no CLAUDE_CODE_OAUTH_TOKEN ⇒ not_configured,
 * never a fake "connected".
 */
import { z } from 'zod';
import { CRED_FILES, resolveCred } from '@/lib/creds';
import type { ConnectorStatus } from '@/lib/connectors/types';

export type LlmRole = 'system' | 'user' | 'assistant' | 'tool';
export type LlmMessage = { role: LlmRole; content: string };

export type LlmToolSpec = {
  name: string;
  description: string;
  parameters: z.ZodTypeAny;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

export type LlmToolCall = { name: string; args: unknown; result: unknown };

export type LlmChatRequest = {
  system?: string;
  messages: LlmMessage[];
  tools?: LlmToolSpec[];
  model?: string;
};

export type LlmChatResult = { text: string; toolCalls: LlmToolCall[] };

export interface LlmProvider {
  name: string;
  chat(req: LlmChatRequest): Promise<LlmChatResult>;
}

const TOKEN_KEY = 'CLAUDE_CODE_OAUTH_TOKEN';

/** Department-head/agent chat default. Override via LLM_MODEL. */
export const AGENT_MODEL = process.env.LLM_MODEL ?? 'claude-sonnet-5';
/** Conductor routing default (lib/agents/conductor.ts's pickAgent). Override via LLM_CONDUCTOR_MODEL. */
export const CONDUCTOR_MODEL = process.env.LLM_CONDUCTOR_MODEL ?? 'claude-opus-5';

/** process.env first (Next auto-loads .env.local), then Alex's cred files. */
function resolveOAuthToken(): string | undefined {
  return resolveCred(TOKEN_KEY, [CRED_FILES.agentsEnv, CRED_FILES.socialMedia]);
}

/** Stub trigger: a user message containing `use-tool:<name>` fires that tool. */
const STUB_TRIGGER = /use-tool:(\S+)/;

export const stubLlmProvider: LlmProvider = {
  name: 'stub',
  async chat(req) {
    const lastUser = [...req.messages].reverse().find((m) => m.role === 'user');
    const text = lastUser ? `stub-reply: ${lastUser.content}` : 'stub-reply';
    const toolCalls: LlmToolCall[] = [];
    const trigger = lastUser?.content.match(STUB_TRIGGER);
    if (trigger && req.tools) {
      const spec = req.tools.find((t) => t.name === trigger[1]);
      if (spec) {
        const args: Record<string, unknown> = {};
        const result = await spec.execute(args);
        toolCalls.push({ name: spec.name, args, result });
      }
    }
    return { text, toolCalls };
  },
};

/**
 * Renders the rolling message history into one prompt string. The Agent SDK's
 * query() takes a single prompt per turn, not a messages array — chat.ts owns
 * real persistence and already resends the full history every call (same
 * behavior the previous gateway provider had), so this is a faithful,
 * non-regressive translation, not a new design.
 */
function renderPrompt(messages: LlmMessage[]): string {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n');
}

const MCP_SERVER_NAME = 'app';

export function createClaudeAgentProvider(model: string): LlmProvider {
  return {
    name: 'claude-agent-sdk',
    async chat(req) {
      // Fail fast with an honest message instead of letting the SDK hang —
      // and hydrate process.env from Alex's cred files so a token that
      // exists outside .env.local still works.
      const token = resolveOAuthToken();
      if (!token) {
        throw new Error(
          'CLAUDE_CODE_OAUTH_TOKEN is not set — run `claude setup-token` and add the result to .env.local to enable agent chat.',
        );
      }
      if (!process.env.CLAUDE_CODE_OAUTH_TOKEN) process.env.CLAUDE_CODE_OAUTH_TOKEN = token;

      const { query, tool, createSdkMcpServer } = await import('@anthropic-ai/claude-agent-sdk');

      const specs = req.tools ?? [];
      const toolDefs = specs.map((t) => {
        const shape =
          t.parameters instanceof z.ZodObject ? (t.parameters as z.ZodObject<z.ZodRawShape>).shape : {};
        return tool(t.name, t.description, shape, async (args) => {
          const result = await t.execute(args as Record<string, unknown>);
          return { content: [{ type: 'text' as const, text: JSON.stringify(result ?? null) }] };
        });
      });

      const mcpServers =
        toolDefs.length > 0
          ? { [MCP_SERVER_NAME]: createSdkMcpServer({ name: MCP_SERVER_NAME, tools: toolDefs }) }
          : undefined;
      const allowedTools = specs.map((t) => `mcp__${MCP_SERVER_NAME}__${t.name}`);

      const toolUseById = new Map<string, { name: string; args: unknown }>();
      const toolCalls: LlmToolCall[] = [];
      let finalText = '';

      const stream = query({
        prompt: renderPrompt(req.messages),
        options: {
          model: req.model ?? model,
          systemPrompt: req.system,
          tools: [], // disable ALL built-in tools (Bash/Read/Write/Edit/...) — read-only web chat, only our own MCP tools
          mcpServers,
          allowedTools,
          permissionMode: 'dontAsk',
          cwd: process.cwd(),
        },
      });

      for await (const message of stream) {
        try {
          if (message.type === 'assistant') {
            for (const block of message.message.content ?? []) {
              if (block.type === 'tool_use') {
                toolUseById.set(block.id, { name: block.name, args: block.input });
              }
            }
          } else if (message.type === 'user') {
            const content = (message as { message?: { content?: unknown[] } }).message?.content ?? [];
            for (const block of content) {
              const b = block as { type?: string; tool_use_id?: string; content?: unknown };
              if (b.type === 'tool_result' && b.tool_use_id) {
                const use = toolUseById.get(b.tool_use_id);
                if (use) toolCalls.push({ name: use.name, args: use.args, result: b.content });
              }
            }
          } else if (message.type === 'result') {
            finalText =
              message.subtype === 'success'
                ? message.result
                : `Turn ended early (${message.subtype}).`;
          }
        } catch {
          // Best-effort tool-call/result capture for the activity log — never
          // let a shape surprise here break the actual chat reply above.
        }
      }

      return { text: finalText, toolCalls };
    },
  };
}

export function getLlmProvider(): LlmProvider {
  const name = process.env.LLM_PROVIDER ?? 'claude-agent-sdk';
  if (name === 'stub') return stubLlmProvider;
  return createClaudeAgentProvider(AGENT_MODEL);
}

export function chat(req: LlmChatRequest): Promise<LlmChatResult> {
  return getLlmProvider().chat(req);
}

export async function llmStatus(): Promise<ConnectorStatus> {
  const base = { id: 'llm', name: 'LLM (Claude Agent SDK)', kind: 'orchestration' } as const;
  if (process.env.LLM_PROVIDER === 'stub') {
    return { ...base, state: 'connected', detail: 'stub provider active (tests)' };
  }
  const token = resolveOAuthToken();
  if (!token) {
    return {
      ...base,
      state: 'not_configured',
      detail: 'Set CLAUDE_CODE_OAUTH_TOKEN in .env.local (run `claude setup-token`) to enable agent chat via your Claude subscription.',
    };
  }
  return {
    ...base,
    state: 'connected',
    detail: `Claude Agent SDK (subscription) · agents: ${AGENT_MODEL} · conductor: ${CONDUCTOR_MODEL}`,
  };
}
