# QuestForge Manual AI Round-Trip Tool

This package replaces the current three-prompt, three-chat, manually assembled response workflow with:

```text
one preparation command
→ one Markdown prompt
→ one ChatGPT conversation
→ one JSON response file
→ one completion and validation command
```

It does not require an API.

## Usage

### 1. Prepare the round trip

Run against either a raw submission or an existing `.result.json` file:

```bash
node scripts/prepareIdentityPolishRoundTrip.js misc/submissions/results/submission-03-johannab253.result.json
```

This creates:

```text
misc/ai-round-trips/submission-03-johannab253/
  01_IDENTITY_POLISH_PROMPT.md
  02_PASTE_CHATGPT_RESPONSE_HERE.json
  round-trip-status.json
```

### 2. Use ChatGPT Plus manually

1. Open `01_IDENTITY_POLISH_PROMPT.md`.
2. Copy the entire file into one ChatGPT conversation.
3. Copy the single JSON response from ChatGPT.
4. Replace the contents of `02_PASTE_CHATGPT_RESPONSE_HERE.json` with that response.

The importer tolerates a surrounding Markdown JSON fence or brief accidental wrapper text, although the prompt requests bare JSON.

### 3. Complete and validate

```bash
node scripts/completeIdentityPolishRoundTrip.js misc/ai-round-trips/submission-03-johannab253
```

This creates:

```text
03_VALIDATION_RESULT.json
04_VALIDATED_IDENTITY_PITCHES.json
05_VALIDATION_SUMMARY.txt
round-trip-status.json
```

`04_VALIDATED_IDENTITY_PITCHES.json` is only written when all three directions pass.

## Safety retained

The workflow preserves:

- contract version checking;
- exact source fingerprinting;
- rejection of responses generated for a different campaign;
- independent validation of Primary, Adjacent, and Wildcard;
- deterministic fallback data inside the validation report;
- existing four-field response validation.

## Status tracking

`round-trip-status.json` always records:

- the current stage;
- the source file;
- the source fingerprint;
- what has already completed;
- the next action to take.

This is intended to remove uncertainty about where a submission currently sits in the manual AI workflow.

## Existing scripts

The existing `testAiPromptExport.js` and `testAiResponseImport.js` can remain as lower-level diagnostic and regression tools.

The new scripts become the normal operator workflow.
