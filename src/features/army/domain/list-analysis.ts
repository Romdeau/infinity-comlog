import type { EnrichedArmyList, EnrichedTrooper } from "@/lib/unit-service"

export type AnalysisMetric = {
  typeData: { name: string; points: number; count: number }[]
  regular: number
  irregular: number
  impetuous: number
  tacticalAwareness: number
  totalSwc: number
  totalSpecialists: number
  finalSpecialists: Record<string, number>
}

const SPECIALIST_LABELS = [
  "Hacker",
  "Doctor",
  "Engineer",
  "Paramedic",
  "Forward Observer",
  "Chain of Command",
  "Specialist Operative",
] as const

function getUnitProfiles(unit: Pick<EnrichedTrooper, "profiles">) {
  return Array.isArray(unit?.profiles) ? unit.profiles : []
}

function getUnitSkillNames(unit: Pick<EnrichedTrooper, "profiles">) {
  const unitSkills = new Set<string>()

  getUnitProfiles(unit).forEach((profile) => {
    profile.resolvedSkills?.forEach((name) => {
      unitSkills.add(name)
    })
  })

  return unitSkills
}

function getSpecialists(unit: Pick<EnrichedTrooper, "profiles">) {
  const specialistSet = new Set<string>()

  getUnitProfiles(unit).forEach((profile) => {
    profile.resolvedSkills?.forEach((name) => {
      const lowerName = name.toLowerCase()
      if (lowerName.includes("hacker")) specialistSet.add("Hacker")
      if (lowerName.includes("doctor")) specialistSet.add("Doctor")
      if (lowerName.includes("engineer")) specialistSet.add("Engineer")
      if (lowerName.includes("paramedic")) specialistSet.add("Paramedic")
      if (lowerName.includes("forward observer")) specialistSet.add("Forward Observer")
      if (lowerName.includes("chain of command")) specialistSet.add("Chain of Command")
      if (lowerName.includes("specialist operative")) specialistSet.add("Specialist Operative")
    })

    profile.resolvedEquip?.forEach((name) => {
      if (name.toLowerCase().includes("hacking device")) specialistSet.add("Hacker")
    })
  })

  return Array.from(specialistSet)
}

export function analyzeList(list: EnrichedArmyList): AnalysisMetric {
  const typePoints: Record<string, number> = {}
  const typeCounts: Record<string, number> = {}

  let regular = 0
  let irregular = 0
  let impetuous = 0
  let tacticalAwareness = 0
  let totalSwc = 0

  list.combatGroups.forEach((group) => {
    group.members.forEach((unit) => {
      const type = unit.type || "Unknown"
      typePoints[type] = (typePoints[type] || 0) + unit.points
      typeCounts[type] = (typeCounts[type] || 0) + 1

      totalSwc += parseFloat(unit.swc || "0")

      const training = unit.training?.toUpperCase()
      if (training === "REGULAR") regular += 1
      else if (training === "IRREGULAR") irregular += 1

      const unitSkills = getUnitSkillNames(unit)
      let hasImpetuous = false
      let hasTacAware = false

      unitSkills.forEach((name) => {
        const lowerName = name.toLowerCase()
        if (lowerName.includes("impetuous") || lowerName.includes("frenzy")) hasImpetuous = true
        if (lowerName.includes("tactical awareness")) hasTacAware = true
      })

      if (hasImpetuous) impetuous += 1
      if (hasTacAware) tacticalAwareness += 1
    })
  })

  const finalSpecialists: Record<string, number> = Object.fromEntries(SPECIALIST_LABELS.map((label) => [label, 0]))

  list.combatGroups
    .flatMap((group) => group.members)
    .map(getSpecialists)
    .forEach((specialists) => {
      specialists.forEach((specialist) => {
        finalSpecialists[specialist] += 1
      })
    })

  const typeData = Object.keys(typePoints)
    .map((type) => ({
      name: type,
      points: typePoints[type],
      count: typeCounts[type],
    }))
    .sort((a, b) => b.points - a.points)

  return {
    typeData,
    regular,
    irregular,
    impetuous,
    tacticalAwareness,
    totalSwc,
    totalSpecialists: Object.values(finalSpecialists).reduce((a, b) => a + b, 0),
    finalSpecialists,
  }
}
