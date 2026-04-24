function first(array) {
    return Array.isArray(array) && array.length > 0 ? array[0] : null;
}

function second(array) {
    return Array.isArray(array) && array.length > 1 ? array[1] : null;
}

function cleanName(value, fallback = "") {
    if (!value || typeof value !== "string") {
        return fallback;
    }

    return value.replace(/\s+/g, " ").trim();
}

function humanizeName(name) {
    if (!name || typeof name !== "string") {
        return "";
    }

    const cleaned = name
        .replace(/\//g, " ")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const words = cleaned.split(" ");

    return words
        .map((word, index) => {
            if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
            return word.toLowerCase();
        })
        .join(" ");
}

function sentenceCase(value) {
    if (!value || typeof value !== "string") {
        return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}

function stripLeadingWhile(text) {
    if (!text) return "";
    return text.replace(/^while\s+/i, "").trim();
}

function stripTrailingPeriod(text = "") {
    return cleanName(text).replace(/\.$/, "");
}

function normalizeDescription(text, fallback = "") {
    const cleaned = cleanName(text, fallback);
    if (!cleaned) {
        return "";
    }

    return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function normalizeSystemLead(text = "") {
    const cleaned = stripTrailingPeriod(cleanName(text));

    if (!cleaned) return "";

    return cleaned
        .replace(
            /^Players assemble scattered clues into a larger understanding rather than following a single linear trail$/i,
            "following scattered clues and slowly piecing them together"
        )
        .replace(
            /^Players never have the full picture, and uncertainty becomes part of the tension$/i,
            "working with incomplete information and mounting uncertainty"
        )
        .replace(
            /^The players never have enough time, safety, light, healing, or supplies, so every decision costs something$/i,
            "making hard calls when time, safety, and supplies are always running short"
        )
        .replace(
            /^Progress comes from uncovering new places, secrets, paths, and environmental story buried in the world$/i,
            "exploring strange places and uncovering what they mean"
        )
        .replace(
            /^The longer events continue or the more certain actions are taken, the worse consequences become$/i,
            "managing problems before they spiral"
        )
        .replace(
            /^The longer events continue or the more certain actions are taken, the worse outcomes become$/i,
            "managing problems before they spiral"
        )
        .replace(
            /^Movement, territory, chokepoints, and positioning become central to how encounters are won or lost$/i,
            "managing movement, territory, chokepoints, and positioning"
        )
        .replace(
            /^Words, alliances, leverage, and negotiation shape the campaign as much as combat does$/i,
            "managing pressure, leverage, negotiation, and fragile alliances"
        )
        .replace(
            /^Enemies break normal expectations and create memorable multi-phase setpiece encounters$/i,
            "facing enemies that force new tactics instead of routine fights"
        )
        .replace(
            /^Power changes the characters over time, creating tradeoffs between strength, identity, and consequence$/i,
            "power changing the characters over time"
        )
        .replace(
            /^The battlefield matters as much as the enemies, with hazards, terrain, and interaction shaping the fight$/i,
            "surviving battlefields where hazards and terrain matter as much as the enemies"
        )
        .replace(
            /^The world responds to player action over time, with areas, threats, and NPC behavior changing in reaction$/i,
            "a world reacting to what the players do"
        )
        .replace(
            /^Player actions shift their standing with factions, unlocking opportunities or closing doors over time$/i,
            "shifting faction standing as alliances form, break, and evolve"
        )
        .replace(
            /^Their choices, alliances, and leverage shape how the world responds$/i,
            "choices and alliances reshaping how the world responds"
        )
        .replace(
            /^Players build their identity through flexible components, allowing highly customized growth and expression$/i,
            "shaping identity through modular growth and highly customized choices"
        )
        .replace(
            /^No alliance is simple, and choosing sides carries long-term consequences, tension, and compromise$/i,
            "navigating alliances where every choice comes with tradeoffs and long-term consequences"
        )

        .replace(
            /^dealing with power that changes the characters over time$/i,
            "power changing the characters over time"
        )
        .replace(
            /^dealing with a world that keeps reacting to what the players do$/i,
            "a world reacting to what the players do"
        )
        .replace(
            /^watching choices and alliances reshape how the world responds$/i,
            "choices and alliances reshaping how the world responds"
        )

        .replace(/\s+/g, " ")
        .trim();
}

function getSystemPitchText(system = {}) {
    const direct = stripTrailingPeriod(cleanName(system?.pitchText || ""));
    if (direct) return normalizeSystemLead(direct);

    const fallback = stripTrailingPeriod(
        normalizeDescription(
            system?.description || system?.name || "",
            "exploring hidden information and pushing deeper into the central conflict"
        )
    );

    return normalizeSystemLead(fallback);
}

function abstractSystemPitchText(text = "") {
    return String(text || "")
        .replace(/making hard calls when time, safety, and supplies are always running short/gi, "constant pressure and difficult tradeoffs")
        .replace(/managing problems before they spiral(?: out of control)?/gi, "keeping situations from escalating")
        .replace(/following scattered clues and slowly piecing (?:them|together|the bigger picture) together/gi, "uncovering a larger hidden pattern")
        .replace(/working with incomplete information and (?:mounting )?uncertainty/gi, "operating without the full picture")
        .replace(/exploring strange places and uncovering what they (?:mean|reveal)/gi, "pushing into the unknown")
        .replace(/managing movement, territory, chokepoints, and positioning/gi, "controlling space under pressure")
        .replace(/managing pressure, leverage, negotiation, and fragile alliances/gi, "pressure, leverage, and unstable alliances")
        .replace(/facing enemies that force new tactics instead of routine fights/gi, "adapting to threats that refuse easy answers")
        .replace(/dealing with power that changes the characters over time/gi, "power that reshapes the people using it")
        .replace(/surviving battlefields where hazards and terrain matter as much as the enemies/gi, "survival shaped as much by the environment as the enemy")
        .replace(/dealing with a world that keeps reacting to what the players do/gi, "a world that refuses to stay still")
        .replace(/shifting faction standing as alliances form, break, and evolve/gi, "alliances that keep changing shape")
        .replace(/watching choices and alliances reshape how the world responds/gi, "choices that keep changing the balance")
        .replace(/shaping identity through modular growth and highly customized choices/gi, "identity shaped through change and self-definition")
        .replace(/navigating alliances where every choice comes with tradeoffs and long-term consequences/gi, "alliances built on compromise and consequence")
        .replace(/\s+/g, " ")
        .trim();
}

function getCorePitchText(core = {}, fallback = "") {
    const direct = stripTrailingPeriod(cleanName(core?.pitchText || ""));
    if (direct) return direct;

    return humanizeName(cleanName(core?.name || fallback || ""))
        .replace(/_/g, " ")
        .toLowerCase();
}

function getCorePitchTextForProfile(core = {}, experienceProfile = "standard", fallback = "", softenIdentityPhrase = (text) => text) {
    const direct = stripTrailingPeriod(cleanName(core?.pitchText || ""));
    if (direct) {
        return softenIdentityPhrase(direct.toLowerCase(), experienceProfile);
    }

    return softenIdentityPhrase(
        humanizeName(cleanName(core?.name || fallback || ""))
            .replace(/_/g, " ")
            .toLowerCase(),
        experienceProfile
    );
}

function combineToneAndGenre(toneText = "", genreText = "") {
    const tone = cleanName(toneText).toLowerCase();
    const genre = cleanName(genreText).toLowerCase();

    if (!tone) return genre;
    if (!genre) return tone;
    if (genre.includes(tone)) return genre;
    if (tone.includes(genre)) return tone;

    return `${tone} ${genre}`;
}

function cleanCoreLead(text = "") {
    let cleaned = String(text || "").trim();

    cleaned = cleaned
        .replace(/^trying to\s+/i, "")
        .replace(/^getting caught in\s+/i, "")
        .replace(/^finding\s+/i, "")
        .replace(/^learning that\s+/i, "");

    cleaned = cleaned
        .replace(/^survive\s+/i, "surviving ")
        .replace(/^piece together\s+/i, "piecing together ")
        .replace(/^matter\s+/i, "mattering ")
        .replace(/^change\s+/i, "changing ")
        .replace(/^hold on\s+/i, "holding on ");

    return cleaned.replace(/\s+/g, " ");
}

function resolvePrimarySentence(first, second) {
    if (!second) return first;

    const directionalEndings = /\b(to|toward|towards|into|onto|on|around|within)\s*$/i;

    const embeddedDirectional = /\b(focuses on|centers on|leans into|builds around|moves toward|shifts toward|locks onto|goes into|pushes into|defined by|navigating|inside)\b/i;

    const alreadyStructured =
        /\b(world|campaign|story|experience|descent|arc)\b/i.test(first);

    if (alreadyStructured) {
        return `${first} ${second}`;
    }

    if (directionalEndings.test(first)) {
        return `${first} ${second}`;
    }

    if (embeddedDirectional.test(first)) {
        return `${first} ${second}`;
    }

    return `${first} ${second}`;
}

function joinNatural(items = []) {
    const cleaned = items.filter(Boolean);

    if (cleaned.length === 0) return "";
    if (cleaned.length === 1) return cleaned[0];
    if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;

    return `${cleaned.slice(0, -1).join(", ")}, and ${cleaned[cleaned.length - 1]}`;
}

function uniqueByName(entries = []) {
    const seen = new Set();
    const result = [];

    for (const entry of entries) {
        const key = cleanName(entry?.name || entry?.id || "").toLowerCase();
        if (!key || seen.has(key)) {
            continue;
        }

        seen.add(key);
        result.push(entry);
    }

    return result;
}

function extractIds(entries = []) {
    return entries
        .map((entry) => cleanName(entry?.id || "").toLowerCase())
        .filter(Boolean);
}

function cleanIncludeText(text = "") {
    return text
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => !/^avoid\s+/i.test(s) && !/^no\s+/i.test(s))
        .map((s) => s.replace(/\.$/, ""))
        .join(", ");
}

function cleanExcludeText(text = "") {
    const cleaned = text
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^avoid\s+/i, "").replace(/^no\s+/i, ""))
        .map((s) => s.replace(/\.$/, ""))
        .map((s) => s.replace(/or anything too scary/gi, ""))
        .map((s) => s.replace(/\s+/g, " ").trim())
        .filter((s) => s.length > 2);

    return cleaned.join(", ");
}

function toSentence(text = "") {
    const cleaned = cleanName(text);
    if (!cleaned) return "";
    return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function formatToneLabel(toneName = "") {
    const tone = humanizeName(toneName).toLowerCase();

    if (!tone) return "";
    if (tone === "lighthearted chaotic") return "playful, lighthearted";
    if (tone === "political intrigue") return "tense, intrigue-heavy";

    return tone;
}

function dedupePhrases(text = "") {
    const parts = text.split(",").map((p) => p.trim().toLowerCase());
    const unique = [];

    for (const part of parts) {
        if (!unique.some((u) => u.includes(part) || part.includes(u))) {
            unique.push(part);
        }
    }

    return unique.join(", ");
}

function chooseByLabel(label, options = {}) {
    if (options[label] && Array.isArray(options[label]) && options[label].length) {
        return options[label][Math.floor(Math.random() * options[label].length)];
    }

    const fallback = options.default || [];
    return fallback[Math.floor(Math.random() * fallback.length)] || "";
}

let lastPick = null;

function pickOne(arr, fallback = "", avoidRepeat = false) {
    if (!Array.isArray(arr) || arr.length === 0) return fallback;

    let options = arr;

    if (avoidRepeat && lastPick) {
        options = arr.filter(item => item !== lastPick);
        if (options.length === 0) options = arr;
    }

    const choice = options[Math.floor(Math.random() * options.length)];
    lastPick = choice;
    return choice;
}
/// PHRASE REWRITES ///
const PHRASE_REWRITES = [
    {
        pattern: /\bpower changing the characters over time\b/gi,
        replacement: "power gradually reshaping the characters"
    },
    {
        pattern: /\bpower changing the characters\b/gi,
        replacement: "power reshaping the characters"
    }
];

function applyPhraseRewrites(text = "") {
    return PHRASE_REWRITES.reduce(
        (output, rule) => output.replace(rule.pattern, rule.replacement),
        String(text || "")
    );
}

function cleanOutputText(text = "") {
    return applyPhraseRewrites(text)

        // Joiner cleanup patch
        .replace(/\bwith dealing\b/gi, "dealing")
        .replace(/\bwith managing\b/gi, "managing")
        .replace(/\bwith following\b/gi, "following")

        .replace(/\.\.+/g, ".")
        .replace(/\.\.+/g, ".")
        .replace(/\s+/g, " ")
        .replace(/\s([.,!?;:])/g, "$1")

        // ✅ NEW: concept phrasing cleanup
        .replace(/\brealizing that\s+/gi, "")
        .replace(/\bdiscovering that\s+/gi, "")
        .replace(/\bchasing\s+/gi, "")

        // ✅ NEW: duplicate word cleanup
        .replace(/\b(\w+)\s+\1\b/gi, "$1")

        .replace(/\.\s+\./g, ".")
        .replace(/(divided,\s*or incomplete,\s*and incomplete|divided,\s*or incomplete)/gi, "divided and incomplete")
        .replace(/family-friendly\.\s+It stays approachable and family-friendly\./gi, "family-friendly.")
        .replace(/The mood stays rooted in wonder, curiosity, and adventure\.\s+The mood stays rooted in wonder, curiosity, and adventure\./gi, "The mood stays rooted in wonder, curiosity, and adventure.")
        .replace(/It stays approachable and family-friendly\.\s+The mood stays rooted in wonder, curiosity, and adventure\./gi, "It stays approachable and family-friendly, with a tone rooted in wonder and curiosity.")
        .replace(/The tone stays light and kid-safe, family-friendly\.\s+It stays approachable and family-friendly\./gi, "The tone stays light, kid-safe, and approachable.")
        .trim()
        .replace(/divided and incomplete,\s*and/gi, "divided and incomplete. ")
        .replace(
            /\bwhere ([^.,]+?) (keeps|starts|begins|continues)\b/gi,
            "where $1, $2"
        )
        .replace(
            /\b(shaped by|centered on|built around) ([^.,]+?) is\b/gi,
            "$1 the fact that $2 is"
        );
}

function isPluralConcept(text = "") {
    return /\band\b/i.test(text);
}

module.exports = {
    first,
    second,
    cleanName,
    humanizeName,
    sentenceCase,
    stripLeadingWhile,
    stripTrailingPeriod,
    normalizeDescription,
    normalizeSystemLead,
    getSystemPitchText,
    abstractSystemPitchText,
    getCorePitchText,
    getCorePitchTextForProfile,
    combineToneAndGenre,
    cleanCoreLead,
    resolvePrimarySentence,
    joinNatural,
    uniqueByName,
    extractIds,
    cleanIncludeText,
    cleanExcludeText,
    toSentence,
    formatToneLabel,
    dedupePhrases,
    chooseByLabel,
    pickOne,
    cleanOutputText,
    isPluralConcept
};