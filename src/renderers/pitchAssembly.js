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

    const pools = {
        primary: {
            identity: [
                `From the start, this feels like ${genreText} built around ${concept}.`,
                `This plays like ${genreText} centered on ${concept}.`,
                `At its core, this is ${genreText} shaped by ${concept}.`,
                `This unfolds as ${genreText} built around ${concept}.`,
                `Everything here points toward ${genreText} built around ${concept}.`,
                `This drops the group into ${genreText} shaped by ${concept}.`
                
            ],
            theme: [
                `From the start, this feels like ${genreText} shaped by ${concept}.`,
                `This plays like ${genreText} where ${concept} defines the pressure.`,
                `At its core, this is ${genreText} built around ${concept}.`,
                `Everything here leans toward ${genreText} shaped by ${concept}.`,
                `This is ${genreText} with ${concept} pressing on every major turn.`
            ],
            activity: [
                `From the start, this feels like ${genreText} where the tension comes from ${concept}.`,
                `At its core, this is ${genreText} shaped by ${concept}.`,
                `This plays like ${genreText} built around ${concept}.`,
                `Everything here leans on ${concept} to create momentum inside ${genreText}.`,
                `The campaign finds its rhythm through ${concept}, giving ${genreText} its pace.`
            ]
        },

        adjacent: {
            identity: [
                `This version shifts the emphasis toward a campaign built around ${concept}.`,
                `This take leans harder into a campaign shaped by ${concept}.`,
                `The emphasis here falls more squarely on a campaign centered on ${concept}.`,
                `This reframes the campaign around ${concept}, giving that tension more room to breathe.`
                
            ],
            theme: [
                `This version shifts the emphasis toward a campaign shaped by ${concept}.`,
                `This take leans harder into a campaign built around ${concept}.`,
                `The emphasis here falls more squarely on ${concept}.`,
                `This reframes the campaign so that ${concept} carries more of the weight.`,
                `This direction leans more fully into ${concept} as a defining pressure.`,
                
                
            ],
            activity: [
                `This version shifts the emphasis toward a campaign where the tension comes from ${concept}.`,
                `This take leans harder into a campaign shaped by ${concept}.`,
                `The emphasis here falls more squarely on ${concept}.`,
                `Here, the campaign starts getting more of its momentum from ${concept}.`,
                `This version puts more weight on ${concept} as the engine of play.`,
                `This direction leans more fully into ${concept} as the core of play.`,
                
            ]
        },

        wildcard: {
            identity: [
                `This version pushes fully into a campaign built around ${concept}.`,
                `This direction commits fully to a campaign shaped by ${concept}.`,
                `Here, the focus locks onto a campaign centered on ${concept}.`,
                `This is the sharper version, built around ${concept}.`
            ],
            theme: [
                `This version pushes fully into a campaign shaped by ${concept}.`,
                `This direction commits fully to a campaign built around ${concept}.`,
                `Here, the focus locks onto ${concept}.`,
                `This is the sharper take, where ${concept} takes over more of the campaign’s identity.`
            ],
            activity: [
                `This version pushes fully into a campaign where the tension comes from ${concept}.`,
                `This direction commits fully to a campaign shaped by ${concept}.`,
                `Here, the focus locks onto ${concept}.`,
                `This is the sharper version, where ${concept} does more of the heavy lifting.`
            ]
        }
    };

    let pool =
        pools[label]?.[conceptType] ||
        pools.primary[conceptType] ||
        pools.primary.theme;
    
    if (leadShape === "proposition") {
        if (label === "primary") {
            pool = [
                `From the start, this feels like ${genreText} built around the fact that ${concept}.`,
                `At its core, this is ${genreText} shaped by the fact that ${concept}.`,
                `Everything here points toward ${genreText} built around the fact that ${concept}.`,
                `This drops the group into ${genreText} shaped by the fact that ${concept}.`
            ];
        }

        if (label === "adjacent") {
            pool = [
                `This version shifts the emphasis toward a campaign built around the fact that ${concept}.`,
                `This take leans harder into a campaign shaped by the fact that ${concept}.`,
                `The emphasis here falls more squarely on a campaign centered on the fact that ${concept}.`,
                `This reframes the campaign around the fact that ${concept}, giving that tension more room to breathe.`
            ];
        }

        if (label === "wildcard") {
            pool = [
                `This version pushes fully into a campaign built around the fact that ${concept}.`,
                `This direction commits fully to a campaign shaped by the fact that ${concept}.`,
                `Here, the focus locks onto a campaign centered on the fact that ${concept}.`,
                `This is the sharper version, built around the fact that ${concept}.`
            ];
        }
    }    

    if (label === "primary") {
        if (toneProfile === "grimdark") {
            pool = [
                `This drops the group into ${genreText} built around ${concept}.`,
                `From the start, this feels like ${genreText} shaped by ${concept}.`,
                `Everything here points toward ${genreText} shaped by ${concept}.`,
                `The campaign leans into ${genreText} shaped by ${concept}, with pressure baked into nearly everything.`,
                
            ];
        }

        if (toneProfile === "psychological") {
            pool = [
                `From the start, this feels like ${genreText} centered on ${concept}.`,
                `At its core, this is ${genreText} shaped by ${concept}.`,
                `Everything here leans toward ${genreText} shaped by ${concept}, with the pressure landing close to the characters.`,
            
            ];
        }

        if (toneProfile === "mythic") {
            pool = [
                `This unfolds as ${genreText} built around ${concept}.`,
                `From the start, this feels like ${genreText} shaped by ${concept}.`,
                `At its core, this is ${genreText} centered on ${concept}.`,
                `Everything here leans toward ${genreText} where ${concept} carries larger consequences.`,
                `This plays like ${genreText} with ${concept} echoing through the campaign’s larger shape.`
            ];
        }

        if (toneProfile === "heroic") {
            pool = [
                `From the start, this feels like ${genreText} shaped by ${concept}.`,
                `This plays like ${genreText} built around ${concept}.`,
                `At its core, this is ${genreText} shaped by ${concept}.`,
                `Everything here points toward ${genreText} where ${concept} keeps opening harder, bigger choices.`,
                `This is ${genreText} that keeps building momentum through ${concept}.`
            ];
        }

        if (toneProfile === "lighthearted") {
            pool = [
                `From the start, this feels like ${genreText} built around ${concept}.`,
                `This plays like ${genreText} shaped by ${concept}.`,
                `At its core, this is ${genreText} shaped by ${concept}.`,
                `Everything here leans toward ${genreText} powered by ${concept}.`
            ];
        }
    }

    return pickOne(pool, `This feels like ${genreText} built around ${concept}.`, true);
}

function buildPitchSupportLine({ systemText = "", coreText = "", usedText = "" }) {
    const used = String(usedText || "").toLowerCase();

    if (
        systemText &&
        !used.includes(systemText.toLowerCase())
    ) {
        return pickOne([
            `A lot of its momentum comes from ${systemText}.`,
            `Much of the pressure comes through ${systemText}.`,
            `It keeps building through ${systemText}.`,
            `A lot of play gets shaped by ${systemText}.`,
            `The tension really takes form through ${systemText}.`,
            `Much of the campaign’s rhythm comes from ${systemText}.`,
            `A lot of the campaign’s edge comes from ${systemText}.`,
            `The experience keeps turning on ${systemText}.`
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

    const includeCleanRaw = cleanIncludeText(includeNotes);
    const includeClean = dedupePhrases(includeCleanRaw);
    const includePhrase = includeClean
        .toLowerCase()
        .replace(/keep it\s*/g, "")
        .replace(/\/\s*kid-safe/g, "")
        .trim();

    const third = includePhrase
        ? pickOne([
            `The overall feel stays ${includePhrase}.`,
            `Tone-wise, it stays ${includePhrase}.`,
            `It keeps that ${includePhrase} edge without losing momentum.`
        ], "", true)
        : "";

    let text = assemblePitchSentences(first, second, third);

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