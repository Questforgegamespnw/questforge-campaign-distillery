// scripts/testAiPromptExport.js

const fs = require("fs");
const path = require("path");

const { runCampaignPipelineFromForm } = require("../src");
const { exportPitchExpansionPrompts } = require("../src/ai/exportPitchExpansionPrompts");

const INPUT_FILE = path.resolve(
    __dirname,
    "../misc/test-inputs/active-test.json"
);

console.log(`\n🧪 USING INPUT FILE: ${INPUT_FILE}\n`);

function printPromptBlock(label, block = {}) {
    console.log("\n==================================================");
    console.log(`🧭 ${label.toUpperCase()} EXPANSION PROMPT`);
    console.log("==================================================\n");

    console.log(`TITLE: ${block.title || "Untitled"}\n`);

    console.log("----- COPY INTO GPT -----\n");
    console.log(block.prompt || "");
    console.log("\n----- END PROMPT -----\n");
}

function main() {
    if (!fs.existsSync(INPUT_FILE)) {
        throw new Error(`Missing input file: ${INPUT_FILE}`);
    }

    const raw = fs.readFileSync(INPUT_FILE, "utf8");
    const rawSubmission = JSON.parse(raw);

    const pipelineOutput = runCampaignPipelineFromForm(rawSubmission);
    const promptExport = exportPitchExpansionPrompts(pipelineOutput);

    printPromptBlock("primary", promptExport.primary);
    printPromptBlock("adjacent", promptExport.adjacent);
    printPromptBlock("wildcard", promptExport.wildcard);
}

main();