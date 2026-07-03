const path = require("node:path");

function parseCliArgs(argv = process.argv.slice(2)) {
  const positionals = [];
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    const optionText = arg.slice(2);
    const separatorIndex = optionText.indexOf("=");

    if (separatorIndex >= 0) {
      const name = optionText.slice(0, separatorIndex);
      const value = optionText.slice(separatorIndex + 1);
      options[name] = value;
      continue;
    }

    const next = argv[index + 1];

    if (next !== undefined && !next.startsWith("--")) {
      options[optionText] = next;
      index += 1;
    } else {
      options[optionText] = true;
    }
  }

  return { positionals, options };
}

function requirePositional(parsed, index, usageMessage) {
  const value = parsed.positionals[index];

  if (!value) {
    throw new Error(usageMessage);
  }

  return value;
}

function stringOption(parsed, name, fallback = "") {
  const value = parsed.options[name];
  return typeof value === "string" ? value.trim() : fallback;
}

function booleanOption(parsed, name) {
  return parsed.options[name] === true;
}

function resolvedPositionalPath(parsed, index, usageMessage) {
  return path.resolve(
    process.cwd(),
    requirePositional(parsed, index, usageMessage)
  );
}

module.exports = {
  parseCliArgs,
  requirePositional,
  stringOption,
  booleanOption,
  resolvedPositionalPath
};
