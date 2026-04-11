# Tool: `mysql_query`

## Purpose

Execute read-only SQL against MySQL.

## Input

```json
{ "sql": "SELECT * FROM users LIMIT 5", "params": [] }
```

`params` is optional.

## Output

Rows returned by the query.

## Safety

Only statements starting with `SELECT` are accepted.

## Environment variables

- `MYSQL_HOST` (default `localhost`)
- `MYSQL_PORT` (default `3306`)
- `MYSQL_USER` (default `root`)
- `MYSQL_PASSWORD` (default empty)
- `MYSQL_DATABASE` (default empty)

## Good test prompts

- "Run a SELECT query to show the first 3 rows from table X."
- "Count rows in table Y."
