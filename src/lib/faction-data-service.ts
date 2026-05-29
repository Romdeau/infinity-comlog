import type { FactionFilters } from "./metadata-service"

export type FactionItemRef = {
  id: number
  q?: number
  extra?: number[]
}

export type FactionOrder = {
  type?: string
}

export type FactionProfile = {
  id?: number
  name?: string
  cc?: number
  bs?: number
  ph?: number
  wip?: number
  arm?: number
  bts?: number
  w?: number
  s?: number
  move?: number[]
  type?: number
  skills?: FactionItemRef[]
  weapons?: FactionItemRef[]
  equip?: FactionItemRef[]
  str?: boolean | number
  logo?: string
}

export type FactionOption = {
  id: number
  name?: string
  points?: number
  swc?: string | number
  weapons?: FactionItemRef[]
  skills?: FactionItemRef[]
  equip?: FactionItemRef[]
  orders?: FactionOrder[]
  logo?: string
}

export type FactionProfileGroup = {
  id: number
  profiles: FactionProfile[]
  options: FactionOption[]
}

export type FactionUnit = {
  id?: number
  idArmy?: number
  name: string
  isc?: string
  logo?: string
  profileGroups: FactionProfileGroup[]
}

export type FactionPayload = {
  units: FactionUnit[]
  filters?: FactionFilters
  version?: string
}

const factionCache: Record<number, FactionPayload> = {}

export function getFactionDataUrl(factionId: number, rawBaseUrl = import.meta.env?.BASE_URL || "/") {
  const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`
  return `${baseUrl}data/factions/${factionId}.json`
}

export async function loadFactionData(factionId: number): Promise<FactionPayload | null> {
  if (factionCache[factionId]) return factionCache[factionId]

  try {
    const response = await fetch(getFactionDataUrl(factionId))
    if (!response.ok) throw new Error(`Faction ${factionId} not found`)

    const data = await response.json() as FactionPayload
    factionCache[factionId] = data
    return data
  } catch (error) {
    console.error(`Failed to load unit data for faction ${factionId}:`, error)
    return null
  }
}

export function setFactionDataForTest(factionId: number, data: FactionPayload) {
  factionCache[factionId] = data
}

export function clearFactionDataCacheForTest() {
  Object.keys(factionCache).forEach((key) => delete factionCache[Number(key)])
}
