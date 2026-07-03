const assert = require("node:assert/strict");

const {
  CONTRACT_VERSION,
  DIRECTIONS,
  buildFingerprintPayload,
  createSourceFingerprint,
  createResponseEnvelope,
  assertResponseEnvelope,
  extractFirstJsonObject
} = require("../../shared/identityPolishRoundTripUtils");

function buildPromptExport() {
  const result = {};

  for (const directionKey of DIRECTIONS) {
    result[directionKey] = {
      title: `${directionKey} title`,
      expansionInput: {
        direction: {
          key: directionKey,
          intent: `${directionKey} intent`
        },
        source: {
          title: `${directionKey} title`,
          pitch: `${directionKey} pitch`,
          about: `${directionKey} about`,
          playersDo: `${directionKey} players do`,
          hook: `${directionKey} hook`
        },
        context: {
          coreNames: ["Hidden Truth"],
          systemNames: ["Clue Web"]
        },
        constraints: {
          mustInclude: [],
          avoid: []
        }
      }
    };
  }

  return result;
}

function main() {
  const exportA = buildPromptExport();
  const exportB = JSON.parse(JSON.stringify(exportA));

  exportB.primary.expansionInput.context = {
    systemNames: ["Clue Web"],
    coreNames: ["Hidden Truth"]
  };

  const payload = buildFingerprintPayload(exportA);
  assert.equal(payload.contractVersion, CONTRACT_VERSION);
  assert.deepEqual(Object.keys(payload.directions), DIRECTIONS);

  const fingerprint = createSourceFingerprint(exportA);
  assert.equal(fingerprint, createSourceFingerprint(exportB));
  assert.match(fingerprint, /^sha256:[a-f0-9]{64}$/);

  const envelope = createResponseEnvelope(
    "submission-001.result.json",
    fingerprint
  );

  assert.deepEqual(
    assertResponseEnvelope(envelope, {
      contractVersion: CONTRACT_VERSION,
      sourceFingerprint: fingerprint
    }),
    []
  );

  const wrongSource = JSON.parse(JSON.stringify(envelope));
  wrongSource.metadata.sourceFingerprint = "sha256:wrong";

  assert.match(
    assertResponseEnvelope(wrongSource, {
      contractVersion: CONTRACT_VERSION,
      sourceFingerprint: fingerprint
    }).join(" "),
    /source mismatch/i
  );

  delete envelope.responses.wildcard;
  assert.match(
    assertResponseEnvelope(envelope, {
      contractVersion: CONTRACT_VERSION,
      sourceFingerprint: fingerprint
    }).join(" "),
    /responses\.wildcard/
  );

  assert.deepEqual(
    extractFirstJsonObject(
      'Commentary before output\n```json\n{"ok":true}\n```\n'
    ),
    { ok: true }
  );

  console.log("✅ Phase 1 round-trip regression tests passed");
}

try {
  main();
} catch (error) {
  console.error("❌ Phase 1 round-trip regression tests failed");
  console.error(error);
  process.exitCode = 1;
}
