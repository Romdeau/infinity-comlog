# Infinity Army Code Format

This document describes the proprietary binary format used by Infinity Army 7 and this application to parse army lists.

## Overview

The Army Code is a **Base64 encoded string** containing binary data. To parse it, you must first decode the Base64 string into a byte array (e.g., `Uint8Array`).

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
| **Sectorial ID** | `VarInt` | Internal ID of the faction/sectorial. |
| **Sectorial Name** | `String` | Internal name (e.g., "shindenbutai"). |
| **List Name** | `String` | User-defined name of the army list. |
| **Points** | `VarInt` | Total points cap (e.g., 300). |
| **Group Count** | `VarInt` | Number of Combat Groups in the list. |

### 2. Combat Groups
Repeated `Group Count` times.

| Field | Type | Description |
| :--- | :--- | :--- |
| **Group Number** | `VarInt` | The visible group number (usually 1-10). |
| **Unknown 1** | `VarInt` | Typically `1`. Purpose unknown. |
| **Unknown 2** | `VarInt` | Typically `0`. Purpose unknown. |
| **Member Count** | `VarInt` | Number of troopers in this group. |

### 3. Group Members
Repeated `Member Count` times within each group.

| Field | Type | Description |
| :--- | :--- | :--- |
| **Start Byte** | `Byte` | Always `0x00`. Marks start of member. |
| **Unit ID** | `VarInt` | Internal ID of the Unit (requires mapping DB). |
| **Group ID** | `VarInt` | ID of the combat group this unit belongs to. |
| **Option ID** | `VarInt` | ID of the profile/loadout option chosen. |
| **End Byte** | `Byte` | Always `0x00`. Marks end of member. |

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
