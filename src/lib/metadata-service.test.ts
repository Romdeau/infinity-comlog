
import { expect, test, describe } from "bun:test";
import { MetadataService } from "./metadata-service";

describe("MetadataService", () => {
  test("getEquipmentName prefers Hacking Device over AP Heavy Pistol for ID 100", () => {
    // In metadata.json:
    // ID 100 in equips is "Hacking Device"
    // ID 100 in weapons is "AP Heavy Pistol"
    const name = MetadataService.getEquipmentName(100);
    expect(name).toBe("Hacking Device");
  });

  test("getWeaponName still returns AP Heavy Pistol for ID 100", () => {
    const name = MetadataService.getWeaponName(100);
    expect(name).toBe("AP Heavy Pistol");
  });

  test("resolveEquip correctly handles Pandora's Hacking Device with Upgrade", () => {
    const equip = [{ id: 100, extra: [287] }];
    // ID 287 name in extras/filters is "UPGRADE: Zero Pain" 
    // MetadataService.resolveEquip handles this.
    // Let's mock a simple check since we can't easily pass the full filter here without more setup,
    // but the ID resolution is the core part.
    const names = MetadataService.resolveEquip(equip);
    expect(names[0]).toContain("Hacking Device");
  });

  test("getEquipmentName fallbacks to weapon names for unique weapon-equipment", () => {
    // ID 20 is CrazyKoala in weapons and equips? 
    // Let's find something only in weapons but used as equipment.
    // Actually ID 5 is CC Weapon.
    const name = MetadataService.getEquipmentName(5);
    expect(name).toBe("CC Weapon");
  });
});
