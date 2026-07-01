const {
    cleanName,
    humanizeName,
    normalizeDescription,
    joinNatural,
    uniqueByName,
    cleanIncludeText,
    formatToneLabel,
    dedupePhrases,
    pickOne,
    cleanOutputText,
    getSystemPitchText,
    abstractSystemPitchText,
    getCorePitchTextForProfile,
    cleanCoreLead,
    resolvePrimarySentence,
    interpretIncludeNoteForPitch,
    buildIncludeNoteSentence
} = require("./pitchCleanup");


const {
    environmentVoiceMap,
    genreVoiceMap
} = require("../voice/voiceMap");

const {
    isYouthProfile,
    softenYouthText,
    softenIdentityPhrase,
    getAdjudication,
    getSafetyProfile,
    getHandoffGuidance
} = require("./pitchSafetyFilters");

function isVerbPhrase(text = "") {
    return /^(preventing|using|managing|dealing|choosing|exploring|pushing|following|working|surviving|facing|adapting)\b/.test(text);
}

function normalizeToNounPhrase(text = "") {
    if (!text) return "";

    let t = text.trim().toLowerCase();

    t = t
        .replace(/^keeping situations from escalating$/i, "escalation pressure")
        .replace(/^keeping\s+(.+)/, "preventing $1")
        .replace(/^using\s+(.+)/, "the use of $1")
        .replace(/^managing\s+(.+)/, "managing $1")
        .replace(/^dealing with\s+(.+)/, "pressure from $1")
        .replace(/^choosing\s+(.+)/, "decisions about $1")
        .replace(/^exploring\s+(.+)/, "exploration of $1")
        .replace(/^pushing into\s+(.+)/, "exploration of $1")
        .replace(/^following\s+(.+)/, "investigation of $1")
        .replace(/^working with incomplete information and uncovering what others keep hidden$/i, "investigation under incomplete information")
        .replace(/^working with\s+(.+)/, "working with $1")
        .replace(/^surviving\s+(.+)/, "survival in $1")
        .replace(/^facing\s+(.+)/, "confrontation with $1")
        .replace(/^adapting to\s+(.+)/, "adaptation to $1");

    if (/^(constant|pressure|identity|movement|power|survival|exploration)/.test(t)) {
        return `campaign defined by ${t}`;
    }

    if (/^(campaign defined by|campaign about)/.test(t)) {
        return t;
    }

    return t;
}

function hasArticle(text = "") {
    return /^(a|an|the)\b/i.test(String(text).trim());
}

function withIndefiniteArticle(text = "") {
    const cleaned = String(text || "").trim();
    if (!cleaned) return "";
    if (hasArticle(cleaned)) return cleaned;

    return /^[aeiou]/i.test(cleaned)
        ? `an ${cleaned}`
        : `a ${cleaned}`;
}

function stripCampaignPrefix(text = "") {
    return String(text || "")
        .trim()
        .replace(/^a\s+campaign\s+defined\s+by\s+/i, "")
        .replace(/^an\s+campaign\s+defined\s+by\s+/i, "")
        .replace(/^campaign\s+defined\s+by\s+/i, "")
        .replace(/^a\s+campaign\s+about\s+/i, "")
        .replace(/^an\s+campaign\s+about\s+/i, "")
        .replace(/^campaign\s+about\s+/i, "")
        .replace(/\s+/g, " ")
        .trim();
}

function capitalizeFirst(text = "") {
    const value = String(text || "").trim();
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function classifyPitchConcept(text = "") {
    const t = stripCampaignPrefix(text).toLowerCase();

    if (!t) return "theme";

    if (
        /^(managing|following|exploring|working with|using|dealing with|choosing|pushing through|surviving|facing|adapting to|seeing|making|taking|shaping|watching)\b/.test(t)
    ) {
        return "activity";
    }

    if (
        /^(investigation|exploration|survival|adaptation|confrontation|decisions|pressure|identity|power|movement|conflict|change|negotiation|leverage|control|battlefield control|the use)\b/.test(t)
    ) {
        return "theme";
    }

    return "identity";
}

function classifyLeadShape(text = "") {
    const t = stripCampaignPrefix(text).toLowerCase().trim();

    if (!t) return "theme";

    if (
        /^(something|someone|the world|the truth|the answers|reality|power|identity|everything)\b/.test(t) &&
        /\b(is|are|feels|keeps|becomes|remains|hides|reveals)\b/.test(t)
    ) {
        return "proposition";
    }

    if (
        /^(awakening|piecing together|survival|exploration|investigation|confrontation|adaptation|changing|moving through|gaining|choosing|working with|following|pushing into)\b/.test(t)
    ) {
        return "process";
    }

    return "theme";
}

function buildPitchLead({ label, toneProfile, genreCampaignText, conceptText, conceptType, leadShape = "theme" }) {
    const genreText = withIndefiniteArticle(genreCampaignText || "campaign");
    const concept = stripCampaignPrefix(conceptText);
    const direction = ["primary", "adjacent", "wildcard"].includes(label)
        ? label
        : "primary";

    const pools = {
        primary: {
            identity: [
                `This plays like ${genreText} centered on ${concept}.`,
                `At its core, this is ${genreText} shaped by ${concept}.`,
                `From the start, this feels like ${genreText} built around ${concept}.`
            ],
            theme: [
                `This plays like ${genreText} shaped by ${concept}.`,
                `At its core, this is ${genreText} built around ${concept}.`,
                `This is ${genreText} with ${concept} pressing on every major turn.`
            ],
            activity: [
                `This plays like ${genreText} built around ${concept}.`,
                `At its core, the campaign is driven by ${concept}.`,
                `The central experience of ${genreText} comes from ${concept}.`,
                `${capitalizeFirst(concept)} gives the campaign its forward momentum.`,
                `The campaign is structured around ${concept}, with ${genreText} providing the wider frame.`
            ],
            proposition: [
                `This plays like ${genreText} built around the fact that ${concept}.`,
                `At its core, this is ${genreText} shaped by the fact that ${concept}.`,
                `From the start, this feels like ${genreText} where ${concept}.`
            ]
        },
        adjacent: {
            identity: [
                `The alternate direction brings ${concept} to the foreground.`,
                `Here, ${concept} carries more of the campaign’s identity.`,
                `The emphasis moves toward a campaign shaped by ${concept}.`,
                `This take gives ${concept} a more visible role in the overall experience.`
            ],
            theme: [
                `The alternate direction brings ${concept} to the foreground.`,
                `${capitalizeFirst(concept)} carries more of the campaign’s weight here.`,
                `The emphasis moves toward ${concept} as a defining pressure.`,
                `This take lets ${concept} shape more of what happens at the table.`
            ],
            activity: [
                `Here, ${concept} becomes the main engine of play.`,
                `The campaign draws more of its momentum from ${concept}.`,
                `The alternate direction is structured more directly around ${concept}.`,
                `Play shifts toward ${concept} as the group’s recurring focus.`
            ],
            proposition: [
                `The alternate direction leans into the truth that ${concept}.`,
                `Here, the fact that ${concept} carries more of the campaign’s weight.`,
                `The emphasis moves toward ${concept}.`,
                `This take treats the truth that ${concept} as a defining pressure.`
            ]
        },
        wildcard: {
            identity: [
                `The wildcard commits to a campaign centered on ${concept}.`,
                `${capitalizeFirst(concept)} becomes the direction’s sharpest idea.`,
                `Here, the campaign locks onto ${concept} and follows it further.`,
                `The bolder interpretation lets ${concept} define the campaign more completely.`
            ],
            theme: [
                `The wildcard commits fully to ${concept}.`,
                `${capitalizeFirst(concept)} takes over more of the campaign’s identity.`,
                `Here, the focus locks onto ${concept} and refuses to soften it.`,
                `The bolder interpretation gives ${concept} room to reshape the entire direction.`
            ],
            activity: [
                `The wildcard centers play on ${concept}.`,
                `${capitalizeFirst(concept)} becomes the campaign’s driving force.`,
                `Here, play is pushed toward ${concept} at every major turn.`,
                `The bolder interpretation builds its momentum directly from ${concept}.`
            ],
            proposition: [
                `The wildcard commits to the truth that ${concept}.`,
                `Here, the fact that ${concept} becomes impossible to treat as background.`,
                `The bolder interpretation builds around a world where ${concept}.`,
                `This direction follows the truth that ${concept} to its sharpest consequences.`
            ]
        }
    };

    const shape = leadShape === "proposition"
        ? "proposition"
        : leadShape === "process"
            ? "activity"
            : conceptType;
    let pool = pools[direction]?.[shape] || pools[direction].theme;

    // Tone changes cadence and emphasis without replacing grammatical routing.
    if (direction === "primary" && shape !== "proposition" && shape !== "activity") {
        const tonePools = {
            grimdark: [
                `This drops the group into ${genreText} shaped by ${concept}.`,
                `From the start, ${concept} bears down on ${genreText}.`,
                `This is ${genreText} where ${concept} leaves little room for clean victories.`
            ],
            psychological: [
                `This is ${genreText} centered on ${concept}, with the pressure landing close to the characters.`,
                `At its core, ${concept} gives ${genreText} a more inward and unstable edge.`,
                `This plays like ${genreText} where ${concept} keeps the characters questioning what they can trust.`
            ],
            mythic: [
                `This unfolds as ${genreText} built around ${concept}.`,
                `This plays like ${genreText} where ${concept} carries consequences larger than any one character.`,
                `At its core, ${concept} gives ${genreText} a mythic sense of weight.`
            ],
            heroic: [
                `This plays like ${genreText} built around ${concept}.`,
                `At its core, ${concept} gives ${genreText} forward momentum and meaningful stakes.`,
                `This is ${genreText} where ${concept} keeps opening difficult choices the heroes can still shape.`
            ],
            lighthearted: [
                `This plays like ${genreText} powered by ${concept}.`,
                `From the start, ${concept} gives ${genreText} an adventurous, unpredictable energy.`,
                `At its core, this is ${genreText} built around ${concept} without losing its sense of fun.`
            ]
        };

        if (tonePools[toneProfile]) {
            pool = tonePools[toneProfile];
        }
    }

    return pickOne(pool, `This feels like ${genreText} built around ${concept}.`, true);
}


function collectSettingVoice({ genre = {}, environments = [] }) {
    const genreId = cleanName(genre?.id || "").toLowerCase();
    const genreVoice = genreVoiceMap[genreId] || {};

    const environmentEntries = uniqueByName(environments)
        .map((entry) => ({
            id: cleanName(entry?.id || "").toLowerCase(),
            name: cleanName(entry?.name || entry?.id || "")
        }))
        .filter((entry) => entry.id);

    const imagery = environmentEntries.flatMap((entry) =>
        environmentVoiceMap[entry.id]?.imagery || []
    );

    const gameplay = environmentEntries.flatMap((entry) =>
        environmentVoiceMap[entry.id]?.gameplay || []
    );

    return {
        genreFraming: genreVoice.framing || [],
        genreImagery: genreVoice.imagery || [],
        environmentImagery: imagery,
        environmentGameplay: gameplay
    };
}

function buildSettingIdentityLine({ label = "primary", genre = {}, environments = [], usedText = "" }) {
    const voice = collectSettingVoice({ genre, environments });
    const used = String(usedText || "").toLowerCase();

    const environmentImagery = voice.environmentImagery
        .filter((line) => line && !used.includes(line.toLowerCase()));

    const environmentGameplay = voice.environmentGameplay
        .filter((line) => line && !used.includes(line.toLowerCase()));

    const genreImagery = voice.genreImagery
        .filter((line) => line && !used.includes(line.toLowerCase()));

    const genreFraming = voice.genreFraming
        .filter((line) => line && !used.includes(line.toLowerCase()));

    const environmentPools = {
        primary: [
            environmentImagery.length ? `The setting takes shape through ${pickOne(environmentImagery, "")}.` : "",
            environmentGameplay.length ? pickOne(environmentGameplay, "") : ""
        ],
        adjacent: [
            environmentGameplay.length ? pickOne(environmentGameplay, "") : "",
            environmentImagery.length ? `The altered emphasis brings ${pickOne(environmentImagery, "")} closer to the center of play.` : "",
            environmentImagery.length ? `More of the campaign now unfolds through ${pickOne(environmentImagery, "")}.` : ""
        ],
        wildcard: [
            environmentImagery.length ? `The bolder edge comes from ${pickOne(environmentImagery, "")}.` : "",
            environmentImagery.length ? `Its stranger identity takes shape through ${pickOne(environmentImagery, "")}.` : "",
            environmentGameplay.length ? pickOne(environmentGameplay, "") : ""
        ]
    };

    const genreFallbackPools = {
        primary: [
            genreImagery.length ? `The setting takes shape through ${pickOne(genreImagery, "")}.` : "",
            genreFraming.length ? `Its world is grounded in ${pickOne(genreFraming, "")}.` : ""
        ],
        adjacent: [
            genreImagery.length ? `The altered emphasis brings ${pickOne(genreImagery, "")} closer to the center of play.` : "",
            genreFraming.length ? `That shift is reinforced by ${pickOne(genreFraming, "")}.` : ""
        ],
        wildcard: [
            genreImagery.length ? `The bolder edge comes from ${pickOne(genreImagery, "")}.` : "",
            genreFraming.length ? `That sharper identity leans into ${pickOne(genreFraming, "")}.` : ""
        ]
    };

    const environmentCandidates = (environmentPools[label] || environmentPools.primary).filter(Boolean);
    if (environmentCandidates.length) {
        return pickOne(environmentCandidates, "", true);
    }

    const genreCandidates = (genreFallbackPools[label] || genreFallbackPools.primary).filter(Boolean);
    return pickOne(genreCandidates, "", true);
}

function buildPitchSupportLine({ systemText = "", coreText = "", usedText = "" }) {
    const used = String(usedText || "").toLowerCase();

    if (
        systemText &&
        !used.includes(systemText.toLowerCase())
    ) {
        return pickOne([
            `At the table, that means ${systemText}.`,
            `The group keeps returning to ${systemText}.`,
            `Day-to-day play is shaped by ${systemText}.`,
            `The campaign repeatedly returns to ${systemText}.`,
            `The campaign builds its practical momentum through ${systemText}.`,
            `Most major turns revolve around ${systemText}.`,
            `The tension becomes concrete through ${systemText}.`,
            `That premise reaches the table through ${systemText}.`
        ], "", true);
    }

    if (
        coreText &&
        !used.includes(coreText.toLowerCase())
    ) {
        return pickOne([
    `Everything keeps circling back to ${coreText}.`,
    `That central tension keeps pulling the campaign back to ${coreText}.`,
    `It keeps returning to ${coreText}.`
], "", true);
    }

    return "";
}

///Helper--Structure Variation ///

function assemblePitchSentences(first = "", second = "", third = "") {
    const parts = [first, second, third].filter(Boolean);

    if (parts.length <= 1) {
        return parts.join(" ");
    }

    if (parts.length === 2) {
        return pickOne([
            `${parts[0]} ${parts[1]}`,
            `${parts[0]} ${parts[1]}`,
            `${parts[0]} ${parts[1]}`
        ], parts.join(" "), true);
    }

    return pickOne([
        `${first} ${second} ${third}`,
        `${first} ${third} ${second}`,
        `${first} ${second}`,
        `${first} ${third}`
    ], `${first} ${second} ${third}`, true);
}

function buildPitchParagraph({
    label,
    coreA,
    coreB,
    systemA,
    systemB,
    genreName,
    genre,
    toneName,
    envNames,
    environments,
    coreIds,
    includeNotes,
    excludeNotes,
    experienceProfile
}) {
    const genreText = humanizeName(genreName || "fantasy").toLowerCase();
    const toneText = formatToneLabel(toneName).toLowerCase();
    const pitchGenreText = `${toneText && genreText ? `${toneText} ${genreText}` : toneText || genreText}`;
    const combinedGenreWords = `${pitchGenreText}`.trim().split(/\s+/).filter(Boolean);
    const dedupedGenreWords = [];
    for (const word of combinedGenreWords) {
        if (!dedupedGenreWords.includes(word)) {
            dedupedGenreWords.push(word);
        }
    }
    let dedupedGenreText = dedupedGenreWords.join(" ").trim();

    dedupedGenreText = dedupedGenreText
        .replace(/\bgrimdark dark fantasy\b/gi, "grimdark fantasy")
        .replace(/\bdark dark fantasy\b/gi, "dark fantasy")
        .replace(/\bheroic heroic fantasy\b/gi, "heroic fantasy");

    const genreCampaignText = dedupedGenreText ? `${dedupedGenreText} campaign` : "campaign";

    const toneProfile = (() => {
        const tone = toneText.toLowerCase();

        if (tone.includes("grim")) return "grimdark";
        if (tone.includes("psychological")) return "psychological";
        if (tone.includes("mythic")) return "mythic";
        if (tone.includes("lighthearted")) return "lighthearted";
        if (tone.includes("heroic")) return "heroic";

        return "neutral";
    })();

    const coreAOnly = getCorePitchTextForProfile(
        coreA,
        experienceProfile,
        "Hidden Truth",
        softenIdentityPhrase
    );
    const coreAForPitch = cleanCoreLead(coreAOnly);

    const systemText = [...new Set(
        [systemA, systemB]
            .filter(Boolean)
            .map((system) => abstractSystemPitchText(getSystemPitchText(system)))
            .filter(Boolean)
            .map((text) => text.toLowerCase().replace(/\s+/g, " ").trim())
    )];

    const primarySystemText = systemText[0] || "";

    const rawConcept = stripCampaignPrefix(
        normalizeToNounPhrase(coreAForPitch || "")
    );

    const conceptType = classifyPitchConcept(rawConcept);
    const leadShape = classifyLeadShape(rawConcept);
    

    const first = buildPitchLead({
        label,
        toneProfile,
        genreCampaignText,
        conceptText: rawConcept,
        conceptType,
        leadShape
    });

    const second = buildPitchSupportLine({
        systemText: primarySystemText,
        coreText: rawConcept,
        usedText: first
    });

    const settingLine = buildSettingIdentityLine({
        label,
        genre,
        environments,
        usedText: `${first} ${second}`
    });

    const includeNote = interpretIncludeNoteForPitch(includeNotes);
    const includeLine = buildIncludeNoteSentence(includeNote, "pitch", label);

    // Setting identity is guaranteed whenever valid setting material exists.
    // User priorities are appended separately so neither signal can randomly displace the other.
    let text = assemblePitchSentences(first, second, settingLine);

    if (includeLine && !text.includes(includeLine)) {
        text = `${text} ${includeLine}`;
    }

    text = cleanOutputText(text);

    text = text
        .replace(/\ba campaign campaign\b/gi, "a campaign")
        .replace(/\ban campaign\b/gi, "a campaign")
        .replace(/\ba investigation\b/gi, "an investigation")
        .replace(/\ba exploration\b/gi, "an exploration")
        .replace(/\ba adaptation\b/gi, "an adaptation")
        .replace(/\ban ([^aeiou])/gi, "a $1")
        .replace(/\ba ([aeiou])/gi, "an $1");

    return isYouthProfile(experienceProfile)
        ? softenYouthText(text).trim()
        : text;
}

function buildAIBrief({
    label,
    emphasis,
    title,
    coreFrames,
    systemFrames,
    genre,
    tone,
    environments,
    includeNotes,
    excludeNotes,
    about,
    playersDo,
    distinctHook,
    selections
}) {
    const adjudication = getAdjudication(selections);
    const safetyProfile = getSafetyProfile(selections);
    const handoffGuidance = getHandoffGuidance(selections);

    return {
        directionType: label || "direction",
        emphasis: emphasis || "",
        title,
        genre: cleanName(genre?.name, ""),
        tone: cleanName(tone?.name, ""),
        coreConflict: about,
        tableExperience: playersDo,
        distinctIdentity: distinctHook,
        coreFrames: uniqueByName(coreFrames).map((entry) => ({
            name: cleanName(entry?.name, entry?.id || ""),
            description: normalizeDescription(entry?.description, "")
        })),
        systemFrames: uniqueByName(systemFrames).map((entry) => ({
            name: cleanName(entry?.name, entry?.id || ""),
            description: normalizeDescription(entry?.description, "")
        })),
        environments: uniqueByName(environments).map((entry) => ({
            name: cleanName(entry?.name, entry?.id || ""),
            description: normalizeDescription(entry?.description, "")
        })),
        includeNotes: cleanName(includeNotes, ""),
        excludeNotes: cleanName(excludeNotes, ""),
        experienceProfile: adjudication.experienceProfile || cleanName(selections?.experienceProfile, "standard"),
        safetyProfile,
        toneGuardrails: handoffGuidance.toneGuardrails || [],
        audienceGuardrails: handoffGuidance.audienceGuardrails || [],
        mustInclude: handoffGuidance.mustInclude || [],
        avoid: handoffGuidance.avoid || [],
        suppressedSignals: adjudication.suppressed || [],
        confidence: adjudication.confidence || {},

        rewriteGoal:
            "Rewrite this into polished, consult-ready campaign prose that sounds natural, cinematic, and specific without contradicting the structured intent."
    };
}

module.exports = {
    buildPitchParagraph,
    buildAIBrief
};