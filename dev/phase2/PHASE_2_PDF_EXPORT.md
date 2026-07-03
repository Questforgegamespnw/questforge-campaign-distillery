# Phase 2 PDF Export

← [Back to Developer Documentation](../README.md)

## Purpose

The Phase 2 exporter converts validated Campaign Concept JSON into a client-facing comparison packet.

## Command

```powershell
node scripts/phase2/exportCampaignConceptPdf.js "exports/submissions/<slug>/phase-2/primary/round-trip/04_VALIDATED_CAMPAIGN_CONCEPTS.json" --client "Client Name"
```

Use `--html-only` to create the preview without rendering a PDF.

## Architecture

```text
scripts/phase2/exportCampaignConceptPdf.js
→ src/exporters/phase2/normalizeCampaignConceptDocument.js
→ src/exporters/phase2/buildCampaignConceptHtml.js
→ src/exporters/shared/renderHtmlPdf.js
→ templates/campaign-concept-pdf.css
```

## Output

```text
exports/submissions/<slug>/phase-2/<direction>/client-delivery/
  <slug>_<direction>_campaign-concepts-preview.html
  <slug>_<direction>_campaign-concepts.pdf
```

## Document Structure

1. cover;
2. reading guide and approved identity;
3. three pages per Campaign Concept;
4. final comparison and response guidance.

For three concepts, the current packet is twelve pages.

## Boundary

The exporter assumes the source JSON already passed Phase 2 validation. It does not repair or reinterpret concepts.

## Status

A successful export marks Phase 2 client delivery in `submission-status.json` and records the generated HTML/PDF artifact paths.
