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
    genreVoiceMap,
    toneRenderMap,
    resolvePitchToneProfile
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
    const concept = stripCampaignPrefix(conceptText)
        .replace(/[.,;:!?]+$/g, "")
        .trim();
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
                `The emphasis moves toward the fact that ${concept}.`,
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
                `The bolder interpretation builds around the truth that ${concept}.`,
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

    // Tone changes cadence and emphasis without bypassing grammatical routing.
    const toneLeadPools = {
        heroic: {
            primary: shape === "proposition"
                ? [`This is ${genreText} where the truth that ${concept} gives the group something meaningful to answer.`, `At its core, ${genreText} turns the fact that ${concept} into a call to action.`]
                : [`In ${genreText}, the group keeps moving toward choices that matter through ${concept}.`, `The campaign gains a clear sense of purpose and forward motion through ${concept}.`],
            adjacent: shape === "proposition"
                ? [`The alternate direction turns the truth that ${concept} into a new challenge the group can shape.`, `Here, the fact that ${concept} opens another front for meaningful action.`]
                : [`The alternate direction draws new purposeful momentum from ${concept}.`, `Here, the group finds another way to make a difference through ${concept}.`],
            wildcard: shape === "proposition"
                ? [`The wildcard follows the truth that ${concept} into a larger test of resolve.`, `The bolder interpretation makes the fact that ${concept} impossible to leave unanswered.`]
                : [`The wildcard pushes ${concept} toward its boldest, most consequential expression.`, `This direction turns ${concept} into a larger call to action.`]
        },
        grimdark: {
            primary: shape === "proposition"
                ? [`This is ${genreText} where the fact that ${concept} leaves no clean way through.`, `From the start, the truth that ${concept} is already doing damage.`]
                : [`This drops the group into ${genreText} shaped by ${concept}.`, `The campaign lets ${concept} bear down on ${genreText}, leaving little room for clean victories.`],
            adjacent: shape === "proposition"
                ? [`The alternate direction leans into the fact that ${concept}, and the cost shows early.`, `Here, the truth that ${concept} strips away another clean option.`]
                : [`The alternate direction drags ${concept} closer to the surface.`, `Here, ${concept} shifts the damage without reducing it.`],
            wildcard: shape === "proposition"
                ? [`The wildcard follows the truth that ${concept} to its ugliest consequences.`, `The bolder interpretation makes the fact that ${concept} impossible to survive unchanged.`]
                : [`The wildcard commits to ${concept} without softening what it costs.`, `This direction makes the cost of ${concept} harsher, sharper, and harder to escape.`]
        },
        psychological: {
            primary: shape === "proposition"
                ? [`This is ${genreText} where the fact that ${concept} keeps destabilizing what the characters trust.`, `At its core, the truth that ${concept} turns every certainty inward.`]
                : [`This is ${genreText} centered on ${concept}, with the pressure landing close to the characters.`, `In ${genreText}, the pressure takes on a more inward and unstable edge through ${concept}.`],
            adjacent: shape === "proposition"
                ? [`The alternate direction makes the fact that ${concept} feel less like information and more like intrusion.`, `Here, the truth that ${concept} changes how the characters read everything around them.`]
                : [`The alternate direction brings ${concept} closer to the characters' sense of self.`, `Here, ${concept} becomes harder to separate from perception, memory, and trust.`],
            wildcard: shape === "proposition"
                ? [`The wildcard follows the fact that ${concept} until even interpretation becomes unstable.`, `The bolder interpretation makes the truth that ${concept} impossible to hold at a safe distance.`]
                : [`The wildcard pushes ${concept} into a more intimate and destabilizing form.`, `This direction lets ${concept} start changing the people trying to understand it.`]
        },
        mythic: {
            primary: shape === "proposition"
                ? [`This unfolds as ${genreText} where the truth that ${concept} carries meaning beyond the immediate struggle.`, `At its core, the fact that ${concept} gives ${genreText} the weight of an older pattern.`]
                : [`This unfolds as ${genreText} built around ${concept}.`, `Within ${genreText}, the consequences of ${concept} reach beyond any one character.`],
            adjacent: shape === "proposition"
                ? [`The alternate direction reveals the fact that ${concept} as another face of a larger pattern.`, `Here, the truth that ${concept} carries symbolic weight beyond the present moment.`]
                : [`The alternate direction raises ${concept} into a more symbolic role.`, `Here, the campaign places ${concept} within a struggle larger than the group first understood.`],
            wildcard: shape === "proposition"
                ? [`The wildcard follows the truth that ${concept} toward its most world-shaping meaning.`, `The bolder interpretation turns the fact that ${concept} into omen, symbol, and consequence.`]
                : [`The wildcard turns ${concept} into the direction’s largest and most legendary expression.`, `This direction places ${concept} inside a pattern that reaches beyond the immediate story.`]
        },
        lighthearted_chaotic: {
            primary: shape === "proposition"
                ? [`This is ${genreText} where the fact that ${concept} keeps throwing the group into lively, dangerous complications.`, `From the start, the truth that ${concept} keeps the adventure moving in unexpected directions.`]
                : [`This plays like ${genreText} powered by ${concept}.`, `${capitalizeFirst(genreText)} draws adventurous, unpredictable energy from ${concept}.`],
            adjacent: shape === "proposition"
                ? [`The alternate direction turns the fact that ${concept} into a faster route toward trouble and opportunity.`, `Here, the truth that ${concept} keeps opening lively new complications.`]
                : [`The alternate direction gives ${concept} more room to create motion, risk, and surprise.`, `Here, ${concept} keeps the group improvising through real danger.`],
            wildcard: shape === "proposition"
                ? [`The wildcard follows the fact that ${concept} into its wildest workable consequences.`, `The bolder interpretation turns the truth that ${concept} into a chain of dangerous opportunities.`]
                : [`The wildcard pushes ${concept} into a faster, stranger, and more unpredictable form.`, `This direction keeps the danger sharp and the possibilities moving through ${concept}.`]
        }
    };

    if (toneLeadPools[toneProfile]?.[direction]) {
        pool = toneLeadPools[toneProfile][direction];
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

function renderToneTemplate(template = "", systemText = "") {
    const system = String(systemText || "").trim();
    return String(template || "")
        .replace(/\{System\}/g, capitalizeFirst(system))
        .replace(/\{system\}/g, system);
}

function buildPitchSupportLine({ systemText = "", coreText = "", usedText = "", toneProfile = "neutral" }) {
    const used = String(usedText || "").toLowerCase();

    if (systemText && !used.includes(systemText.toLowerCase())) {
        const toneTemplates = toneRenderMap[toneProfile]?.support || [];
        if (toneTemplates.length) {
            return renderToneTemplate(pickOne(toneTemplates, "", true), systemText);
        }

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

    if (coreText && !used.includes(coreText.toLowerCase())) {
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

    const toneProfile = resolvePitchToneProfile(toneText);

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
        usedText: first,
        toneProfile
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