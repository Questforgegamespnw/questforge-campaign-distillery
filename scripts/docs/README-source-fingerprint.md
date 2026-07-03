# v0.9.1 AI Response Source Fingerprint Pass

This patch updates `scripts/testAiResponseImport.js` so manually imported AI responses cannot be evaluated against the wrong campaign.

## New behavior

- Generates a SHA-256 fingerprint from all three expansion inputs.
- Stores the fingerprint and contract version in `misc/ai-expansion-responses.json`.
- Rejects old flat response files and mismatched campaign responses before section validation.
- Accepts either a raw website-form fixture or an already-generated pipeline result JSON as the input argument.
- Supports `--reset` to regenerate the response template for the chosen source.

## For Johanna's existing result

```bash
node scripts/testAiResponseImport.js misc/submission-03-johannab253.result.json --reset
```

If the result file is stored elsewhere, use its actual path.

Paste responses under:

```json
{
  "metadata": { "...": "leave unchanged" },
  "responses": {
    "primary": { "pitch": "", "about": "", "playersDo": "", "hook": "" },
    "adjacent": { "pitch": "", "about": "", "playersDo": "", "hook": "" },
    "wildcard": { "pitch": "", "about": "", "playersDo": "", "hook": "" }
  }
}
```

Then rerun the same command without `--reset`.
