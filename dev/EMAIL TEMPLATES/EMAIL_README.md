# QuestForge Email Templates

This folder contains the three standard client communication templates for the Campaign Distillery workflow.

## Files

1. `01_INITIAL_FORM_RECEIPT.md`
   - Confirms receipt of the intake form.
   - Explains that the next output will be three Phase 1 Identity Pitches.

2. `02_PHASE_1_IDENTITY_PITCH_DELIVERY.md`
   - Delivers the Primary, Adjacent, and Wildcard Identity Pitches.
   - Clearly explains that they are broad, system-agnostic, and setting-agnostic directions rather than finished campaign concepts.
   - Requests structured client feedback for the Phase 2 handoff.

3. `03_PHASE_2_CAMPAIGN_CONCEPT_DELIVERY.md`
   - Delivers the developed Campaign Concept Pitch or concept variants.
   - Includes optional wording for one-concept or three-variant delivery.
   - Includes optional wording for system recommendation timing.

## Placeholder convention

Replace all double-brace placeholders before sending:

```text
{{client_name}}
{{sender_name}}
{{contact_information}}
{{identity_pitch_filename}}
{{selected_identity_direction}}
{{concept_variant_note}}
{{system_recommendation_note}}
{{campaign_concept_filename}}
{{confirmed_system}}
```
