# Phase 1 PDF Export

← [Back to Developer Documentation](../README.md)

## Purpose

The Phase 1 exporter converts validated Identity Pitch JSON into a client-facing HTML preview and PDF.

## Command

```powershell
node scripts/phase1/exportIdentityPitchPdf.js "exports/submissions/<slug>/phase-1/round-trip/04_VALIDATED_IDENTITY_PITCHES.json" --client "Client Name"
```

Use `--html-only` to skip Chromium rendering.

## Architecture

```text
scripts/phase1/exportIdentityPitchPdf.js
→ src/exporters/phase1/normalizeIdentityPitchDocument.js
→ src/exporters/phase1/buildIdentityPitchHtml.js
→ src/exporters/shared/renderHtmlPdf.js
→ templates/identity-pitch-pdf.css
```

## Output

```text
exports/submissions/<slug>/phase-1/client-delivery/
  <slug>_identity-pitches-preview.html
  <slug>_identity-pitches.pdf
```

## Document Structure

1. cover;
2. Primary direction;
3. Adjacent direction;
4. Wildcard direction;
5. client selection guidance.

## Boundary

The exporter presents validated data. It does not perform selection, generation, or semantic correction.
