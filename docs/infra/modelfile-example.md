# Ollama Modelfile Example

This is a practical template for creating custom Ollama Modelfiles in this project.

```text
# Base model to derive from
FROM qwen3:4b

# ===== RANDOMNESS / CREATIVITY =====
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 50
PARAMETER min_p 0.05

# ===== REPETITION CONTROL =====
PARAMETER repeat_penalty 1.2
PARAMETER presence_penalty 0.3

# ===== CONTEXT / PERFORMANCE =====
PARAMETER num_ctx 2048

# ===== SYSTEM PROMPT =====
SYSTEM You are a concise, accurate assistant. Prefer short answers.
```
