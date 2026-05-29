# JavaScript Style Guide

This project is primarily TypeScript. For JavaScript configuration files, follow the existing repository style and ESLint rules rather than Google JS or GTS conventions.

## 1. Source File Basics
- **File Naming:** All lowercase, with underscores (`_`) or dashes (`-`). Extension must be `.js`.
- **File Encoding:** UTF-8.
- **Whitespace:** Use spaces, not tabs.

## 2. Source File Structure
- New files should be ES modules (`import`/`export`).
- **Exports:** Match existing file style.
- **Imports:** Use the import style accepted by the configured bundler/tooling.

## 3. Formatting
- **Braces:** Required for all control structures (`if`, `for`, `while`, etc.), even single-line blocks.
- **Indentation:** +2 spaces for each new block.
- **Semicolons:** Match nearby code and avoid formatting-only churn.
- **Column Limit:** No fixed line-length rule is configured. Keep lines readable and follow nearby code.
- **Line-wrapping:** Prefer readable wrapping over formatting-only churn.
- **Whitespace:** Use single blank lines between methods. No trailing whitespace.

## 4. Language Features
- **Variable Declarations:** Use `const` by default, `let` if reassignment is needed. **`var` is forbidden.**
- **Array Literals:** Prefer array literals. Do not use the `Array` constructor for normal arrays.
- **Object Literals:** Prefer object literals and shorthand properties when clear.
- **Classes:** Use class syntax only when it is already the surrounding pattern.
- **Functions:** Prefer arrow functions for nested functions to preserve `this` context.
- **String Literals:** Match nearby code. Do not reformat unrelated quotes.
- **Control Structures:** Prefer `for-of` loops. `for-in` loops should only be used on dict-style objects.
- **`this`:** Only use `this` in class constructors, methods, or in arrow functions defined within them.
- **Equality Checks:** Always use identity operators (`===` / `!==`).

## 5. Disallowed Features
- `with` keyword.
- `eval()` or `Function(...string)`.
- Modifying builtin objects (`Array.prototype.foo = ...`).

## 6. Naming
- **Classes:** `UpperCamelCase`.
- **Methods & Functions:** `lowerCamelCase`.
- **Constants:** `CONSTANT_CASE` (all uppercase with underscores).
- **Non-constant Fields & Variables:** `lowerCamelCase`.

## 7. JSDoc
- Use JSDoc when it adds useful context that names and types do not already provide.
- Do not add boilerplate documentation just to satisfy a stale checklist.

## Tooling
- Lint with `bun run lint`.
- Run the full local gate with `bun run check`.
