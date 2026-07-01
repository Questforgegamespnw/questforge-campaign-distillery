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

function normalizePitchConceptText(text = "") {
    return stripCampaignPrefix(text)
        .replace(/[.,;:!?]+$/g, "")
        .replace(/\s+/g, " ")
        .trim();
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
    const value = normalizePitchConceptText(text);
    const t = value.toLowerCase();

    if (!t) return "identity";

    if (
        /^(something|someone|the world|the truth|the answers|reality|power|identity|everything|familiar patterns)\b/.test(t) &&
        /\b(is|are|feels|keep|keeps|becomes|remains|hides|reveals|behave|asks|refuses)\b/.test(t)
    ) {
        return "proposition";
    }

    if (
        /^(awakening|piecing together|changing|moving through|gaining|making|taking|shaping|watching|managing|following|exploring|working with|using|dealing with|choosing|pushing|surviving|facing|adapting|seeing)\b/.test(t)
    ) {
        return "activity";
    }

    if (
        /^(the repeated failure|the world’s inability|the world's inability|evidence that|small inconsistencies|reality drifting|pressure|identity under|the cost|cost|decay|collapse|scarcity|instability|conflict|change|power|survival|exploration|investigation|adaptation|confrontation|movement|control)\b/.test(t)
    ) {
        return "theme";
    }

    return "identity";
}

function buildTypedPitchConcept(text = "", coreIds = []) {
    const base = normalizePitchConceptText(text);
    const varied = coreIds.includes("something_is_wrong")
        ? pickOne([
            "evidence that familiar patterns no longer behave as expected",
            "the repeated failure of ordinary explanations",
            "the world’s inability to conceal its contradictions",
            "reality drifting out of alignment with what people expect",
            "small inconsistencies pointing toward a deeper distortion"
        ], base, true)
        : base;

    const type = classifyPitchConcept(varied);
    const nominalized = type === "proposition"
        ? (/^(the fact|the truth|the realization) that\b/i.test(varied)
            ? varied
            : `the fact that ${varied}`)
        : varied;

    return {
        text: varied,
        clause: type === "proposition" ? varied : "",
        nominalized,
        type
    };
}

function cleanPitchSurfaceText(text = "") {
    return String(text || "")
        .replace(/\s+/g, " ")
        .replace(/\s+([.,!?;:])/g, "$1")
        .replace(/([.!?])\1+/g, "$1")
        .replace(/\b(\w+)\s+\1\b/gi, "$1")
        .replace(/\.\s+\./g, ".")
        .trim();
}

function buildPitchLead({ label, toneProfile, genreCampaignText, concept }) {
    const genreText = withIndefiniteArticle(genreCampaignText || "campaign");
    const definiteGenreText = genreText.replace(/^(?:a|an)\s+/i, "");
    const conceptText = normalizePitchConceptText(concept?.text || "");
    const conceptType = concept?.type || "identity";
    const propositionClause = normalizePitchConceptText(concept?.clause || conceptText);
    const propositionNoun = normalizePitchConceptText(
        concept?.nominalized || `the fact that ${propositionClause}`
    );
    const direction = ["primary", "adjacent", "wildcard"].includes(label)
        ? label
        : "primary";

    const basePools = {
        primary: {
            identity: [
                `${capitalizeFirst(conceptText)} gives ${genreText} its central identity.`,
                `This is ${genreText} centered on ${conceptText}.`,
                `${capitalizeFirst(conceptText)} defines the campaign from its opening scene.`
            ],
            activity: [
                `${capitalizeFirst(conceptText)} drives the table experience in ${genreText}.`,
                `The campaign builds its momentum through ${conceptText}.`,
                `Play begins with ${conceptText} as the group’s recurring focus.`
            ],
            theme: [
                `${capitalizeFirst(conceptText)} shapes every major turn in ${genreText}.`,
                `The campaign opens under the pressure of ${conceptText}.`,
                `${capitalizeFirst(conceptText)} establishes the campaign’s central tension.`
            ],
            proposition: [
                `This is ${genreText} where ${propositionClause}.`,
                `The campaign begins from the truth that ${propositionClause}.`,
                `${capitalizeFirst(propositionNoun)} becomes the campaign’s first undeniable fact.`
            ]
        },
        adjacent: {
            identity: [
                `The adjacent direction shifts the campaign’s identity toward ${conceptText}.`,
                `This version brings ${conceptText} closer to the foreground.`,
                `The campaign keeps its foundation but places more weight on ${conceptText}.`
            ],
            activity: [
                `The adjacent direction shifts play toward ${conceptText}.`,
                `This version changes the recurring focus to ${conceptText}.`,
                `The new emphasis becomes visible through ${conceptText}.`
            ],
            theme: [
                `The adjacent direction brings ${conceptText} closer to the center of every decision.`,
                `This version changes where the pressure lands by emphasizing ${conceptText}.`,
                `The campaign retains its premise while giving ${conceptText} greater weight.`
            ],
            proposition: [
                `The adjacent direction changes the premise by making it clear that ${propositionClause}.`,
                `This version shifts the campaign’s meaning around ${propositionNoun}.`,
                `The new emphasis begins with the realization that ${propositionClause}.`
            ]
        },
        wildcard: {
            identity: [
                `The wildcard pushes ${conceptText} into the campaign’s boldest expression.`,
                `${capitalizeFirst(conceptText)} becomes the direction’s defining break from the expected path.`,
                `The bolder version rebuilds the campaign around ${conceptText}.`
            ],
            activity: [
                `The wildcard makes ${conceptText} the campaign’s dominant mode of play.`,
                `The bolder version drives every major turn through ${conceptText}.`,
                `${capitalizeFirst(conceptText)} takes over the campaign’s rhythm completely.`
            ],
            theme: [
                `The wildcard lets ${conceptText} reshape the entire direction.`,
                `The bolder version follows ${conceptText} until it changes the campaign’s meaning.`,
                `${capitalizeFirst(conceptText)} becomes impossible to treat as background.`
            ],
            proposition: [
                `The wildcard follows ${propositionNoun} to its sharpest consequences.`,
                `The bolder version refuses to look away from ${propositionNoun}.`,
                `${capitalizeFirst(propositionNoun)} becomes the premise the campaign can no longer contain.`
            ]
        }
    };

    const tonePools = {
        heroic: {
            primary: [
                `${capitalizeFirst(conceptText)} gives the group a clear challenge they can meaningfully answer.`,
                `This is ${genreText} where ${conceptText} creates a call to purposeful action.`
            ],
            adjacent: [
                `The adjacent direction turns ${conceptText} into a new front for meaningful action.`,
                `This shift gives the group another way to shape the outcome through ${conceptText}.`
            ],
            wildcard: [
                `The wildcard turns ${conceptText} into the campaign’s largest test of resolve.`,
                `The bolder version makes ${conceptText} impossible to leave unanswered.`
            ]
        },
        grimdark: {
            primary: [
                `${capitalizeFirst(conceptText)} is already doing damage when ${genreText} begins.`,
                `This is ${genreText} shaped by ${conceptText}, with no clean route through it.`
            ],
            adjacent: [
                `The adjacent direction changes where the damage lands by emphasizing ${conceptText}.`,
                `This shift brings ${conceptText} closer to the surface without reducing its cost.`
            ],
            wildcard: [
                `The wildcard follows ${conceptText} into its harshest workable form.`,
                `The bolder version lets ${conceptText} strip away the last clean option.`
            ]
        },
        psychological: {
            primary: [
                `${capitalizeFirst(conceptText)} makes ${genreText} feel personal before it feels explainable.`,
                `This is ${genreText} where ${conceptText} destabilizes what the characters trust.`
            ],
            adjacent: [
                `The adjacent direction shifts ${conceptText} closer to perception, memory, and trust.`,
                `This version makes ${conceptText} harder to separate from the characters’ sense of self.`
            ],
            wildcard: [
                `The wildcard pushes ${conceptText} into a more intimate and destabilizing form.`,
                `The bolder version lets ${conceptText} change the people trying to understand it.`
            ]
        },
        mythic: {
            primary: [
                `${capitalizeFirst(conceptText)} gives ${genreText} meaning beyond the immediate struggle.`,
                `This is ${genreText} where ${conceptText} echoes through a larger pattern.`
            ],
            adjacent: [
                `The adjacent direction reveals ${conceptText} as another face of a larger pattern.`,
                `This shift gives ${conceptText} symbolic weight beyond the present moment.`
            ],
            wildcard: [
                `The wildcard turns ${conceptText} into omen, legacy, and consequence.`,
                `The bolder version places ${conceptText} inside a pattern large enough to reshape the world.`
            ]
        },
        lighthearted_chaotic: {
            primary: [
                `${capitalizeFirst(conceptText)} sends ${genreText} moving toward lively, dangerous complications.`,
                `This is ${genreText} powered by the momentum of ${conceptText}.`
            ],
            adjacent: [
                `The adjacent direction turns ${conceptText} into a faster route toward trouble and opportunity.`,
                `This shift gives ${conceptText} more room to create motion, risk, and surprise.`
            ],
            wildcard: [
                `The wildcard pushes ${conceptText} into its fastest and strangest workable form.`,
                `The bolder version turns ${conceptText} into a chain of dangerous opportunities.`
            ]
        }
    };

    const propositionTonePools = {
        heroic: {
            primary: [`This is ${genreText} where ${propositionClause} creates a clear call to action.`],
            adjacent: [`This shift gives ${propositionNoun} a more purposeful consequence.`],
            wildcard: [`The bolder version makes ${propositionNoun} impossible to leave unanswered.`]
        },
        grimdark: {
            primary: [`${capitalizeFirst(propositionNoun)} is already doing damage when ${genreText} begins.`],
            adjacent: [`This shift brings ${propositionNoun} closer to the surface without reducing its cost.`],
            wildcard: [`The bolder version follows ${propositionNoun} until no clean option remains.`]
        },
        psychological: {
            primary: [`In ${genreText}, ${propositionNoun} destabilizes what the characters trust.`],
            adjacent: [`This version makes ${propositionNoun} harder to separate from perception, memory, and trust.`],
            wildcard: [`The bolder version lets ${propositionNoun} change the people trying to understand it.`]
        },
        mythic: {
            primary: [`This is ${genreText} where ${propositionClause} echoes through a larger pattern.`],
            adjacent: [`This shift gives ${propositionNoun} symbolic weight beyond the present moment.`],
            wildcard: [`The wildcard turns ${propositionNoun} into omen, legacy, and consequence.`]
        },
        lighthearted_chaotic: {
            primary: [`In this ${definiteGenreText}, ${propositionNoun} keeps creating lively complications.`],
            adjacent: [`This shift gives ${propositionNoun} more room to create motion, risk, and surprise.`],
            wildcard: [`The bolder version turns ${propositionNoun} into a chain of dangerous opportunities.`]
        }
    };

    const typedPool = basePools[direction]?.[conceptType] || basePools[direction].identity;
    const tonalPool = conceptType === "proposition"
        ? (propositionTonePools[toneProfile]?.[direction] || [])
        : (tonePools[toneProfile]?.[direction] || []);
    const pool = tonalPool.length ? [...tonalPool, ...typedPool] : typedPool;

    return pickOne(pool, typedPool[0] || "", true);
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

function buildPitchSupportLine({ systemText = "", coreText = "", usedText = "", toneProfile = "neutral", label = "primary" }) {
    const used = String(usedText || "").toLowerCase();

    if (systemText && !used.includes(systemText.toLowerCase())) {
        const toneTemplates = toneRenderMap[toneProfile]?.support || [];
        if (toneTemplates.length) {
            return renderToneTemplate(pickOne(toneTemplates, "", true), systemText);
        }

        const supportPools = {
            primary: [
                `At the table, that identity becomes concrete through ${systemText}.`,
                `Day-to-day play gives the premise practical shape through ${systemText}.`,
                `The group experiences that central conflict through ${systemText}.`
            ],
            adjacent: [
                `The gameplay shift becomes visible through ${systemText}.`,
                `At the table, the changed emphasis redirects play toward ${systemText}.`,
                `This version distinguishes itself through ${systemText}.`
            ],
            wildcard: [
                `At the table, the bolder premise takes over through ${systemText}.`,
                `The stranger framing becomes playable through ${systemText}.`,
                `This sharper direction drives the group toward ${systemText}.`
            ]
        };

        return pickOne(supportPools[label] || supportPools.primary, "", true);
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

    const concept = buildTypedPitchConcept(coreAForPitch || "", coreIds);

    const first = buildPitchLead({
        label,
        toneProfile,
        genreCampaignText,
        concept
    });

    const second = buildPitchSupportLine({
        systemText: primarySystemText,
        coreText: concept.text,
        usedText: first,
        toneProfile,
        label
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

    text = cleanPitchSurfaceText(text);

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