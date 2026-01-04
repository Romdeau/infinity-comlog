import { describe, it, expect, vi, beforeAll } from 'vitest';
import { unitService, type UnitData } from '@/lib/unit-service';
import type { ArmyList } from '@/lib/army-parser';
import * as fs from 'fs';
import * as path from 'path';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Tikbalang Skill Verification', () => {
  let faction101: UnitData;

  beforeAll(() => {
    const jsonPath = path.resolve(process.cwd(), 'public/data/factions/101.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    faction101 = JSON.parse(jsonContent);

    // Spy on the singleton instance method
    vi.spyOn(unitService, 'getFactionData').mockResolvedValue(faction101);
  });

  it('Enriches Tikbalang skills with correct extra labels', async () => {
    // Construct a minimal raw ArmyList with a Tikbalang
    // Unit ID 33 is Tikbalang
    // We need to pick a profile/option.
    // Looking at 101.json, Tikbalang has options.
    // Let's assume Group 1, Option 1.
    
    const rawList: ArmyList = {
      sectoralId: 101,
      sectoralName: 'PanOceania',
      armyName: 'Test Army',
      points: 300,
      combatGroups: [
        {
          groupNumber: 1,
          members: [
            {
              id: 33,
              groupId: 1, 
              optionId: 1,
              name: ''
            }
          ]
        }
      ]
    };

    const enriched = await unitService.enrichArmyList(rawList, "imperial");
    const tikbalang = enriched.combatGroups[0].members[0];

    // Check Profile 1 (Mobility form or Combat form? Usually defined by profiles array)
    // We expect "BS Attack (SR-1)"
    // We expect "Gizmokit (PH=13)"
    // We expect "Mimetism (-3)"
    // We expect "Terrain (Total)"
    // We expect "Dodge (PH=11)"
    
    // We might need to check which profile has which skills, but generally unit skills apply to profiles.
    // Let's check the resolvedSkills of the first profile.
    
    const skills = tikbalang.profiles[0].resolvedSkills;

    expect(skills).toContain('BS Attack (SR-1)');
    expect(skills).toContain('Gizmokit (PH=13)');
    expect(skills).toContain('Mimetism (-3)');
    expect(skills).toContain('Terrain (Total)');
    expect(skills).toContain('Dodge (PH=11)');
    
    // Check if Lieutenant option is selected or present in skills if option 1 is LT?
    // Option 1 might not be LT. Let's check option 4 (from grep output earlier, id: 4 was LT)
    // But let's check what we have first.
  });

  it('Enriches Tikbalang Lieutenant profile correctly', async () => {
     // Tikbalang LT option seems to be Option ID 4 based on grep output earlier:
     // "type": "LIEUTENANT" ... "id": 4
     
     const rawList: ArmyList = {
      sectoralId: 101,
      sectoralName: 'PanOceania',
      armyName: 'Test Army',
      points: 300,
      combatGroups: [
        {
          groupNumber: 1,
          members: [
            {
              id: 33,
              groupId: 1, 
              optionId: 4, 
              name: ''
            }
          ]
        }
      ]
    };

    const enriched = await unitService.enrichArmyList(rawList, "imperial");
    const tikbalang = enriched.combatGroups[0].members[0];
    const skills = tikbalang.profiles[0].resolvedSkills;
    
    expect(skills.some(s => s.includes('Lieutenant (+1 Order)'))).toBeTruthy();
  });

  it('Enriches Tikbalang equipment correctly (ECM: Guided)', async () => {
    const rawList: ArmyList = {
      sectoralId: 101,
      sectoralName: 'PanOceania',
      armyName: 'Test Army',
      points: 300,
      combatGroups: [
        {
          groupNumber: 1,
          members: [
            {
              id: 33, // Tikbalang
              groupId: 1, 
              optionId: 1,
              name: ''
            }
          ]
        }
      ]
    };

    const enriched = await unitService.enrichArmyList(rawList, "imperial");
    const tikbalang = enriched.combatGroups[0].members[0];
    const equip = tikbalang.profiles[0].resolvedEquip;
    
    // ECM: Guided has ID 239, extra is ID 7 (-6)
    expect(equip).toContain('ECM: Guided (-6)');
  });

  it('Converts DISTANCE extras from cm to inches (Dodge +1", Forward Deployment +8")', async () => {
    // ID 11 is +2.5 (DISTANCE) in 101.json -> should be +1"
    // ID 22 is +20 (DISTANCE) in 101.json -> should be +8"
    
    const mockFactionWithDistances: UnitData = {
      ...faction101,
      units: [
        {
          id: 1,
          name: 'Bipandra',
          isc: 'Bipandra',
          profileGroups: [{
            id: 1,
            profiles: [{
              id: 1,
              skills: [
                { id: 40, extra: [11] } // Dodge (Skill 40) with Extra 11 (+2.5)
              ]
            }],
            options: [{ id: 1, points: 20, swc: '0' }]
          }]
        },
        {
          id: 2,
          name: 'Beasthunter',
          isc: 'Beasthunter',
          profileGroups: [{
            id: 1,
            profiles: [{
              id: 1,
              skills: [
                { id: 161, extra: [22] } // Forward Deployment (Skill 161) with Extra 22 (+20)
              ]
            }],
            options: [{ id: 1, points: 10, swc: '0' }]
          }]
        }
      ]
    };

    vi.spyOn(unitService, 'getFactionData').mockResolvedValue(mockFactionWithDistances);

    const rawList: ArmyList = {
      sectoralId: 101,
      combatGroups: [{
        groupNumber: 1,
        members: [
          { id: 1, groupId: 1, optionId: 1, name: '' },
          { id: 2, groupId: 1, optionId: 1, name: '' }
        ]
      }]
    } as unknown as ArmyList;

    const enriched = await unitService.enrichArmyList(rawList, "imperial");
    
    const bipandra = enriched.combatGroups[0].members[0];
    expect(bipandra.profiles[0].resolvedSkills).toContain('Dodge (+1")');

    const beasthunter = enriched.combatGroups[0].members[1];
    expect(beasthunter.profiles[0].resolvedSkills).toContain('Forward Deployment (+8")');
  });
});
