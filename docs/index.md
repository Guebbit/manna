# AI Coding Assistant Documentation

This docs site is built for **learning by doing**.

If you want an ADHD-friendly path, read in layers:

1. **Surface (broad)**: [/theory/how-it-works-layered](/theory/how-it-works-layered)
2. **Packages map**: [/packages/](/packages/)
3. **Theory details**: [/theory/agent-loop](/theory/agent-loop)
4. **Practical drills**: [/scenarios](/scenarios)

## What this project is

- Local-first TypeScript agent API (`POST /run`)
- Uses Ollama as the model backend
- Can call tools in a multi-step loop

## Core idea in one line

The agent loops: **think → choose tool → execute → think again** until done (max 5 steps).

## Quick links

- Layered overview + ideas/examples: [/theory/how-it-works-layered](/theory/how-it-works-layered)
- Run instructions: [/use-the-application](/use-the-application)
- Package map: [/packages/](/packages/)
- Tool-by-tool docs: [/packages/tools/](/packages/tools/)
