# Tool: `image_classify`

## What it does in plain English

> "Look at this image and tell me what you see."

Sends an image to a **vision model** (multimodal LLM) via Ollama and gets back a description or classification.

## Input

```json
{
  "path": "relative/path/to/image.png",
  "prompt": "optional question or instruction",
  "model": "optional model override"
}
```

| Field | Required | Default | Notes |
|---|---|---|---|
| `path` | ✅ | — | Path to image file, relative to project root |
| `prompt` | ❌ | `"Describe this image."` | What to ask the vision model |
| `model` | ❌ | `TOOL_VISION_MODEL` or `llava-llama3` | Override the vision model for this call |

## Output

A plain-text description or answer from the vision model.

```
"The image shows a great white shark swimming near the surface of the ocean.
The shark's distinctive dorsal fin is clearly visible above the waterline."
```

## Defaults

- Model: reads `TOOL_VISION_MODEL` env var, falls back to `llava-llama3`
- Path is resolved against the project root — traversal outside that boundary is rejected

## How the tool works internally

```text
Image file on disk
    ↓
Tool reads file bytes and encodes them as Base64
    ↓
POST /api/generate  →  Ollama
  { model: "llava-llama3", prompt: "...", images: ["<base64>"] }
    ↓
Ollama passes image to vision model
    ↓
Model returns text description
    ↓
Tool returns description to agent
```

## Real-life use cases

### Use case 1 — Describe a screenshot for documentation

You have a UI screenshot and want to auto-generate alt text or a doc description.

**Prompt:**
```
Classify the image at data/screenshots/dashboard.png and describe what UI elements are visible.
```

**What happens:**
1. Tool reads `data/screenshots/dashboard.png`
2. Encodes it as Base64
3. Sends to `llava-llama3` via Ollama
4. Returns: `"A web dashboard showing a sidebar navigation, a bar chart in the center, and a table of recent orders below."`

---

### Use case 2 — Detect a bug from a screenshot

**Prompt:**
```
Look at data/bugs/error-screenshot.png and describe what error is shown.
```

Agent reads the error message text visible in the screenshot and explains it.

---

### Use case 3 — Check a diagram

**Prompt:**
```
Describe the architecture diagram at docs/images/architecture.png.
```

---

### Use case 4 — Custom question about an image

**Prompt:**
```
Classify the image at data/examples/shark.jpg and tell me what species it might be.
```

The agent uses a custom `prompt` field: `"What species does this animal appear to be?"`

---

## Good test prompts

| What you type | What the agent does |
|---|---|
| `Classify data/examples/shark.jpg` | Describes the image content |
| `What does the image at data/screenshots/home.png show?` | Returns UI/content description |
| `Is there any text visible in data/images/sign.jpg?` | Vision model reads text in image (OCR-like) |
| `Describe the chart in data/exports/revenue-chart.png` | Describes chart type, axes, data shape |
