# CodeMask

CodeMask is a lightweight, client-side source code identifier obfuscation and de-obfuscation tool. It protects source logic against trivial reverse-engineering, tampering, and variable inspection by replacing user-defined identifiers (functions, variables, parameters, and classes) with non-repeating randomized tokens while generating a reversible JSON decode map.

---

## Supported Languages

CodeMask parses and processes declaration contexts across the following languages:

| Language | Extracted Declaration Patterns |
|---|---|
| **JavaScript / TypeScript** | `function foo()`, `var x`, `let y`, `const z`, `class Foo`, parameter lists |
| **Python** | `def function_name(arg1, arg2):`, assignment targets `variable_name = ...` |
| **C / C++** | Primitive/typed declarations (`int`, `float`, `double`, `char`, `bool`, `long`, `short`, `unsigned`, `signed`, `auto`, `string`), function definitions, `class Foo` |
| **Java / C#** | Standard class and method declarations, typed field declarations |

*Note: Language-specific keywords, standard library built-ins, and control-flow syntax (e.g. `if`, `else`, `while`, `return`, `for`, `print`, `console.log`) are preserved automatically.*

---

## Features

- **Identifier Obfuscation**: Replaces declared function names, variable names, class names, and parameters with randomized 6-9 character alphanumeric strings.
- **Consistent Mapping**: Identifiers used across multiple scopes or calls are consistently mapped to the identical obfuscated token throughout the entire input.
- **Collision-Free Token Generation**: All generated tokens are validated against an internal set to ensure zero clashing or naming duplicates.
- **Reversible Decode Map (JSON)**: Produces an exportable JSON mapping file (`decode-map.json`) enabling complete restoration of the original source code.
- **De-obfuscation Engine**: Reverse-maps obfuscated files using either drag-and-drop JSON upload or direct map pasting.
- **100% Client-Side Execution**: All processing executes in the browser using vanilla JavaScript. No code is transmitted to external servers or cloud services.
- **Zero Build Dependencies**: Runs directly from disk or via any static file server without requiring npm, Webpack, or external libraries.

---

## Project Structure

```
├── dashboard.html      # Main interface with Obfuscate & De-obfuscate modes
├── obfuscator.js       # Core obfuscation and de-obfuscation parsing engine
├── style.css           # UI design and dark theme styling
├── requirements.md     # Engineering requirements and system specifications
└── README.md           # Documentation and usage instructions
```

---

## Getting Started

### Option 1: Direct File Execution
Clone or download the repository and open `dashboard.html` directly in any modern web browser:

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
# Open directly in default browser:
# On Windows:
start dashboard.html
# On macOS:
open dashboard.html
# On Linux:
xdg-open dashboard.html
```

### Option 2: Local Static Server
You can also serve the files locally using standard utility servers:

Using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000/dashboard.html` in your browser.

Using Node.js:
```bash
npx serve .
```

---

## Usage Guide

### 1. Obfuscating Code

1. Open `dashboard.html` and stay on the **Obfuscate** tab.
2. Paste your source code into the **Input Code** panel (or click **Load Example**).
3. Click **Obfuscate Code**.
4. The system produces:
   - **Output 1 (Obfuscated Code)**: The transformed source code ready for compilation or deployment. Use the **Copy** button to copy it.
   - **Output 2 (Decode Map)**: A JSON mapping of `{"obfuscated_token": "original_name"}`. Click **Download JSON** to save `decode-map.json`.

### 2. De-obfuscating Code

1. Navigate to the **De-obfuscate** tab in `dashboard.html`.
2. Paste the obfuscated source code into the **Obfuscated Code** panel.
3. Provide the decode map by either:
   - Dragging and dropping your `decode-map.json` file onto the upload zone.
   - Clicking the upload zone to select the file.
   - Pasting the JSON content directly into the **Or Paste Map JSON** area.
4. Click **Restore Code**.
5. The recovered original code will be displayed in the **Restored Code** panel, available to copy or download.

---

## Example

### Input (Python)
```python
def binary_search_position(arr, val, start, end):
    while start <= end:
        mid = (start + end) // 2
        if arr[mid] == val:
            return mid + 1
        elif arr[mid] < val:
            start = mid + 1
        else:
            end = mid - 1
    return start
```

### Obfuscated Output
```python
def ieSHXfg4d(gZNif9, g7MDbzPQW, OqmxuYH3o, bwyfUow):
    while OqmxuYH3o <= bwyfUow:
        PEvsMJlmc = (OqmxuYH3o + bwyfUow) // 2
        if gZNif9[PEvsMJlmc] == g7MDbzPQW:
            return PEvsMJlmc + 1
        elif gZNif9[PEvsMJlmc] < g7MDbzPQW:
            OqmxuYH3o = PEvsMJlmc + 1
        else:
            bwyfUow = PEvsMJlmc - 1
    return OqmxuYH3o
```

### Decode Map (`decode-map.json`)
```json
{
  "ieSHXfg4d": "binary_search_position",
  "gZNif9": "arr",
  "g7MDbzPQW": "val",
  "OqmxuYH3o": "start",
  "bwyfUow": "end",
  "PEvsMJlmc": "mid"
}
```

---

## Privacy & Security

CodeMask executes entirely within the client's local browser environment. No network requests, telemetry, or analytics are sent to remote services. All code inputs, obfuscated outputs, and mapping definitions remain on your local machine.

---

## License

This project is licensed under the MIT License.
