const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const SRC_ROOT = path.join(PROJECT_ROOT, "src");
const SCRIPTS_ROOT = path.join(PROJECT_ROOT, "scripts");
const TEMPLATES_ROOT = path.join(PROJECT_ROOT, "templates");
const SUBMISSIONS_ROOT = path.join(PROJECT_ROOT, "submissions");
const EXPORTS_ROOT = path.join(PROJECT_ROOT, "exports", "submissions");
const TESTS_ROOT = path.join(SCRIPTS_ROOT, "tests");
const FIXTURES_ROOT = path.join(SCRIPTS_ROOT, "fixtures");

function fromProjectRoot(...segments) {
  return path.join(PROJECT_ROOT, ...segments);
}

function fromSrc(...segments) {
  return path.join(SRC_ROOT, ...segments);
}

function fromScripts(...segments) {
  return path.join(SCRIPTS_ROOT, ...segments);
}

function fromTemplates(...segments) {
  return path.join(TEMPLATES_ROOT, ...segments);
}

function fromSubmissions(...segments) {
  return path.join(SUBMISSIONS_ROOT, ...segments);
}

function fromExports(...segments) {
  return path.join(EXPORTS_ROOT, ...segments);
}

module.exports = {
  PROJECT_ROOT,
  SRC_ROOT,
  SCRIPTS_ROOT,
  TEMPLATES_ROOT,
  SUBMISSIONS_ROOT,
  EXPORTS_ROOT,
  TESTS_ROOT,
  FIXTURES_ROOT,
  fromProjectRoot,
  fromSrc,
  fromScripts,
  fromTemplates,
  fromSubmissions,
  fromExports
};
