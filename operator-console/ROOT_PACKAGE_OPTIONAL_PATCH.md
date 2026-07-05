# Optional Root Package Scripts

The root `package.json` does not need to change for v0.1. The operator console can be installed and run from inside `operator-console/`.

If you want root-level convenience commands later, add these scripts manually:

```json
{
  "scripts": {
    "console": "npm --prefix operator-console run dev",
    "console:install": "npm --prefix operator-console install"
  }
}
```

Do not add npm workspaces yet unless you want a separate repository-structure refactor.
