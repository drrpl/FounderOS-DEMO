import { getDb } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { SkillsGrid, type SkillCard } from '@/components/SkillsGrid';
import { readPluginSkills, readUserSkills } from '@/lib/skills-catalog';
import { readEncodedSkills } from '@/lib/encoded-skills';

export const dynamic = 'force-dynamic';

const truncate = (t: string, n = 110) => (t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t);

export default async function SkillsPage() {
  // Four catalogs, side by side: encoded-business skills read live from the
  // RameshOS repo on GitHub (opt-in), the real Claude Code skills read live
  // from disk — user-scope ~/.claude/skills plus every installed plugin's
  // skills (SKILL.md loads on demand via /api/skills/[slug]) — AND the
  // operator skill cards that have always lived in this section.
  const encoded = await readEncodedSkills();
  const encodedCards: SkillCard[] = encoded.skills.map((s) => ({
    id: s.slug,
    name: s.name,
    group: s.group,
    description: truncate(s.description),
    meta: s.company,
    filePath: s.path,
    status: 'live',
    markdown: s.markdown,
  }));

  const real = [...readUserSkills(), ...readPluginSkills()];
  const realCards: SkillCard[] = real.map((s) => ({
    id: s.slug,
    name: s.name,
    group: s.group,
    description: truncate(s.description),
    meta: s.path,
    filePath: s.path,
  }));

  const db = getDb();
  const agentNames = Object.fromEntries(db.agents.all().map((a) => [a.id, a.name]));
  const operatorCards: SkillCard[] = db.skills.all().map((s) => ({
    id: s.id,
    name: s.name,
    group: `Operator · ${s.category}`,
    description: truncate(s.description),
    meta: s.ownerAgentId ? (agentNames[s.ownerAgentId] ?? s.ownerAgentId) : 'unassigned',
    filePath: `skills/${s.id}/SKILL.md`,
    status: s.status,
    markdown: s.markdown,
  }));

  const cards = [...encodedCards, ...realCards, ...operatorCards];
  const parts = [
    encoded.enabled
      ? encoded.error
        ? `encoded-business skills unavailable (${encoded.error})`
        : `${encodedCards.length} encoded-business skills live from GitHub`
      : null,
    real.length > 0 ? `${real.length} skills live from ~/.claude (user + plugins)` : null,
    `${operatorCards.length} operator skills`,
  ].filter(Boolean);
  const sourceNote = `${parts.join(' + ')} — open any card to read or download its SKILL.md.`;

  return (
    <div>
      <PageHeader eyebrow="capability library" title="Skills" />
      <SkillsGrid cards={cards} sourceNote={sourceNote} />
    </div>
  );
}
