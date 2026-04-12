# Tool: `scaffold_project`

## Purpose

Create a new project by copying one boilerplate template.

## Input

```json
{
  "template": "react-ts",
  "projectName": "my-react-app",
  "overwrite": false,
  "metadataFile": "template.json"
}
```

- `template`: relative path under `BOILERPLATE_ROOT`
- `projectName`: relative path under `PROJECT_OUTPUT_ROOT`
- `overwrite`: optional, default `false`
- `metadataFile`: optional, default `template.json`

## Output

```json
{
  "template": "react-ts",
  "projectPath": "data/generated-projects/my-react-app",
  "outputRoot": "data/generated-projects",
  "boilerplateRoot": "data/boilerplates",
  "metadata": {}
}
```

If `metadataFile` exists in the template directory, it is returned as parsed JSON (or raw text when not valid JSON).

## Safety

- Reads only inside `BOILERPLATE_ROOT` (default `data/boilerplates`)
- Writes only inside `PROJECT_OUTPUT_ROOT` (default `data/generated-projects`)
- Rejects traversal outside allowed roots
- Available only when `/run` body includes `"allowWrite": true`
