const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  stableValue,
  createFingerprint
} = require("../shared/fingerprints");
const {
  stripMarkdownFence,
  extractFirstJsonObject,
  normalizeResponseValue
} = require("../shared/aiResponseParsing");
const {
  parseCliArgs,
  stringOption,
  booleanOption
} = require("../shared/cliArgs");
const {
  readJson,
  writeJson,
  writeText,
  readText
} = require("../shared/jsonFiles");
const {
  getRoundTripPaths,
  updateRoundTripStatus
} = require("../shared/roundTripFiles");

function main() {
  assert.deepEqual(
    stableValue({ b: 2, a: { d: 4, c: 3 } }),
    { a: { c: 3, d: 4 }, b: 2 }
  );

  assert.equal(
    createFingerprint({ a: 1, b: 2 }),
    createFingerprint({ b: 2, a: 1 })
  );

  assert.equal(stripMarkdownFence("```json\n{\"ok\":true}\n```"), "{\"ok\":true}");
  assert.deepEqual(
    extractFirstJsonObject("Here is the result:\n{\"ok\":true}\nDone."),
    { ok: true }
  );
  assert.equal(normalizeResponseValue({ ok: true }), "{\"ok\":true}");

  const parsed = parseCliArgs([
    "--direction",
    "primary",
    "input.json",
    "--html-only",
    "--client=Test Group"
  ]);
  assert.deepEqual(parsed.positionals, ["input.json"]);
  assert.equal(stringOption(parsed, "direction"), "primary");
  assert.equal(stringOption(parsed, "client"), "Test Group");
  assert.equal(booleanOption(parsed, "html-only"), true);

  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "questforge-shared-test-")
  );
  const jsonPath = path.join(tempRoot, "nested", "test.json");
  const textPath = path.join(tempRoot, "nested", "test.txt");

  writeJson(jsonPath, { ok: true });
  writeText(textPath, "hello");
  assert.deepEqual(readJson(jsonPath), { ok: true });
  assert.equal(readText(textPath), "hello");

  const artifacts = getRoundTripPaths(tempRoot, "phase1");
  writeJson(artifacts.status, {
    stage: "awaiting",
    createdAt: "original"
  });
  const updated = updateRoundTripStatus(artifacts, {
    stage: "complete"
  });

  assert.equal(updated.stage, "complete");
  assert.equal(updated.createdAt, "original");
  assert.equal(typeof updated.updatedAt, "string");

  fs.rmSync(tempRoot, { recursive: true, force: true });

  console.log("✅ Shared script utility tests passed");
}

try {
  main();
} catch (error) {
  console.error("❌ Shared script utility tests failed");
  console.error(error);
  process.exitCode = 1;
}
