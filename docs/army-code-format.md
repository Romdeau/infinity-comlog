# Infinity Army Code Format

This document describes the proprietary binary format used by Infinity Army 7 and this application to parse army lists.

## Overview

The Army Code is a **Base64 encoded string** containing binary data. To parse it, you must first decode the Base64 string into a byte array (e.g., `Uint8Array`).

### Encoding Handling
Some army codes (especially those copied from the official Army URL or certain app buttons) may be **URI-encoded**.
- Characters like `=` may appear as `%3D`.
- Use `decodeURIComponent(code)` before Base64 decoding.
- Army codes may also use "URL-safe" Base64 (replace `-` with `+` and `_` with `/`), though traditional Base64 is more common.

## Data Types

The format relies heavily on two custom data types:

### Variable Length Integer (VarInt)
Integers are stored using a variable length encoding to save space.
- **1 Byte**: If the value is `< 128`, it is stored as a single byte.
- **2 Bytes**: If the value is `>= 128`, the first byte has its high bit set. The value is calculated as:
  ```typescript
  // b1 = first byte, b2 = second byte
  value = ((b1 & 0x7F) << 8) | b2
  ```

### String
Strings are not null-terminated. They are length-prefixed.
1.  **Length**: A `VarInt` specifying the number of bytes in the string.
2.  **Content**: The string bytes (ASCII/UTF-8).
    - *Note*: If length is 0, the string is empty and no content bytes follow.

## Structure

The binary stream is structured as follows:

### 1. Header
Contains metadata about the list.

| Field | Type | Description |
| :--- | :--- | :--- |
| **Sectorial ID** | `VarInt` | Internal ID of the sectoral. Maps to `factions` in `metadata.json`. |
| **Sectorial Name** | `String` | Internal name slug (e.g., "shindenbutai"). |
| **List Name** | `String` | User-defined name of the army list. |
| **Points** | `VarInt` | Total points cap (e.g., 300). |
| **Group Count** | `VarInt` | Number of Combat Groups in the list. |

### 2. Combat Groups
Repeated `Group Count` times.

| Field | Type | Description |
| :--- | :--- | :--- |
| **Group Number** | `VarInt` | The visible group number (usually 1). |
| **Reinforcement presence** | `Byte` | Schemas 2 and 3 only. `1` means a boolean follows; `0` means absent. |
| **Reinforcement flag** | `Byte` | `0` or `1`, present only when the preceding marker is `1`. |
| **Member Count** | `VarInt` | Number of troopers in this group. |

### 3. Group Members
Repeated `Member Count` times within each group.

| Field | Type | Description |
| :--- | :--- | :--- |
| **Entry ID** | `VarInt` | List entry identifier, often `0`; distinct from the unit ID. |
| **Unit ID** | `VarInt` | Internal ID of the Unit (requires mapping DB). |
| **Group ID** | `VarInt` | Profile group ID within the unit, not the combat group number. |
| **Option ID** | `VarInt` | ID of the profile/loadout option chosen. |
| **Spec-Ops presence** | `Byte` | `0` for an ordinary selection. Custom selections carry additional data. |
| **Special-table presence** | `Byte` | Schema 3 only. `0` when no special-table selections are present. |

The live Army encoder uses schema 3, which adds the optional `spectables` field to each member. Schema 2 omits that field; schema 1 also omits the reinforcement fields. There is no explicit schema version in the code. The parser tries these layouts in order and requires a complete decode, rejecting truncated or trailing data. Legacy custom Spec-Ops payloads remain unsupported and produce an import error.

### Team Ops selections

When the special-table presence byte is `1`, a VarInt item count follows. Each item contains a length-prefixed JSON array of attributes. The parser preserves these as `Trooper.teamOps` so saved lists and reimports retain the choices.

- `stat` attributes add `q` to the named base stat. `move0` and `move1` instead replace the corresponding movement value in centimeters before display conversion.
- `skill`, `equip`, and `weapon` attributes add the referenced item, retaining `q` and `extra` modifiers and using the existing metadata resolvers.
- Upgrades affect only that list entry. Cached faction profiles remain unchanged.
- Malformed attributes and unsupported stat names produce an import error.

The supplied Shindenbutai Team Ops fixture contains two groups of 10 and 5 entries. Its first three entries select BTS +2, Mimetism (-3), and Tactical Awareness respectively.

Current regression exports for Kestrel, Shindenbutai, Operations, and Next Wave live in `src/test/army-codes.ts`. `src/lib/army-parser.test.ts` verifies both combat groups and every selected unit, profile group, and option against the faction files. A separate legacy fixture checks backward compatibility.

## Example Trace

**Code**: `hE4Mc2hpbmRl...` (truncated)

1.  **Sectorial ID**: `0x84 0x4E` -> `1102`
2.  **Sectorial Name**: Length `12` -> "shindenbutai"
3.  **List Name**: Length `21` -> "NightMemeOnMemeStreet"
4.  **Points**: `0x81 0x2C` -> `300`
5.  **Group Count**: `0x02` -> 2 groups
6.  **Group 1**:
    - Number: `1`
    - Members: `1`
    - Member 1: `00` (Start), `1818` (ID), `1` (Group), `1` (Option), `00` (End).
