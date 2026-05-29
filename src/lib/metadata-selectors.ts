import { MetadataService, type MetadataHackingProgram } from "./metadata-service"

export interface HackingProgramViewModel {
  name: string
  deviceIds: number[]
  target: string
  burst: string
  damage: string
  attack: string
  opponent: string
  special: string
  skillType: string
  wiki?: string
}

export type HackingProgramsByDevice = Record<string, HackingProgramViewModel[]>

const UPGRADE_GROUP = "Upgrade / Other"

function normalizeName(name: string | undefined) {
  return (name || "Unknown").replace(/\u00a0/g, " ")
}

function getProgramWiki(name: string) {
  return `https://infinitythewiki.com/${name.replace(/\u00a0/g, "_").replace(/ /g, "_")}`
}

export function toHackingProgramViewModel(program: MetadataHackingProgram): HackingProgramViewModel {
  const name = normalizeName(program.name)

  return {
    name,
    deviceIds: program.devices || [],
    target: Array.isArray(program.target) && program.target.length > 0 ? program.target.join(", ") : "Any",
    burst: program.burst || "-",
    damage: program.damage || "-",
    attack: program.attack || "-",
    opponent: program.opponent || "-",
    special: program.special || "-",
    skillType: Array.isArray(program.skillType) ? program.skillType.join(" / ").toUpperCase() : "-",
    wiki: getProgramWiki(name),
  }
}

export function getHackingDeviceNames(): Record<number, string> {
  return Object.fromEntries(MetadataService.getHackingDevices().map((device) => [device.id, device.name]))
}

export function getHackingProgramsByDevice(): HackingProgramsByDevice {
  const devices = getHackingDeviceNames()
  const groups: HackingProgramsByDevice = {}

  MetadataService.getHackingPrograms().map(toHackingProgramViewModel).forEach((program) => {
    if (program.deviceIds.length === 0) {
      groups[UPGRADE_GROUP] = [...(groups[UPGRADE_GROUP] || []), program]
      return
    }

    program.deviceIds.forEach((id) => {
      const deviceName = devices[id] || `Device ${id}`
      groups[deviceName] = [...(groups[deviceName] || []), program]
    })
  })

  return groups
}

export const hackingDeviceOrder = [
  "EVO Hacking Device",
  "Hacking Device Plus",
  "Hacking Device",
  "Killer Hacking Device",
  UPGRADE_GROUP,
]
