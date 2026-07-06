// src/ai/phase2/campaignConceptSchema.js

const SCHEMA_VERSION = "0.9.0";
const CONTRACT_VERSION = "0.9.0";

const IDENTITY_DIRECTIONS = Object.freeze([
  "primary",
  "adjacent",
  "wildcard"
]);

const GENERATION_MODES = Object.freeze([
  "single",
  "three_variants"
]);

const GENRE_CONTEXT_FIELDS = Object.freeze([
  "legacyGenre",
  "eras",
  "aesthetics",
  "worldConditions"
]);

const CONTEXT_STATUSES = Object.freeze([
  "confirmed",
  "preferred",
  "open",
  "undecided"
]);

const VARIANT_TYPES = Object.freeze([
  "core_interpretation",
  "alternate_situation",
  "distinctive_interpretation"
]);

const CONCEPT_REQUIRED_FIELDS = Object.freeze([
  "variantType",
  "conceptTitle",
  "oneSentencePremise",
  "campaignPitch",
  "startingSituation",
  "centralConflict",
  "playersDo",
  "recurringCampaignEngine",
  "whyNow",
  "factionsOrForces",
  "escalation",
  "distinctiveElement",
  "meaningfulChoices",
  "hook"
]);

const CONCEPT_OPTIONAL_FIELDS = Object.freeze([
  "systemImplementationNotes",
  "settingImplementationNotes"
]);

const FACTION_REQUIRED_FIELDS = Object.freeze([
  "name",
  "role",
  "wants",
  "pressureOnPlayers"
]);

const CHOICE_REQUIRED_FIELDS = Object.freeze([
  "choice",
  "whatItChanges"
]);

module.exports = {
  SCHEMA_VERSION,
  CONTRACT_VERSION,
  IDENTITY_DIRECTIONS,
  GENERATION_MODES,
  GENRE_CONTEXT_FIELDS,
  CONTEXT_STATUSES,
  VARIANT_TYPES,
  CONCEPT_REQUIRED_FIELDS,
  CONCEPT_OPTIONAL_FIELDS,
  FACTION_REQUIRED_FIELDS,
  CHOICE_REQUIRED_FIELDS
};
