const fs = require("fs");
const path = require("path");

function ensureDirectory(directory) {
    fs.mkdirSync(directory, { recursive: true });
}

function writeJsonAtomic(filePath, value) {
    ensureDirectory(path.dirname(filePath));

    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    const body = `${JSON.stringify(value, null, 2)}\n`;

    fs.writeFileSync(temporaryPath, body, "utf8");
    fs.renameSync(temporaryPath, filePath);

    return filePath;
}

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
}

module.exports = {
    ensureDirectory,
    writeJsonAtomic,
    readJson
};
