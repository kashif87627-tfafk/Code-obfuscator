# Code Obfuscator – Requirements (v2.1)

## Overview
A fully client-side web application that:
1. **Obfuscates** source code — replaces all user-defined variable, function, class, and parameter names with random, unreadable identifiers (e.g. `coins` -> `ferfc551`).
2. **Outputs a decode map** — an exportable JSON file mapping `obfuscated -> original` so the code can be reversed.
3. **De-obfuscates** code — accepts obfuscated code + the JSON map file and restores original names.

Primary use case: protect source and game code from decompilation tampering and unauthorized modifications.

---

## Supported Languages & Syntax

| Language | Scope / Declaration Matchers |
|---|---|
| **JavaScript / TypeScript** | `function name(...)`, `var`, `let`, `const`, `class`, parameter lists, anonymous callbacks |
| **Python** | `def func_name(...)`, assignments `var_name = ...`, parameters |
| **C / C++** | Primitive types (`int`, `float`, `double`, `char`, `bool`, `long`, `short`, `unsigned`, `signed`, `auto`, `string`), function definitions, `class` |
| **Java / C#** | Standard class/method definitions, field definitions |

---

## Pages / Screens

### 1. Auth Screen (`index.html`)
- Log In / Sign Up toggle tabs
- Sign Up form: username, email, password, confirm password
- Log In form: email-or-username + password
- Client-side validation: non-empty, email format, password >= 8 chars, passwords match
- Password strength indicator (colour bar)
- Show/hide password toggle
- Session stored in `localStorage` as `cm_session`
- On success -> redirect to `dashboard.html`
- If already logged in -> skip straight to dashboard

### 2. Dashboard (`dashboard.html`)
- Header with logo, user status, logout option
- Supported languages indicator
- Two mode tabs: **Obfuscate** | **De-obfuscate**

---

## Tab 1 – Obfuscate

| Element | Detail |
|---------|--------|
| Input textarea | Paste any supported source code |
| "Load Example" button | Fills textarea with a sample snippet |
| "Clear" button | Resets inputs and outputs |
| Obfuscate button | Runs the engine |
| OUTPUT 1: Obfuscated code | Read-only `<pre>` with Copy button |
| OUTPUT 2: Decode Map JSON | Read-only `<pre>` with Copy + Download buttons |
| Stats strip | Identifiers renamed / Lines / Characters / Runs this session |

---

## Tab 2 – De-obfuscate

| Element | Detail |
|---------|--------|
| Obfuscated code textarea | Paste the obfuscated code |
| Map upload zone | Drag-and-drop OR click to upload `decode-map.json` |
| Map JSON textarea | Manual paste alternative for the map JSON |
| Restore Code button | Runs the reverse engine |
| OUTPUT: Restored code | `<pre>` with Copy + Download buttons |
| Stats strip | Names restored / Lines / Characters / Runs |

---

## Obfuscation Engine (`obfuscator.js`)

### Replacement rules
| Rule | Detail |
|------|--------|
| Random names | 6–9 chars, start with a letter, mix of letters+digits |
| No clashes | Generated names tracked in a `Set`; regenerated if duplicate |
| Consistency | Same original name -> same new name everywhere in the file |
| Reserved words | Never renamed (JS/C/Python keywords + common builtins) |
| Regex escaping | Escaped safely to prevent syntax errors |
| Longest-first sort | Identifiers sorted by length descending before replacement to prevent partial matches |

### Map format (`decode-map.json`)
```json
{
  "ieSHXfg4d": "binary_search_position",
  "gZNif9": "arr",
  "g7MDbzPQW": "val"
}
```

---

## Tech Stack
| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML + CSS + JavaScript (no build step, no CDN) |
| Styling | Clean CSS variables, monospace code panels |
| Auth | Client-side only (`localStorage`) |
| Engine | Pure JS regex + token replacement |
| File I/O | `Blob` + `<a download>`, `FileReader` API for drag-and-drop |
