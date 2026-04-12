# AI Coding Assistant Documentation

This documentation is now organized into **4 clear tracks**:

1. **Getting Started** → [/use-the-application](/use-the-application)
2. **Architecture** → [/theory/how-it-works-layered](/theory/how-it-works-layered)
3. **Modeling & Routing** → [/model-selection](/model-selection)
4. **Package Reference** → [/packages/](/packages/)

---

## What this project is

- Local-first TypeScript agent API (`POST /run` and `POST /queue/submit`)
- Agentic loop with tool execution and memory
- Ollama backend with per-step model routing profiles
- Job queue for batches and overnight runs (`all_night` mode)

## If you only read one flow

1. Start here: [/use-the-application](/use-the-application)
2. Queue and overnight tasks: [/queue](/queue)
3. Understand internals: [/theory/how-it-works-layered](/theory/how-it-works-layered)
4. Configure models and routing: [/model-selection](/model-selection)
5. Dive into package/tool contracts: [/packages/](/packages/)

## Fast links

- Queue & all-night mode: [/queue](/queue)
- Scenarios: [/scenarios](/scenarios)
- Agent package: [/packages/agent](/packages/agent)
- LLM package: [/packages/llm](/packages/llm)
- Tools catalog: [/packages/tools/](/packages/tools/)
