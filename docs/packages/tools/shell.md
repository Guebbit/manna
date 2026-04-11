# Tool: `shell`

## Purpose

Run a shell command when direct command execution is needed.

## Input

```json
{ "command": "ls -la", "timeout": 10000 }
```

`timeout` is optional (milliseconds), default 10 seconds.

## Output

```json
{ "stdout": "...", "stderr": "..." }
```

## Allowed base commands

`cat`, `date`, `df`, `du`, `echo`, `find`, `git`, `grep`, `ls`, `node`, `npm`, `ps`, `pwd`, `uname`

## Good test prompts

- "Run `pwd` and tell me current directory."
- "List files in `packages` with `ls`."
