// src/ai/phase2/index.js

const { buildCampaignConceptInput } = require("./buildCampaignConceptInput");
const { validateCampaignConceptInput } = require("./validateCampaignConceptInput");
const {
  buildCampaignConceptPrompt,
  buildOutputSkeleton,
  expectedConceptCount
} = require("./buildCampaignConceptPrompt");
const {
  validateCampaignConceptOutput,
  semanticWarnings
} = require("./validateCampaignConceptOutput");
const {
  stripMarkdownFence,
  extractFirstJsonObject,
  evaluateCampaignConceptResponse,
  generateCampaignConceptsWithAI
} = require("./evaluateCampaignConceptResponse");
const schema = require("./campaignConceptSchema");

module.exports = {
  buildCampaignConceptInput,
  validateCampaignConceptInput,
  buildCampaignConceptPrompt,
  buildOutputSkeleton,
  expectedConceptCount,
  validateCampaignConceptOutput,
  semanticWarnings,
  stripMarkdownFence,
  extractFirstJsonObject,
  evaluateCampaignConceptResponse,
  generateCampaignConceptsWithAI,
  schema
};
