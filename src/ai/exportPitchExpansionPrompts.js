// src/ai/exportPitchExpansionPrompts.js

const { buildExpansionInput } = require("./buildExpansionInput");
const { buildExpansionPrompt } = require("./expandPitch");

const DIRECTIONS = ["primary", "adjacent", "wildcard"];

function buildDirectionPrompt(directionKey, pipelineOutput = {}) {
    const clientPitch = pipelineOutput.clientPitch?.[directionKey] || {};
    const resolved = pipelineOutput.resolved?.[directionKey] || {};

    const basePitch = [
        clientPitch.pitch,
        clientPitch.about,
        clientPitch.playersDo,
        clientPitch.distinctHook
    ]
        .filter(Boolean)
        .join("\n\n");

    const expansionInput = buildExpansionInput(resolved, basePitch);
    const prompt = buildExpansionPrompt(expansionInput);

    return {
        title: clientPitch.title || "",
        structured: clientPitch,
        prompt
    };
}

function exportPitchExpansionPrompts(pipelineOutput = {}) {
    const result = {};

    for (const directionKey of DIRECTIONS) {
        result[directionKey] = buildDirectionPrompt(directionKey, pipelineOutput);
    }

    return result;
}

module.exports = {
    exportPitchExpansionPrompts
};