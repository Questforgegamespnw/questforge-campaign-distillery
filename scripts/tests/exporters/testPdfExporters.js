const assert = require("node:assert/strict");

const {
  normalizeIdentityPitchDocument
} = require("../../../src/exporters/phase1/normalizeIdentityPitchDocument");
const {
  buildIdentityPitchHtml
} = require("../../../src/exporters/phase1/buildIdentityPitchHtml");
const {
  normalizeCampaignConceptDocument
} = require("../../../src/exporters/phase2/normalizeCampaignConceptDocument");
const {
  buildCampaignConceptHtml
} = require("../../../src/exporters/phase2/buildCampaignConceptHtml");

function buildIdentityFixture() {
  const pitch = {
    title: "The Power Awakening",
    pitch: "A campaign about awakening power.",
    about: "Power is shaped through meaningful choices.",
    playersDo: "Players adapt, coordinate, and grow.",
    hook: "The answer is awakening within."
  };

  return {
    metadata: {
      acceptedCount: 3,
      directionCount: 3,
      sourceFile: "submission-001.json"
    },
    identityPitches: {
      primary: pitch,
      adjacent: { ...pitch, title: "The Adjacent Path" },
      wildcard: { ...pitch, title: "The Wild Path" }
    }
  };
}

function buildConceptFixture() {
  const concept = {
    variantType: "core_interpretation",
    conceptTitle: "The First Light",
    oneSentencePremise: "The heroes awaken as a frontier fails.",
    campaignPitch: "A playable campaign premise.",
    startingSituation: "A beacon collapses.",
    centralConflict: "The old order cannot protect everyone.",
    playersDo: "Players defend communities and shape change.",
    recurringCampaignEngine: "Each arc centers on a new crisis.",
    whyNow: "The failures are spreading.",
    factionsOrForces: [
      {
        name: "Wardens",
        role: "Established protectors.",
        wants: "Restore order.",
        pressureOnPlayers: "Demands obedience."
      },
      {
        name: "Assembly",
        role: "Newly awakened communities.",
        wants: "Shared power.",
        pressureOnPlayers: "Demands independence."
      }
    ],
    escalation: "More settlements fail.",
    distinctiveElement: "Power changes communities.",
    meaningfulChoices: [
      {
        choice: "Restore or replace the beacon.",
        whatItChanges: "Who controls protection."
      },
      {
        choice: "Support oversight or independence.",
        whatItChanges: "Who controls awakened power."
      }
    ],
    hook: "The beacon dies during the celebration.",
    systemImplementationNotes: "",
    settingImplementationNotes: ""
  };

  return {
    schemaVersion: "0.9.0",
    submissionId: "submission-001",
    selectedIdentityDirection: "primary",
    generationMode: "three_variants",
    identitySummary: {
      identityTitle: "The Power Awakening",
      identityPitch: "A campaign about awakening power."
    },
    concepts: [
      concept,
      {
        ...concept,
        variantType: "alternate_situation",
        conceptTitle: "The City That Changes"
      },
      {
        ...concept,
        variantType: "distinctive_interpretation",
        conceptTitle: "The Paths of Dawn"
      }
    ]
  };
}

function main() {
  const phase1 = normalizeIdentityPitchDocument(
    buildIdentityFixture()
  );
  const phase1Html = buildIdentityPitchHtml(
    phase1,
    {
      clientName: "Test Group",
      reference: "Submission 001",
      preparedDate: new Date("2026-07-03T12:00:00Z")
    },
    "body{}"
  );

  assert.match(phase1Html, /Campaign Identity Pitches/);
  assert.match(phase1Html, /Test Group/);
  assert.match(phase1Html, /The Wild Path/);
  assert.match(phase1Html, /body\{\}/);

  const phase2 = normalizeCampaignConceptDocument(
    buildConceptFixture()
  );
  const phase2Html = buildCampaignConceptHtml(
    phase2,
    {
      clientName: "Test Group",
      reference: "Submission 001",
      preparedDate: new Date("2026-07-03T12:00:00Z")
    },
    "body{}"
  );

  assert.equal(phase2.concepts.length, 3);
  assert.match(phase2Html, /Campaign Concept Pitches/);
  assert.match(phase2Html, /The City That Changes/);
  assert.match(phase2Html, /Meaningful Choices/);
  assert.match(phase2Html, /body\{\}/);

  console.log("✅ PDF exporter module tests passed");
}

try {
  main();
} catch (error) {
  console.error("❌ PDF exporter module tests failed");
  console.error(error);
  process.exitCode = 1;
}
