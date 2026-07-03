# Retired and Replaced Tests

## Delete after installing Pass 3

The following old flat tests are replaced:

- `scripts/tests/testAiResponseImport.js`
- `scripts/tests/testBatchForms.js`
- `scripts/tests/testFormFlow.js`
- `scripts/tests/testAiPromptExport.js`
- `scripts/tests/testAiExpansion.js`
- `scripts/tests/testPhase2CampaignConcept.js`

## Why `testAiResponseImport.js` is retired

It tested the former three-response manual workflow and duplicated:

- source fingerprint construction;
- response-envelope validation;
- response-template creation;
- production import/reporting behavior.

Its useful coverage now lives in:

- `phase1/testIdentityPolishRoundTrip.js`
- the production Phase 1 completion workflow;
- shared utility tests.

Do not keep both versions, because the old test can drift into looking like an alternate supported operator workflow.
