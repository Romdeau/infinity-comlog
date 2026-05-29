import type { EnrichedTrooper } from "@/lib/unit-service"
import type { WeaponMode } from "@/lib/weapon-data"

export type EnrichedProfile = EnrichedTrooper["profiles"][number]
export type WeaponRef = EnrichedProfile["weapons"][number]
export type WeaponChartRow = WeaponMode & { id: number }

export function getUnitProfiles(member: EnrichedTrooper): EnrichedProfile[] {
  return Array.isArray(member.profiles) ? member.profiles : []
}

export function getProfileWeapons(profile: EnrichedProfile): WeaponRef[] {
  return Array.isArray(profile.weapons) ? profile.weapons : []
}

export function getResolvedSkillNames(profile: EnrichedProfile): string[] {
  return Array.isArray(profile.resolvedSkills) ? profile.resolvedSkills : []
}

export function getResolvedEquipmentNames(profile: EnrichedProfile): string[] {
  return Array.isArray(profile.resolvedEquip) ? profile.resolvedEquip : []
}

export function getProfileWeaponIds(profile: EnrichedProfile): number[] {
  const resolvedWeaponIds = Array.isArray(profile?.resolvedWeapons)
    ? profile.resolvedWeapons
        .map((weapon) => weapon?.id)
        .filter((id: unknown): id is number => typeof id === "number")
    : []

  if (resolvedWeaponIds.length > 0) {
    return resolvedWeaponIds
  }

  return getProfileWeapons(profile).map((weapon) => weapon.id)
}
