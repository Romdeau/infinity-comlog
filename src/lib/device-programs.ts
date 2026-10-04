import { MetadataService } from "./metadata-service"
import { toHackingProgramViewModel } from "./metadata-selectors"
import type { EnrichedProfile } from "@/components/list-view/list-view-helpers"

export function getDevicePrograms(
  deviceName: string,
  profile: EnrichedProfile
) {
  const device = MetadataService.getHackingDevices()
    .sort((a, b) => b.name.length - a.name.length)
    .find((device) => deviceName.startsWith(device.name))
  if (!device) return null
  // Upgrades on the clicked device belong only to that device. Standalone
  // upgrade skills/equipment also apply to this profile, never other profiles.
  const upgrades = [
    deviceName,
    ...(profile.resolvedSkills || []),
    ...(profile.resolvedEquip || []).filter(
      (name) => !name.includes("Hacking Device")
    ),
  ]
    .filter((name) => /upgrades?:/i.test(name))
    .map((name) => {
      const text = name.slice(name.search(/upgrades?:/i))
      return name.includes("Hacking Device (") ? text.replace(/\)$/, "") : text
    })
  const programs = MetadataService.getHackingPrograms()
    .map(toHackingProgramViewModel)
    .filter(
      (program) =>
        program.deviceIds.includes(device.id) ||
        upgrades.some((upgrade) =>
          upgrade.toLowerCase().includes(program.name.toLowerCase())
        )
    )
    .map((program) => ({
      ...program,
      added: !program.deviceIds.includes(device.id),
      upgrades: upgrades.filter((upgrade) =>
        upgrade.toLowerCase().includes(program.name.toLowerCase())
      ),
    }))
  return { device, programs, upgrades: [...new Set(upgrades)] }
}
