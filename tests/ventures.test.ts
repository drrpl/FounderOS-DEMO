import { describe, expect, test } from 'vitest';
import { LIFE_AREAS } from '@/lib/life-map';
import {
  VENTURES,
  ventureAgentSet,
  venturesForAgent,
  getVenture,
} from '@/lib/ventures';

import { realAgents } from '@/lib/agents/real';

const KNOWN_AGENTS = new Set(realAgents.map((a) => a.id));

describe('VENTURES', () => {
  test("ILS's one real venture, with a color and brain tag", () => {
    expect(VENTURES.map((v) => v.id)).toEqual(['ils']);
    for (const v of VENTURES) {
      expect(v.focus.length).toBeGreaterThan(0); // executive task list
      expect(v.detail.length).toBeGreaterThan(0);
      expect(v.brainTag.length).toBeGreaterThan(0);
    }
  });

  test('venture color does not collide with any life-area color', () => {
    const areaColors = new Set(LIFE_AREAS.map((a) => a.color));
    for (const v of VENTURES) expect(areaColors.has(v.color)).toBe(false);
  });

  test('every areaAgents key is a real life area; every agent id is real', () => {
    const areaIds = new Set(LIFE_AREAS.map((a) => a.id));
    for (const v of VENTURES) {
      for (const [areaId, agents] of Object.entries(v.areaAgents)) {
        expect(areaIds.has(areaId), `unknown area ${areaId} in ${v.id}`).toBe(true);
        for (const id of agents) {
          expect(KNOWN_AGENTS.has(id), `unknown agent ${id} in ${v.id}/${areaId}`).toBe(true);
        }
      }
    }
  });

  test('the venture staffs marketing and finances at minimum', () => {
    for (const v of VENTURES) {
      for (const required of ['marketing', 'finances']) {
        expect(
          (v.areaAgents[required] ?? []).length,
          `${v.id} has no agents on ${required}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  test('communication is honestly unstaffed — no unified inbox or comms team exists at ILS yet', () => {
    // Matches lib/life-map.ts's own call on this same life area.
    for (const v of VENTURES) expect(v.areaAgents.communication ?? []).toEqual([]);
  });
});

describe('lookups', () => {
  test('getVenture resolves by id and returns null for unknowns', () => {
    expect(getVenture('ils')?.label).toBe('Innovative Leadership Strategies');
    expect(getVenture('nope')).toBeNull();
  });

  test('ventureAgentSet unions all areas for the venture', () => {
    const set = ventureAgentSet('ils');
    const ils = getVenture('ils')!;
    for (const agents of Object.values(ils.areaAgents)) {
      for (const id of agents) expect(set.has(id)).toBe(true);
    }
  });

  test('venturesForAgent reverse lookup finds the one venture', () => {
    expect(venturesForAgent('chief-of-staff').map((v) => v.id)).toEqual(['ils']);
  });

  test('an agent not staffed on any venture area resolves to no ventures', () => {
    expect(venturesForAgent('contract-review')).toEqual([]);
  });
});
