import { parseSkillFrontmatter, type CatalogSkill } from '@/lib/skills-catalog';

/**
 * Skills from encoded-business workspaces in a GitHub repo (RameshOS layout:
 * `Encoded Businesses/<Company>/skills/<name>/SKILL.md`), read live over the
 * GitHub API so the page always matches the repo.
 *
 * OPT-IN ONLY, like the other catalogs: nothing is fetched unless
 * ENCODED_SKILLS_GITHUB_TOKEN is set (use a fine-grained, read-only token
 * scoped to that one repo). Deploy it only behind FOUNDER_OS_ACCESS_TOKEN,
 * since the skills are the owner's private business judgment.
 *
 *   ENCODED_SKILLS_GITHUB_TOKEN   read-only token (required to enable)
 *   ENCODED_SKILLS_REPO           owner/repo          default drrpl/RameshOS
 *   ENCODED_SKILLS_REF            branch              default drrpl/RameshOS
 *   ENCODED_SKILLS_COMPANIES      comma-separated     default Innovative Leadership Strategies
 *
 * Folders starting with `_` (e.g. `_drafts`) are not live skills and are skipped.
 */

export type EncodedSkill = CatalogSkill & { company: string; markdown: string };

type GitHubEntry = { name: string; type: string; path: string };

const TTL_MS = 10 * 60 * 1000;
let cache: { at: number; key: string; skills: EncodedSkill[]; error: string | null } | null = null;

function settings() {
  const token = process.env.ENCODED_SKILLS_GITHUB_TOKEN?.trim();
  return {
    token,
    repo: process.env.ENCODED_SKILLS_REPO?.trim() || 'drrpl/RameshOS',
    ref: process.env.ENCODED_SKILLS_REF?.trim() || 'drrpl/RameshOS',
    companies: (process.env.ENCODED_SKILLS_COMPANIES || 'Innovative Leadership Strategies')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean),
  };
}

function contentsUrl(repo: string, ref: string, path: string) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(ref)}`;
}

async function gh(url: string, token: string, raw: boolean): Promise<Response> {
  return fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
}

/** One-line description: frontmatter `description`, else the command file's, else the Purpose line. */
export function describeEncodedSkill(skillMd: string, commandMd: string | null): string {
  const own = parseSkillFrontmatter(skillMd).description;
  if (own) return own;
  const fromCommand = commandMd ? parseSkillFrontmatter(commandMd).description : undefined;
  if (fromCommand) return fromCommand;
  const purpose = skillMd.match(/^>\s*\*\*Purpose\.\*\*\s*(.+)$/m)?.[1];
  return (purpose ?? '').replace(/\*\*/g, '').trim();
}

/** The owning agent from pack-style frontmatter (`agent: lead-qualification`), for the card's meta line. */
export function encodedSkillAgent(skillMd: string): string | null {
  const fm = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  return fm.match(/^agent:\s*([a-z0-9-]+)/m)?.[1] ?? null;
}

export async function readEncodedSkills(): Promise<{ skills: EncodedSkill[]; error: string | null; enabled: boolean }> {
  const { token, repo, ref, companies } = settings();
  if (!token) return { skills: [], error: null, enabled: false };
  const key = `${repo}@${ref}:${companies.join('|')}`;
  if (cache && cache.key === key && Date.now() - cache.at < TTL_MS) {
    return { skills: cache.skills, error: cache.error, enabled: true };
  }

  const skills: EncodedSkill[] = [];
  let error: string | null = null;
  try {
    for (const company of companies) {
      const base = `Encoded Businesses/${company}`;
      const list = await gh(contentsUrl(repo, ref, `${base}/skills`), token, false);
      if (!list.ok) throw new Error(`GitHub ${list.status} listing ${company} skills`);
      const dirs = ((await list.json()) as GitHubEntry[]).filter((e) => e.type === 'dir' && !e.name.startsWith('_'));
      const loaded = await Promise.all(
        dirs.map(async (d) => {
          const [skillRes, commandRes] = await Promise.all([
            gh(contentsUrl(repo, ref, `${base}/skills/${d.name}/SKILL.md`), token, true),
            gh(contentsUrl(repo, ref, `${base}/.claude/commands/${d.name}.md`), token, true),
          ]);
          if (!skillRes.ok) return null;
          const markdown = await skillRes.text();
          const commandMd = commandRes.ok ? await commandRes.text() : null;
          const agent = encodedSkillAgent(markdown);
          return {
            slug: `encoded:${company}:${d.name}`,
            name: parseSkillFrontmatter(markdown).name || d.name,
            description: describeEncodedSkill(markdown, commandMd),
            group: agent ? `${company} · ${agent.replace(/-/g, ' ')}` : company,
            path: `${repo}/${base}/skills/${d.name}/SKILL.md`,
            company,
            markdown,
          } satisfies EncodedSkill;
        }),
      );
      skills.push(...loaded.filter((s): s is EncodedSkill => s !== null));
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'GitHub unavailable';
    console.error('Encoded skills unavailable', { message: error });
  }
  skills.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
  cache = { at: Date.now(), key, skills, error };
  return { skills, error, enabled: true };
}

/**
 * Seeded operator cards that copy a live encoded skill (ids are `skill-<name>`,
 * e.g. `skill-linkedin-post-draft`) are hidden once the live version is listed,
 * so each skill appears once.
 */
export function withoutEncodedDuplicates<T extends { id: string }>(operatorCards: T[], encodedNames: string[]): T[] {
  const live = new Set(encodedNames.map((n) => n.toLowerCase()));
  return operatorCards.filter((c) => !live.has(c.id.replace(/^skill-/, '').toLowerCase()));
}
