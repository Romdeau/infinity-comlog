# Specification: Army List Data Persistence and Validation Refactor

## 1. Overview
This track focuses on improving the robustness of the army list import and storage mechanism. Currently, application updates can invalidate stored army lists, forcing users to re-import them. This feature aims to persist the raw base64 data for every imported list, implement schema validation to ensure stored data integrity, and provide user-facing tools to manage this data (export and re-import).

## 2. Functional Requirements

### 2.1. Data Persistence
- **Raw Base64 Storage:** The application MUST store the original, raw base64 string from the Infinity Army 7 tool for every imported army list.
- **Metadata Storage:** Along with the base64 string, the following metadata MUST be stored:
    - **Schema Version:** A version number indicating the structure of the parsed data.
    - **Import Timestamp:** The date and time when the list was imported.
    - **List Name:** The user-friendly name of the list (extracted or user-defined).
    - **Validation Hash:** A checksum of the computed/parsed data to detect corruption or unauthorized modification.
- **Storage Mechanism:** Data will continue to be persisted in **LocalStorage**.

### 2.2. Data Validation
- **Trigger:** Validation checks MUST run automatically **when the application loads**.
- **Logic:** The system will check if the stored computed data matches the current expected schema version.
- **Handling Invalid Data:** If validation fails (e.g., schema mismatch), the system should flag the list and potentially prompt the user or automatically attempt a re-parse using the stored raw base64 data.

### 2.3. User Interface & Settings
- **Settings Page:**
    - A new, standalone **Settings Page** will be implemented.
    - This page is accessible via the "Settings" button in the User/Profile sidebar menu (replacing the current mock/placeholder behavior).
- **Global Data Management (in Settings Page):**
    - **"Re-import All Lists" Button:** A global action to re-process all stored raw base64 strings against the current parser logic. This forces a refresh of all army data without the user needing to manually re-enter codes.
- **Individual List Management (in Army List Detail View):**
    - **"Export List" Button:** A button located on the individual Army List detail view that allows the user to copy or download the original raw base64 string.

## 3. Non-Functional Requirements
- **Performance:** Validation on load should be efficient and not cause a noticeable delay in application startup.
- **Usability:** The "Re-import All" process should provide feedback (e.g., loading spinner, success/failure notifications).
- **Backward Compatibility:** The migration to the new storage format should handle existing legacy stored lists gracefully (e.g., by prompting for a one-time re-import or attempting to migrate if possible).

## 4. Acceptance Criteria
- [ ] Raw base64 strings are persisted in LocalStorage for all new imports.
- [ ] Schema version, timestamp, name, and hash are stored for each list.
- [ ] Application validates stored data schema on startup.
- [ ] A standalone Settings Page exists and is accessible from the sidebar.
- [ ] "Re-import All" functionality in Settings successfully updates all lists using their stored base64 strings.
- [ ] "Export List" functionality in the Army List view returns the correct raw base64 string.

## 5. Out of Scope
- Backend database integration (strictly LocalStorage for now).
- Cloud sync of army lists.
