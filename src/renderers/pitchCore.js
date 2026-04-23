const {
    first,
    second,
    cleanName,
    humanizeName,
    uniqueByName,
    extractIds
} = require("./pitchCleanup");

function buildPitchContext(selections = {}) {
    const coreFrames = uniqueByName(selections.coreFrames || []);
    const systemFrames = uniqueByName(selections.systemFrames || []);
    const genreSkin = uniqueByName(selections.genreSkin || []);
    const toneSkin = uniqueByName(selections.toneSkin || []);
    const environmentSkins = uniqueByName(selections.environmentSkins || []);

    const coreA = first(coreFrames);
    const coreB = second(coreFrames);
    const systemA = first(systemFrames);
    const systemB = second(systemFrames);
    const genre = first(genreSkin);
    const tone = first(toneSkin);

    const label = cleanName(selections.label, "direction").toLowerCase();
    const emphasis = cleanName(selections.emphasis, "");
    const includeNotes = cleanName(selections.includeNotes, "");
    const excludeNotes = cleanName(selections.excludeNotes, "");
    const experienceProfile = cleanName(selections.experienceProfile, "standard").toLowerCase();

    const coreAName = cleanName(coreA?.name, "Hidden Truth");
    const coreBName = cleanName(coreB?.name, "");
    const systemAName = cleanName(systemA?.name, "Investigation");
    const systemBName = cleanName(systemB?.name, "");
    const genreName = cleanName(genre?.name, "Fantasy");
    const toneName = cleanName(tone?.name, "");

    const envNames = environmentSkins
        .map((entry) => humanizeName(entry?.name))
        .filter(Boolean);

    const coreIds = extractIds(coreFrames);

    return {
        coreFrames,
        systemFrames,
        genreSkin,
        toneSkin,
        environmentSkins,
        coreA,
        coreB,
        systemA,
        systemB,
        genre,
        tone,
        label,
        emphasis,
        includeNotes,
        excludeNotes,
        experienceProfile,
        coreAName,
        coreBName,
        systemAName,
        systemBName,
        genreName,
        toneName,
        envNames,
        coreIds
    };
}

module.exports = {
    buildPitchContext
};