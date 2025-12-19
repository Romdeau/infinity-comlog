# Missions Development Guide

This guide explains how to maintain and update the `src/data/missions.json` file, which powers the scenario selection and automated scoring logic in the Infinity Comlog.

## JSON Structure

The mission file is an array of mission objects. Each object follows this schema:

### Mission Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | A unique URL-friendly identifier (e.g., `axial-interference`). |
| `name` | `string` | The display name of the mission. |
| `classifieds` | `object` | Configuration for secondary objectives. |
| `hasRoles` | `boolean` | `true` if the mission has distinct Attacker and Defender roles. |
| `objectives` | `array` | A list of scoreable items. |

### Classifieds Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `count` | `number` | The number of classifieds a player should draw. |
| `op` | `number` | How many Objective Points each classified is worth in this mission. |

### Objective Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | A unique identifier for the objective within the mission. |
| `text` | `string` | The text shown to the user. |
| `op` | `number` | OP value awarded when completed. |
| `type` | `string` | Controls how the UI handles the scoring. (See below) |
| `max` | `number` | (Optional) The maximum count for manual/incremental objectives. |
| `role` | `string` | (Optional) Set to `attacker` or `defender` if `hasRoles` is true. |

## Objective Types

| Type | UI Location | Behavior |
| :--- | :--- | :--- |
| `game-end` | Finalise Scoring | Boolean checkbox. Scored once at game end. |
| `round-end` | Turn Tracker | Boolean checkbox. Appears in every Round Scoring section. |
| `manual` | Finalise Scoring | Incremental counter. Use for "1 OP per console" style goals. |
| `round-end-manual` | Turn Tracker | Incremental counter. Appears in every Round Scoring section. |

## Proposing Changes (Style Guide)

1. **IDs**: Use `kebab-case` for all IDs (`id`). They must be unique.
2. **Text**: Use clear, concise language. If an objective has a limit, include it in the text (e.g., `(max 3)`).
3. **Role Consistency**: If a mission has roles, ensure EVERY objective is either common (no `role` field) or correctly assigned to `attacker` or `defender`.
4. **Scoring Accuracy**: Double check OP values against the current ITS PDF.
5. **Types**: Use `round-end` for anything that says "At the end of each Game Round". Use `game-end` for "At the end of the Game".

### Example
```json
{
  "id": "sample-mission",
  "name": "Sample Mission",
  "classifieds": { "count": 1, "op": 1 },
  "hasRoles": false,
  "objectives": [
    { "id": "dominate-round", "text": "Dominate Zone", "op": 1, "type": "round-end" },
    { "id": "kill-hvt", "text": "Kill HVT", "op": 2, "type": "game-end" }
  ]
}
```
