# Use the Application

This is the shortest path from zero to first successful agent run.

## 1) Install dependencies

```bash
npm install
```

## 2) Start Ollama + Open WebUI stack

```bash
cd infra/podman
cp .env.example .env
# set LINUX_USERNAME and WEBUI_SECRET_KEY
docker compose --env-file .env up -d
```

- Open WebUI: `http://localhost:3000`
- Ollama API: `http://localhost:11434`

## 3) Start the API

```bash
cd /path/to/AI-coding-assistant
npm run dev
```

Default API URL: `http://localhost:3001`

## 4) Run your first task

```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"task":"List files in the current directory"}'
```

## 5) What should happen

- API receives `task`
- Agent builds prompt + context + memory + tool list
- LLM returns JSON with `thought`, `action`, `input`
- Tool executes (if `action` is not `none`)
- Loop repeats until done or max 5 steps

## 6) Enable optional browser tool

```bash
npx playwright install chromium
```

Then add `browserTool` in `apps/api/src/index.ts` when creating `new Agent([...])`.

## 7) Common troubleshooting

- Ollama not reachable: check `OLLAMA_BASE_URL` (default `http://localhost:11434`)
- Empty/invalid request: ensure body includes non-empty `"task"`
- MySQL tool fails: verify `MYSQL_*` env vars and DB availability

## 8) Learn-by-doing next

Go to [/scenarios](/scenarios) and run the exercises one by one.
