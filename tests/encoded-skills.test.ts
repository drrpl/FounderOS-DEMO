import { afterEach, describe, expect, it, vi } from 'vitest';
import { describeEncodedSkill, encodedSkillAgent, readEncodedSkills } from '@/lib/encoded-skills';

const packSkill = `---
name: lead-intake-run
slug: /lead-intake-run
agent: lead-qualification
---

# /lead-intake-run

> **Purpose.** Pick up new **website** leads and draft replies.
`;

describe('encoded skills', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('prefers the skill description, then the command description, then the Purpose line', () => {
    expect(describeEncodedSkill('---\nname: x\ndescription: Own words\n---\n', 'ignored')).toBe('Own words');
    expect(describeEncodedSkill(packSkill, '---\ndescription: From the command file\n---\n')).toBe('From the command file');
    expect(describeEncodedSkill(packSkill, null)).toBe('Pick up new website leads and draft replies.');
  });

  it('reads the owning agent from pack frontmatter', () => {
    expect(encodedSkillAgent(packSkill)).toBe('lead-qualification');
    expect(encodedSkillAgent('# no frontmatter')).toBeNull();
  });

  it('stays off and fetches nothing without a token', async () => {
    vi.stubEnv('ENCODED_SKILLS_GITHUB_TOKEN', '');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const out = await readEncodedSkills();
    expect(out).toEqual({ skills: [], error: null, enabled: false });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('lists live skills, skips _drafts, and carries the markdown inline', async () => {
    vi.stubEnv('ENCODED_SKILLS_GITHUB_TOKEN', 'test-token');
    vi.stubEnv('ENCODED_SKILLS_COMPANIES', 'Test Co');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        const u = decodeURIComponent(url);
        if (u.includes('/skills?ref=')) {
          return new Response(
            JSON.stringify([
              { name: 'lead-intake-run', type: 'dir', path: 'x' },
              { name: '_drafts', type: 'dir', path: 'y' },
              { name: 'README.md', type: 'file', path: 'z' },
            ]),
          );
        }
        if (u.includes('lead-intake-run/SKILL.md')) return new Response(packSkill);
        return new Response('not found', { status: 404 });
      }),
    );
    const out = await readEncodedSkills();
    expect(out.error).toBeNull();
    expect(out.skills).toHaveLength(1);
    expect(out.skills[0]).toMatchObject({
      slug: 'encoded:Test Co:lead-intake-run',
      name: 'lead-intake-run',
      group: 'Test Co · lead qualification',
      company: 'Test Co',
    });
    expect(out.skills[0].markdown).toContain('Purpose');
  });
});
