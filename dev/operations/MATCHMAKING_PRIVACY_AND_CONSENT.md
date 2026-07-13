# Matchmaking Privacy, Consent, and Introduction Doctrine

← [Back to Developer Documentation](../README-DEV.md)

## Privacy Tiers

### Operator-private

May include:

- internal diagnostics;
- raw avoid text;
- private safety notes;
- contact references;
- contradiction details;
- lifecycle and audit history.

These fields must not appear in match-shareable summaries.

### Match-shareable

May include:

- campaign interests;
- availability summary;
- system openness;
- table style;
- commitment summary;
- Session Zero topics.

This information is sanitized and intended for operator-reviewed matching.

### Contact release

Contact references are released only through an approved introduction record after:

1. operator approval;
2. participant approval from every member;
3. current matchmaking consent;
4. current retention consent;
5. current profile-version validation;
6. successful release readiness validation.

## Consent Fields

Compatibility profiles preserve explicit consent for:

- matchmaking;
- profile retention;
- operator review;
- contact for introduction;
- shareable summary.

Consent is revocable. A profile that loses required consent must leave the active pool and block release.

## Introduction Lifecycle

```text
draft
→ awaiting_operator_approval
→ awaiting_participant_consent
→ approved
→ contact_released
→ introduced
→ archived
```

Decline path:

```text
declined
→ archived
```

## Required Controls

- Drafts contain no released contact data.
- Operator approval is recorded.
- Participant responses are recorded separately.
- Release rechecks current profiles rather than trusting old pair or group results.
- Completion updates profiles to matched only after contact release and successful introduction.
- Every state transition appends audit history.
- Declines do not expose contact references.

## Confidence Gate

Low confidence is not a privacy violation by itself, but it is an operational blocker to immediate introduction.

The operator should reconfirm:

- missing required fields;
- stale availability;
- unclear communication expectations;
- old confirmation timestamps;
- contradictions.

## Demo Data

Demo fixtures use synthetic names and opaque demo contact references.

The console’s clear action must remove only records associated with the known demo dataset and must not wipe unrelated runtime data.

## Source Control

Do not commit live applicant runtime data.

Recommended `.gitignore` entries:

```gitignore
/matchmaking/profiles/
/matchmaking/evaluations/
/matchmaking/introductions/
/matchmaking/pool-index.json
/operator-console/staging/
```

Preserve and commit:

```text
misc/matchmaking-demo/
```

## Human Responsibility

Scores and classifications are decision support. The operator remains responsible for:

- reviewing sensitive context;
- identifying misleading data;
- reconfirming low-confidence profiles;
- approving introductions;
- handling declines respectfully;
- preventing inappropriate disclosure.
