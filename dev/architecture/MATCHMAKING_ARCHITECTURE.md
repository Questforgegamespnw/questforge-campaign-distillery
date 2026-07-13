# Matchmaking Architecture

← [Back to Developer Documentation](../README-DEV.md)

## Purpose

The matchmaking branch supports individuals and partial groups seeking a compatible table. It is separate from Campaign Identity Pitch and Campaign Concept development.

```text
Canonical Intake
├─ Campaign Development
└─ Matchmaking
```

Canonical intake is the source boundary. A compatibility profile is a derived operational artifact.

## End-to-End Flow

```text
Main Intake or Matchmaking Addendum
→ Canonical Matchmaking Branch
→ Compatibility Profile
→ Eligibility Gates
→ Pair Compatibility + Confidence
→ Active Pool Comparison
→ Group Analysis
→ Operator Review
→ Introduction Record
→ Operator Approval
→ Participant Responses
→ Controlled Contact Release
→ Introduction Completion
```

## Domain Layout

```text
src/matchmaking/
  data/
    fixtures/
    parsers/
    schemas/
    validators/
  profiles/
  pairs/
  scorers/
  pool/
  groups/
  storage/
  handoffs/
```

### `profiles`

Builds and maintains reusable compatibility profiles.

Responsibilities:

- stable player identity;
- consent state;
- logistics;
- campaign preferences;
- table preferences;
- safety and hard constraints;
- completeness;
- provenance;
- lifecycle;
- sanitized shareable summary.

### `pairs`

Owns pair eligibility, compatibility, confidence, classification, explanations, and stable pair results.

Processing order:

```text
eligibility
→ dimension scoring
→ adaptability
→ confidence
→ classification
→ explanations
```

Blocked pairs receive no numerical overall compatibility score.

### `scorers`

Dimension scorers use the configured weight model:

| Dimension | Maximum |
|---|---:|
| Schedule and logistics | 25 |
| Safety and hard requirements | 20 |
| Commitment | 15 |
| Table culture | 15 |
| Gameplay | 10 |
| Systems | 7 |
| Tone | 5 |
| Genre/aesthetic context | 3 |

Compatibility and confidence are separate. Flexibility may improve adaptability but cannot override hard blockers.

### `pool`

Loads active profiles, excludes self-comparison, compares a target against the pool, separates viable and blocked results, ranks viable matches, and detects stale evaluations.

A result is stale when:

- a source profile version changes;
- a source profile is no longer active;
- the scoring-model version changes;
- a referenced profile is missing.

### `groups`

Builds group candidates from pair results and whole-group constraints.

Group scoring is not a simple average. It includes:

- pair average;
- weakest pair;
- pair-score spread;
- cohesion;
- shared whole-group logistics.

Any blocked pair blocks the group. Whole-group availability is checked independently because pairwise overlaps do not guarantee one shared time for everyone.

### `handoffs`

Owns controlled introductions.

Responsibilities:

- readiness validation;
- sanitized preview;
- operator approval;
- participant responses;
- contact-release gating;
- completion;
- decline;
- archive;
- audit history.

## Eligibility Before Scoring

Hard blockers include:

- inactive or invalid profile state;
- missing required consent;
- no recurring schedule overlap;
- incompatible play format;
- incompatible commitment;
- group-size incompatibility;
- required-versus-excluded system conflict;
- required content versus hard exclusion;
- explicit hard-constraint conflicts.

A blocked result should not be ranked as merely a low score.

## Confidence

Confidence measures the reliability of the recommendation, not preference alignment.

Inputs include:

- completeness;
- age of confirmation;
- warnings;
- contradictions;
- inferred fields.

A high compatibility score with low confidence should produce a reconfirmation action.

## Stable IDs and Provenance

Pair IDs are symmetric and independent of member order.

Group IDs are deterministic for the sorted member set.

Results preserve:

- scoring-model version;
- source profile versions;
- evaluation timestamp.

## Runtime Storage

```text
matchmaking/
  profiles/
  evaluations/
    pairs/
    groups/
  introductions/
  pool-index.json
```

Runtime records may contain private operational information and should not be treated as public fixtures.

## Demo Fixtures

```text
misc/matchmaking-demo/
```

Fixtures use wrappers so demo metadata does not alter the compatibility-profile schema.

Only the validated `profile` payload enters runtime storage.

## Operator Console

The Electron console is the human-review surface. It does not own matching logic.

```text
Operator Console
→ narrow IPC
→ root matchmaking modules
→ runtime storage
```

The console groups duplicate blockers and discussion points for readability without changing engine results.

## Non-Goals

The matcher does not:

- autonomously form groups;
- expose contact data from a high score alone;
- replace operator judgment;
- infer consent;
- treat genre similarity as more important than logistics or safety;
- use AI to override deterministic blockers.
