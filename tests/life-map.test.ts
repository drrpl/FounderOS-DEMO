import { describe, expect, test } from 'vitest';
import {
  CONTACT_TIERS,
  getLifeAreas,
  buildLifeMap,
  lifeAreaForDepartment,
} from '@/lib/life-map';

const LIFE_AREAS = getLifeAreas();
import { LifeMapSchema } from '@/lib/schemas';
import { realAgents } from '@/lib/agents/real';
import { AGENT_BRAIN_SCOPES } from '@/lib/brain-graph';

describe('LIFE_AREAS', () => {
  test("covers ILS's named areas with distinct colors", () => {
    const ids = LIFE_AREAS.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(['sales', 'marketing', 'finances', 'communication']));
    const colors = LIFE_AREAS.map((a) => a.color);
    expect(new Set(colors).size).toBe(colors.length);
  });

  test('marketing breaks down into named modules', () => {
    const marketing = LIFE_AREAS.find((a) => a.id === 'marketing')!;
    expect(marketing.modules.map((m) => m.id)).toEqual(
      expect.arrayContaining(['content', 'email', 'newsletter']),
    );
  });

  test('client management lives under communication', () => {
    const comms = LIFE_AREAS.find((a) => a.id === 'communication')!;
    expect(comms.modules.some((m) => m.id === 'client-management')).toBe(true);
  });

  test('every agent referenced by an area exists in the real roster or scope map', () => {
    const known = new Set([...realAgents.map((a) => a.id), ...Object.keys(AGENT_BRAIN_SCOPES)]);
    for (const area of LIFE_AREAS) {
      for (const id of area.agents) {
        expect(known.has(id), `unknown agent ${id} in area ${area.id}`).toBe(true);
      }
    }
  });

  test('marketing is staffed by the Marketing & Brand department', () => {
    const marketing = LIFE_AREAS.find((a) => a.id === 'marketing')!;
    expect(marketing.agents).toEqual(
      expect.arrayContaining(['marketing-director', 'linkedin', 'brand-positioning']),
    );
  });

  test('communication is honestly unstaffed — no unified inbox exists at ILS yet', () => {
    const comms = LIFE_AREAS.find((a) => a.id === 'communication')!;
    expect(comms.agents).toEqual([]);
    expect(comms.departmentIds).toEqual([]);
  });
});

describe('CONTACT_TIERS', () => {
  test('three priorities: 1 red, 2 yellow, 3 green', () => {
    expect(CONTACT_TIERS.map((t) => t.tier)).toEqual([1, 2, 3]);
    expect(CONTACT_TIERS[0].color).toBe('#ef4444'); // red
    expect(CONTACT_TIERS[1].color).toBe('#eab308'); // yellow
    expect(CONTACT_TIERS[2].color).toBe('#22c55e'); // green
    for (const t of CONTACT_TIERS) {
      expect(t.respond.length).toBeGreaterThan(0);
      expect(t.tags.length).toBeGreaterThan(0);
    }
  });

  test('1 = clients & students, 2 = brand, 3 = personal', () => {
    const tierOf = (tag: string) => CONTACT_TIERS.find((t) => t.tags.includes(tag))?.tier;
    expect(tierOf('client')).toBe(1);
    expect(tierOf('student')).toBe(1);
    expect(tierOf('brand')).toBe(2);
    expect(tierOf('personal')).toBe(3);
    expect(tierOf('friend')).toBe(3);
  });
});

describe('buildLifeMap', () => {
  const map = buildLifeMap();

  test('has a single center node labeled for Ramesh', () => {
    const centers = map.nodes.filter((n) => n.type === 'center');
    expect(centers).toHaveLength(1);
    expect(centers[0].label.toLowerCase()).toContain('ramesh');
  });

  test('one area node per life area, each linked to the center', () => {
    const areas = map.nodes.filter((n) => n.type === 'area');
    expect(areas).toHaveLength(LIFE_AREAS.length);
    for (const a of areas) {
      expect(map.edges).toContainEqual(expect.objectContaining({ source: 'center', target: a.id }));
    }
  });

  test('module nodes inherit their area color and parent', () => {
    const content = map.nodes.find((n) => n.id === 'marketing/content');
    expect(content?.type).toBe('module');
    expect(content?.parent).toBe('marketing');
    expect(content?.color).toBe(LIFE_AREAS.find((a) => a.id === 'marketing')!.color);
  });

  test('contact tier nodes hang off communication/client-management', () => {
    const tierNodes = map.nodes.filter((n) => n.type === 'tier');
    expect(tierNodes).toHaveLength(CONTACT_TIERS.length);
    for (const t of tierNodes) {
      expect(t.parent).toBe('communication/client-management');
    }
  });

  test('payload validates against LifeMapSchema', () => {
    expect(() => LifeMapSchema.parse(map)).not.toThrow();
  });
});

describe('lifeAreaForDepartment', () => {
  test('maps every mapped seeded department to a life area', () => {
    for (const dept of ['dept-sales-bd', 'dept-marketing-brand', 'dept-finance', 'dept-client-success', 'dept-research-bi', 'dept-operations']) {
      const area = lifeAreaForDepartment(dept);
      expect(area, `no life area for ${dept}`).toBeTruthy();
      expect(LIFE_AREAS.some((a) => a.id === area!.id)).toBe(true);
    }
  });

  test('sales is sales; marketing/brand is marketing; finance is finances; client-success is clients; research-bi is knowledge', () => {
    expect(lifeAreaForDepartment('dept-sales-bd')?.id).toBe('sales');
    expect(lifeAreaForDepartment('dept-marketing-brand')?.id).toBe('marketing');
    expect(lifeAreaForDepartment('dept-finance')?.id).toBe('finances');
    expect(lifeAreaForDepartment('dept-client-success')?.id).toBe('clients');
    expect(lifeAreaForDepartment('dept-research-bi')?.id).toBe('knowledge');
  });

  test('dept-tech-ai rolls up to knowledge first, ahead of operations', () => {
    expect(lifeAreaForDepartment('dept-tech-ai')?.id).toBe('knowledge');
  });

  test('executive and legal-risk have no mapped life area — honestly unmapped, not forced', () => {
    expect(lifeAreaForDepartment('dept-executive')).toBeNull();
    expect(lifeAreaForDepartment('dept-legal-risk')).toBeNull();
  });
});
