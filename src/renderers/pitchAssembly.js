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
    resolvePrimarySentence
} = require("./pitchCleanup");

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

function buildPitchParagraph({
    label,
    coreA,
    coreB,
    systemA,
    systemB,
    genreName,
    toneName,
    envNames,
    coreIds,
    includeNotes,
    excludeNotes,
    experienceProfile
}) {
    const genreText = humanizeName(genreName || "fantasy").toLowerCase();
    const toneText = formatToneLabel(toneName).toLowerCase();
    const pitchGenreText = `${toneText && genreText ? `${toneText} ${genreText}` : toneText || genreText}`;
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
    const coreBOnly = getCorePitchTextForProfile(
        coreB,
        experienceProfile,
        "",
        softenIdentityPhrase
    );

    const systemText = [...new Set(
        [systemA, systemB]
            .filter(Boolean)
            .map((system) => abstractSystemPitchText(getSystemPitchText(system)))
            .filter(Boolean)
            .map((text) => text.toLowerCase().replace(/\s+/g, " ").trim())
    )];

    const primarySystemText = systemText[0] || "";

    const experienceLineByLabel = {
        primary: {
            neutral: [
                "From the start, this puts the group inside a",
                "At its core, this is a",
                "This plays like a",
                "This feels like a",
                "Everything here revolves around a"
            ],

            heroic: [
                "From the start, this throws the group into a",
                "This centers on rising to meet a",
                "This plays like a story about overcoming a",
                "Everything here pushes the group to face a"
            ],

            grimdark: [
                "This drops the group into a",
                "Everything here revolves around surviving a",
                "This plays out inside a world defined by a",
                "From the start, this traps the group in a"
            ],

            psychological: [
                "This places the group inside a",
                "From the start, this unfolds within a",
                "This plays like a slow descent into a",
                "Everything here centers on navigating a"
            ],

            mythic: [
                "This unfolds within a",
                "From the start, this places the group inside a",
                "This plays out as part of a larger",
                "Everything here is shaped by a"
            ],

            lighthearted: [
                "This throws the group into a",
                "From the start, this leans into a",
                "This plays like a fast-moving",
                "Everything here builds around a"
            ]
        },

        adjacent: [
            "This version shifts the emphasis toward",
            "The emphasis here falls more squarely on",
            "This take moves closer to",
            "This version leans harder into"
        ],

        wildcard: [
            "This version goes further into",
            "This one pushes fully into",
            "Here, the focus locks onto",
            "This direction commits fully to"
        ]
    };

    const secondLineOptions = [];

    if (primarySystemText) {
        const systemLineOptions = [
            `It stays centered on ${primarySystemText}.`,
            `Its pressure comes from ${primarySystemText}.`,
            `A lot of its identity comes from ${primarySystemText}.`,
            `It keeps building through ${primarySystemText}.`,
            `That tension grows through ${primarySystemText}.`
        ];

        secondLineOptions.push(...systemLineOptions);
    }

    const includeCleanRaw = cleanIncludeText(includeNotes);
    const includeClean = dedupePhrases(includeCleanRaw);
    const includePhrase = includeClean
        .toLowerCase()
        .replace(/keep it\s*/g, "")
        .replace(/\/\s*kid-safe/g, "")
        .trim();

    let first;

    if (label === "primary") {
        const pool =
            experienceLineByLabel.primary[toneProfile] ||
            experienceLineByLabel.primary.neutral;

        first = pickOne(pool);
    } else {
        first = experienceLineByLabel[label]?.[
            Math.floor(Math.random() * experienceLineByLabel[label].length)
        ] || "";
    }

    const second = pickOne(
        secondLineOptions,
        coreAOnly ? `Everything keeps circling back to ${coreAOnly}.` : ""
    );
    const third = includePhrase
        ? pickOne([
            `The overall feel stays ${includePhrase}.`,
            `Tone-wise, it stays ${includePhrase}.`,
            `It keeps that ${includePhrase} edge without losing momentum.`
        ], "")
        : "";

    let text;

    if (second) {
        const firstClean = first.replace(/\s+$/, "");

        const firstAdjusted = firstClean
            .replace(/\bbuilt around\b/i, "focused on")
            .replace(/\bbuilds around\b/i, "focuses on");

        const alreadyStructured =
            /\b(world|campaign|story|experience|descent|arc)\b/i.test(firstClean) ||
            /\b(inside|within|part of|defined by|navigating|unfolds within|plays out inside)\b/i.test(firstClean);

        const needsNoun =
            !alreadyStructured && (
                /\b(a|an)\s*$/.test(firstClean) ||
                /\b(a|an)\s+(fast-moving|slow-burning|slow|grim|dark|lighthearted|heroic|mythic|psychological)\s*$/i.test(firstClean) ||
                /\b(a|an)\s+slow descent into\s*$/i.test(firstClean)
            );

        const firstFixed = needsNoun
            ? `${firstAdjusted} campaign`
            : firstAdjusted;

        const secondClean = second
            .replace(/^(Most sessions revolve around|What the players do here shapes the campaign through|A lot of the campaign’s momentum comes from|The core loop centers on|What drives the campaign forward is|Play keeps circling back to|The group keeps getting pulled back into|The pressure builds through)/i, "")
            .replace(/^(Play keeps circling back to|What drives the campaign forward is|The group keeps getting pulled back into)\s*/i, "")
            .replace(/\.$/, "")
            .trim();

        const secondResolved = secondClean
            .replace(/^it\s+(stays|keeps)\s+/i, "")
            .replace(/^its\s+/i, "")
            .replace(/^a lot of its identity comes from\s+/i, "")
            .replace(/^that\s+(tension|pressure)\s+(grows|comes)\s+(through|from)\s+/i, "")
            .replace(/^pressure comes from\s+/i, "")
            .replace(/^comes from\s+/i, "")
            .replace(/^centers on\s+/i, "")
            .replace(/^centered on\s+/i, "")
            .replace(/^built around\s+/i, "")
            .replace(/^focused on\s+/i, "")
            .replace(/^driven by\s+/i, "")
            .replace(/^where\s+/i, "")
            .trim();

        const secondFinalRaw = secondResolved
            .replace(/\b(centered on|built around|focused on|driven by)\s+(centered on|built around|focused on|driven by)\b/gi, "$1")
            .replace(/\b(\w+)\s+\1\b/gi, "$1")
            .replace(/\b(building through|where building through)\b/gi, "")
            .replace(/^(centered on|built around|focused on|driven by|where)\s+/i, "")
            .replace(/\s+/g, " ")
            .trim();

        const secondFinal = normalizeToNounPhrase(secondFinalRaw);

        function ensureValidNounPhrase(text = "") {
            let t = text.trim();

            t = t.replace(/\bcampaign defined by campaign defined by\b/i, "campaign defined by");

            if (!/^(a |an |the )/i.test(t) && !isVerbPhrase(t)) {
                t = `a ${t}`;
            }

            t = t.replace(/\b(a|an) (a|an)\b/gi, "$1");
            t = t.replace(/\ban ([^aeiou])/gi, "a $1");
            t = t.replace(/\ba ([aeiou])/gi, "an $1");

            return t.trim();
        }

        const isNounPhrase = /^(a |an |the )/i.test(secondFinal);

        const secondFinalClean = isNounPhrase
            ? secondFinal.replace(/^(a |an )/i, "")
            : secondFinal;

        const secondFinalSafe = ensureValidNounPhrase(
            secondFinalClean
        )
            .replace(/\bcampaign defined by campaign defined by\b/gi, "campaign defined by")
            .replace(/\bdefined by campaign defined by\b/gi, "defined by")
            .replace(/\bdefined by\s+defined by\b/gi, "defined by")
            .replace(/\babout\s+about\b/gi, "about")
            .replace(/\binto\s+into\b/gi, "into")
            .replace(/\s+/g, " ")
            .replace(/^defined by\s+/i, "a campaign defined by ")
            .replace(/^about\s+/i, "a campaign about ")
            .trim();

        if (label === "primary") {
            const firstNeedsCompletion =
                /\b(a|an)\s*$/i.test(firstFixed) ||
                /\b(a|an)\s+(campaign|story|experience|descent)\s*$/i.test(firstFixed) ||
                /\b(within|inside|into|around|on|toward|towards)\s*$/i.test(firstFixed);

            if (alreadyStructured && !firstNeedsCompletion) {
                text = `${firstFixed}.`;
            } else {
                text = `${resolvePrimarySentence(firstFixed, secondFinalSafe)}.`;
            }
        } else {
            text = `${resolvePrimarySentence(firstClean, secondFinalSafe)}.`;
        }

        text = text.replace(/\ba campaign a\b/gi, "a campaign");
        text = text.replace(/\bcampaign\s+campaign\b/gi, "campaign");

        if (/^(defined by|about)\b/i.test(secondFinalSafe)) {
            text = text.replace(/\binto\s+(defined by|about)\b/i, "$1");
        }

        text = text
            .replace(/\b(a|an)\s+(a|an)\b/gi, "$2")
            .replace(/\binto into\b/gi, "into")
            .replace(/\b(a|an)\s+([a-z]+s)\b/gi, "$2")
            .replace(/\bcampaign\s+(decisions|an|a)\b/gi, "$1")
            .replace(/\ba campaign (an|a)\b/gi, "$1")
            .replace(/\b(a|an)\s+(a|an)\b/gi, "$2")
            .replace(/\ba campaign control\b/gi, "control")
            .replace(/\bcampaign control\b/gi, "control")
            .replace(/\ba campaign preventing situations from escalating\b/gi, "a campaign defined by escalation pressure")
            .replace(/\binside preventing situations from escalating\b/gi, "inside escalation pressure")
            .replace(/\b(a|an)\s+preventing\b/gi, "preventing")
            .replace(/\bfast-moving a\b/gi, "fast-moving")
            .replace(/\bfast-moving an\b/gi, "fast-moving")
            .replace(/\bslow descent into a campaign defined by an investigation\b/gi, "slow descent into an investigation");

        if (third) {
            text += ` ${third}`;
        }
    } else {
        text = [first, third].filter(Boolean).join(" ");
    }

    text = cleanOutputText(text);

    text = text
        .replace(/\ban ([^aeiou])/gi, "a $1")
        .replace(/\ba ([aeiou])/gi, "an $1");

    return isYouthProfile(experienceProfile) ? softenYouthText(text).trim() : text;
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