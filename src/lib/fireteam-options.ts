import type {
  FactionPayload,
  FireteamDefinition,
  FireteamEntry,
} from "./faction-data-service"
import type { EnrichedTrooper } from "./unit-service"

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
export type FireteamChoice = {
  key: string
  name: string
  type: string
  notes: string
  combinations: number[][]
}

function matches(
  member: EnrichedTrooper,
  row: FireteamEntry,
  rows: FireteamEntry[],
  data: FactionPayload
) {
  const unit = data.units.find((unit) => (unit.id ?? unit.idArmy) === member.id)
  if (!unit || unit.slug !== row.slug) return false
  const profileGroup = unit.profileGroups.find(
    (group) => group.id === member.groupId
  )
  const option = profileGroup?.options.find(
    (option) => option.id === member.optionId
  )
  if (
    option?.peripheral?.length ||
    profileGroup?.profiles.some((profile) => profile.peripheral?.length)
  )
    return false
  const names = [member.name, ...member.profiles.map((p) => p.name || "")].map(
    normalize
  )
  const fto = `${row.name} ${row.comment}`.match(/\bFTO(?:-\d+)?\b/i)?.[0]
  if (fto && !new RegExp(`\\b${fto}\\b`, "i").test(member.name)) return false
  const restriction = normalize(row.comment.replace(/\([^)]*\)/g, ""))
  if (restriction && !names.some((name) => name.includes(restriction)))
    return false
  // A shared slug can contain separate entries such as Kuang Shi and their Monitor.
  if (
    rows.filter((other) => other.slug === row.slug).length > 1 &&
    !names.some(
      (name) =>
        name === normalize(row.name) ||
        name.startsWith(`${normalize(row.name)} `)
    )
  )
    return false
  return !member.profiles.some((profile) =>
    (profile.resolvedSkills || []).some((skill) =>
      /^(Infiltration|Combat Jump|Parachutist|Peripheral|G: Servant|Synchronized|Controller)(\b|\s*\()/i.test(
        skill
      )
    )
  )
}

function validComposition(
  members: EnrichedTrooper[],
  definition: FireteamDefinition,
  wildcards: FireteamEntry[],
  data: FactionPayload
) {
  const allowedWildcards = /no wildcards/i.test(definition.obs) ? [] : wildcards
  const rows = [
    ...definition.units,
    ...allowedWildcards.filter(
      (wildcard) => !definition.units.some((row) => row.slug === wildcard.slug)
    ),
  ]
  const counts = rows.map(() => 0)
  const assign = (index: number): boolean => {
    if (index === members.length)
      return (
        rows.every((row, i) => counts[i] >= row.min) &&
        (!definition.units.some((row) => row.required) ||
          definition.units.some((row, i) => row.required && counts[i] > 0))
      )
    return rows.some((row, i) => {
      if (counts[i] >= row.max || !matches(members[index], row, rows, data))
        return false
      counts[i]++
      const valid = assign(index + 1)
      counts[i]--
      return valid
    })
  }
  return assign(0)
}

/** Enumerate legal compositions within one combat group, keeping duplicate troopers distinct. */
export function getFireteamChoices(
  members: EnrichedTrooper[],
  data: FactionPayload
): FireteamChoice[] {
  const chart = data.fireteamChart
  if (!chart) return []
  const wildcards = chart.teams
    .filter((team) => /wildcards/i.test(team.name))
    .flatMap((team) => team.units)
  return chart.teams.flatMap((definition, definitionIndex) =>
    definition.type.flatMap((type) => {
      const min = type === "DUO" ? 2 : 3
      const max = type === "CORE" ? 5 : type === "HARIS" ? 3 : 2
      if (!["DUO", "HARIS", "CORE"].includes(type) || !chart.spec[type])
        return []
      const rows = [...definition.units, ...wildcards]
      const eligible = members.flatMap((member, index) =>
        rows.some((row) => matches(member, row, rows, data)) ? [index] : []
      )
      const combinations: number[][] = []
      const visit = (start: number, selection: number[]) => {
        if (
          selection.length >= min &&
          validComposition(
            selection.map((index) => members[index]),
            definition,
            wildcards,
            data
          )
        )
          combinations.push([...selection])
        if (selection.length === max) return
        for (let i = start; i < eligible.length; i++)
          visit(i + 1, [...selection, eligible[i]])
      }
      visit(0, [])
      return combinations.length
        ? [
            {
              key: `${definitionIndex}-${type}`,
              name: definition.name,
              type,
              notes: [chart.desc, definition.obs].filter(Boolean).join(" "),
              combinations,
            },
          ]
        : []
    })
  )
}
