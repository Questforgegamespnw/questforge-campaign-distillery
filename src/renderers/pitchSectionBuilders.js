const {
    cleanName,
    humanizeName,
    sentenceCase,
    stripTrailingPeriod,
    normalizeDescription,
    combineToneAndGenre,
    joinNatural,
    uniqueByName,
    cleanIncludeText,
    dedupePhrases,
    chooseByLabel,
    pickOne,
    cleanOutputText,
    formatToneLabel,
    getSystemPitchText
} = require("./pitchCleanup");

const {
    isYouthProfile,
    softenYouthText,
    softenIdentityPhrase
} = require("./pitchSafetyFilters");

function detectHookCategory({ coreIds = [], toneName = "", genreName = "", label = "primary" }) {
    const tone = cleanName(toneName).toLowerCase();
    const genre = cleanName(genreName).toLowerCase();

    if (
        coreIds.includes("hidden_truth") ||
        coreIds.includes("lost_knowledge") ||
        coreIds.includes("something_is_wrong")
    ) {
        return "mystery";
    }

    if (
        coreIds.includes("survival_against_overwhelming_force") ||
        coreIds.includes("endless_siege") ||
        coreIds.includes("entropy_decay") ||
        coreIds.includes("power_has_a_cost")
    ) {
        return "pressure";
    }

    if (
        coreIds.includes("war_of_ideologies") ||
        coreIds.includes("power_vacuum") ||
        coreIds.includes("the_world_is_alive") ||
        coreIds.includes("cycle_recurrence")
    ) {
        return "world_state";
    }

    if (
        coreIds.includes("fragmented_self") ||
        coreIds.includes("becoming_something_else") ||
        coreIds.includes("what_is_humanity") ||
        coreIds.includes("power_comes_from_within")
    ) {
        return "character";
    }

    if (
        tone.includes("grim") ||
        tone.includes("dark") ||
        tone.includes("dangerous") ||
        tone.includes("bleak") ||
        genre.includes("dark")
    ) {
        return "pressure";
    }

    if (label === "wildcard") {
        return "disruption";
    }

    return "disruption";
}

function buildHookLineByCategory(category, label = "primary") {
    const hookPools = {
        disruption: [
            "It starts small—easy to dismiss—until it stops staying small.",
            "At first, nothing seems wrong. Then the pattern breaks.",
            "What looks stable at a glance does not stay that way for long.",
            "The first sign feels minor. The next one is harder to explain away.",
            "Something ordinary gives way first, and after that the rest stops feeling secure."
        ],
        pressure: [
            "There is not enough time to solve this cleanly.",
            "Every decision is already costing more than it should.",
            "The pressure starts early and rarely lets up.",
            "By the time the group understands the problem, something important is already under strain.",
            "This is the kind of situation where delay becomes part of the damage."
        ],
        mystery: [
            "The answers exist, but they do not line up cleanly.",
            "Everything points somewhere. Nothing agrees.",
            "The truth is there, just not in one place or one version.",
            "Every useful lead seems to come with a missing piece attached to it.",
            "The deeper the group looks, the harder it becomes to believe the obvious explanation."
        ],
        world_state: [
            "The world is no longer holding together the way it used to.",
            "Something fundamental has already shifted, and everyone is living in the aftermath.",
            "The setting is already changing before the group fully understands why.",
            "Whatever once kept things stable is no longer doing the job.",
            "The trouble here is larger than one villain or one event; the whole situation has started to move."
        ],
        character: [
            "This stops being distant the moment it starts changing the people inside it.",
            "You are not just dealing with the problem—you are being pulled into what it changes.",
            "What begins out in the world does not stay out there for long.",
            "This was never going to stay impersonal.",
            "The real pressure starts once the conflict becomes part of who the characters are becoming."
        ]
    };

    const adjacentTweaks = {
        disruption: [
            "The break in the pattern shows earlier than anyone expects.",
            "What first looks minor stops feeling containable very quickly.",
            "The first crack widens before anyone has time to call it harmless."
        ],
        pressure: [
            "The pressure starts building earlier than expected.",
            "The cost shows up faster than the group is ready for.",
            "Strain sets in before anyone has a clean way to answer it."
        ],
        mystery: [
            "The pattern gets harder to explain away the deeper you go.",
            "Uncertainty stops feeling accidental very quickly.",
            "Every answer opens onto a larger hidden structure."
        ],
        world_state: [
            "The wider shift is already underway by the time the group gets involved.",
            "The setting is moving before the characters understand what set it off.",
            "The larger instability is already in motion when the story begins."
        ],
        character: [
            "The conflict gets closer to the characters more quickly.",
            "The people involved do not come through it unchanged.",
            "The pressure turns personal sooner than anyone would like."
        ]
    };

    const wildcardTweaks = {
        disruption: [
            "The situation starts breaking in stranger ways than it first should.",
            "The familiar stops behaving like itself almost immediately.",
            "What should feel stable starts slipping out of place."
        ],
        pressure: [
            "The pressure gets sharp enough to leave marks.",
            "Something important is already being squeezed by the time the group arrives.",
            "There is already too much strain in the system for a clean solution."
        ],
        mystery: [
            "What should fit together keeps refusing to do so.",
            "The truth is there, but it reaches the group in damaged pieces.",
            "The answers get stranger instead of cleaner."
        ],
        world_state: [
            "The larger shift stops staying in the background.",
            "The setting itself has already started going unstable.",
            "Whatever was changing under the surface is no longer staying there."
        ],
        character: [
            "The story stops staying external almost immediately.",
            "The conflict starts getting under the characters' skin fast.",
            "What is happening in the world starts changing the people inside it."
        ]
    };

    if (label === "adjacent") {
        return pickOne(adjacentTweaks[category], pickOne(hookPools[category], ""));
    }

    if (label === "wildcard") {
        return pickOne(wildcardTweaks[category], pickOne(hookPools[category], ""));
    }

    return pickOne(hookPools[category], "");
}

function buildTitle({ genreName, coreAName, systemAName, label }) {
    const corePart = coreAName || "Hidden Truth";
    const genrePart = genreName || "Campaign";
    const systemPart = systemAName || "Intrigue";

    const titlesByLabel = {
        primary: `${corePart} in ${genrePart}`,
        adjacent: `${systemPart} Beneath the Surface`,
        wildcard: `The Cost of Knowing`
    };

    return titlesByLabel[label] || `${corePart} and ${systemPart}`;
}

function buildOpening({ label, genreName, toneName, envNames, coreIds = [], experienceProfile }) {
    const envText = joinNatural(envNames);
    const genreText = humanizeName(genreName || "fantasy").toLowerCase();
    const toneText = formatToneLabel(toneName).toLowerCase();
    const pitchGenreText = combineToneAndGenre(toneText, genreText);

    let campaignShape = "campaign";

    if (coreIds.includes("hidden_truth") || coreIds.includes("lost_knowledge")) {
        campaignShape = "mystery";
    } else if (
        coreIds.includes("survival_against_overwhelming_force") ||
        coreIds.includes("the_endless_siege") ||
        coreIds.includes("entropy_decay")
    ) {
        campaignShape = "survival story";
    } else if (
        coreIds.includes("power_comes_from_within") ||
        coreIds.includes("creation_vs_destruction") ||
        coreIds.includes("rise_to_power")
    ) {
        campaignShape = "epic";
    } else if (
        coreIds.includes("war_of_ideologies") ||
        coreIds.includes("power_vacuum") ||
        coreIds.includes("duty_vs_self")
    ) {
        campaignShape = "conflict-driven campaign";
    } else if (
        coreIds.includes("becoming_something_else") ||
        coreIds.includes("fragmented_self") ||
        coreIds.includes("what_is_humanity")
    ) {
        campaignShape = "character-driven descent";
    } else if (
        coreIds.includes("exploration_wonder") ||
        coreIds.includes("the_world_is_alive")
    ) {
        campaignShape = "discovery-driven adventure";
    }

    const genrePhrase = campaignShape === "campaign"
        ? pitchGenreText
        : `${pitchGenreText} ${campaignShape}`;

    if (label === "adjacent") {
        const adjacentOpeners = [
            "Here, the campaign leans into",
            "This one shifts toward",
            "This take moves closer to"
        ];

        const opener = pickOne(adjacentOpeners, "Here, the campaign leans into");
        const base = `${opener} a ${genrePhrase}${envText ? ` set against ${envText}` : ""}.`;
        return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
    }

    if (label === "wildcard") {
        const base = `This is the stranger version: a ${genrePhrase}${envText ? ` set against ${envText}` : ""}.`;
        return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
    }

    const primaryOpeners = [
        "This plays like",
        "At its best, this feels like",
        "This leans into"
    ];

    const opener = pickOne(primaryOpeners, "This plays like");
    const article = /^[aeiou]/i.test(genrePhrase) ? "an" : "a";
    const base = `${opener} ${article} ${genrePhrase}${envText ? ` set against ${envText}` : ""}.`;
    return isYouthProfile(experienceProfile) ? softenYouthText(base) : base;
}

function buildAbout(coreA, coreB, includeNotes, experienceProfile) {
    const coreADesc = stripTrailingPeriod(
        normalizeDescription(
            coreA?.description,
            "The world is not what it seems, and the deeper the players dig, the worse the truth becomes"
        )
    );

    let coreBDesc = stripTrailingPeriod(
        normalizeDescription(
            coreB?.description,
            "Understanding what is really happening comes with consequences"
        )
    );

    coreBDesc = coreBDesc
        .replace(/divided,\s*or\s*incomplete,\s*and\s*incomplete/gi, "divided and incomplete")
        .replace(/divided,\s*or\s*incomplete/gi, "divided and incomplete")
        .replace(/divided and incomplete,\s*and/gi, "divided and incomplete. ")
        .replace(/incomplete,\s*divided and incomplete/gi, "divided and incomplete")
        .replace(/the self is incomplete,\s*divided and incomplete/gi, "the self is divided and incomplete")
        .replace(/\s+/g, " ")
        .replace(/the self is incomplete,\s*divided and incomplete/gi, "the self is divided and incomplete")
        .replace(/self is incomplete,\s*divided and incomplete/gi, "self is divided and incomplete")

        .replace(/^every gain extracts something in return/i, "every gain comes at a cost")
        .replace(/^understanding what is really happening comes with consequences/i, "understanding the truth carries consequences")

        .trim();

    if (
        /makes things worse/i.test(coreBDesc) &&
        /comes with consequences/i.test(coreBDesc)
    ) {
        coreBDesc = coreBDesc.replace(
            /,?\s*and understanding (the truth )?comes with consequences/i,
            ""
        );
    }

    const includeCleanRaw = cleanIncludeText(includeNotes);
    const includeClean = dedupePhrases(includeCleanRaw);

    const tonePhrase = includeClean
        .toLowerCase()
        .replace(/keep it\s*/g, "")
        .replace(/\/\s*kid-safe/g, "")
        .trim();

    const clauseTransitions = [
        "What starts as something contained quickly becomes",
        "It doesn’t stay contained for long, and soon",
        "What begins as a smaller problem grows into",
        "Eventually, it becomes clear that",
        "The more the group engages with it, the more it reveals that",
        "Over time, it starts to show that"
    ];

    const sentenceTransitions = {
        neutral: [
            "Alongside that,",
            "At the same time,",
            "Running underneath it all,"
        ],
        weight: {
            clause: [
                "What gives it extra weight is that",
                "What makes it heavier is that"
            ],

            pivot: [
                "What complicates things is that",
                "What makes it harder is that",
                "The situation turns when",
                "It becomes more dangerous once",
                "That’s where things start to shift:"
            ]
        }
    };

    const useClause = Math.random() < 0.3;
    const useMergedAbout = Math.random() < 0.25;
    const isSentenceLike = /^(the|this|that|everything|reality|something|knowing|understanding|unchecked|every gain|pressure)/i.test(coreBDesc);

    let text;

    if (useMergedAbout) {
        const softMergeTransitions = [
            "From there,",
            "What follows is that",
            "That’s when it becomes clear that",
            "Soon after,",
            "It leads into a situation where"
        ];

        const transition = pickOne(softMergeTransitions);

        text = `${coreADesc}. ${transition} ${coreBDesc.toLowerCase()}.`;
    } else if (useClause && !isSentenceLike) {
        const transition = pickOne(clauseTransitions);

        let coreBFragment = coreBDesc
            .replace(/\.$/, "")
            .toLowerCase();

        if (/^(pressure|everything|the|something|knowing|understanding)/i.test(coreBFragment)) {
            coreBFragment = `a situation where ${coreBFragment}`;
        }

        text = `${coreADesc}. ${transition} ${coreBFragment}.`;
    } else {
        const wantsWeightTransition =
            /cost|loss|corruption|consequences|pressure|collapse|sacrifice/i.test(coreBDesc)
            && Math.random() < 0.7;

        const isFullSentence = /^(the|this|that|everything|reality|something)/i.test(coreBDesc);

        let transition;

        if (wantsWeightTransition) {
            if (isFullSentence) {
                transition = pickOne(sentenceTransitions.weight.pivot);
            } else {
                transition = pickOne(sentenceTransitions.weight.clause);
            }
        } else {
            transition = pickOne(sentenceTransitions.neutral);
        }

        text = `${coreADesc}. ${transition} ${coreBDesc.toLowerCase()}.`;
    }

    text = text
        .replace(/\s+/g, " ")
        .replace(/\.\s*/g, ". ")
        .replace(/, and ([^,]+), and /gi, ", and $1. ")
        .replace(/(^|\.\s)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`)
        .trim();

    if (tonePhrase) {
        text += ` The overall feel stays ${tonePhrase}.`;
    }

    text = softenIdentityPhrase(text, experienceProfile);
    text = cleanOutputText(text);

    return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildPlayersDo(systemA, systemB, experienceProfile, label = "primary") {
    const systemALead = getSystemPitchText(systemA);
    const systemBLead = getSystemPitchText(systemB);

    const openersByLabel = {
        primary: [
            "You’ll spend most of your time",
            "Most of play is about",
            "A lot of play comes from"
        ],

        adjacent: [
            "Play here tends to revolve around",
            "Most sessions start focusing on",
            "The experience shifts toward",
            "This version puts more weight on",
            "You’ll find the group spending more time"
        ],

        wildcard: [
            "Here, a lot of the tension comes from",
            "The campaign really comes alive through",
            "Most of the pressure shows up through",
            "What defines play here is",
            "This version gets its edge from",
            "Sessions tend to focus on"
        ],

        default: [
            "Play tends to center on"
        ]
    };

    const connectiveLines = [
        "That works—until something stops lining up.",
        "It holds together—right up until it doesn’t.",
        "The deeper you go, the harder it is to trust what you’re seeing.",
        "At first it makes sense. Then the pieces stop fitting cleanly.",
        "You start getting answers—but they don’t agree with each other.",
        "It feels manageable—until the situation shifts under you.",
        "The more progress you make, the less stable the bigger picture becomes.",
        "Every step forward changes what you thought you understood.",
        "The picture starts to shift the closer you look.",
        "Clarity comes in pieces—and they don’t stay consistent.",
        "What seemed solid starts to give way under pressure.",
        "The situation stops behaving the way it should.",
        "The more you uncover, the harder it is to stay certain.",
        "Answers come through—but they raise new problems instead.",
        "What made sense earlier doesn’t hold up anymore.",
        "The ground keeps shifting under what you thought you understood."
    ];

    const opener = chooseByLabel(label, openersByLabel);
    const first = systemALead ? `${opener} ${systemALead}.` : "";

    const second = systemBLead && systemBLead !== systemALead
        ? `${sentenceCase(systemBLead)}.`
        : "";

    const third = pickOne(connectiveLines, "");

    let text = [first, second].filter(Boolean).join(" ");
    if (third) text += ` ${third}`;

    text = cleanOutputText(text);

    return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

function buildDistinctHook({
    genre,
    tone,
    environments,
    label,
    experienceProfile,
    coreIds = []
}) {
    const genreDesc = stripTrailingPeriod(cleanName(genre?.description || ""));
    const genreName = cleanName(genre?.name || "");
    const toneName = cleanName(tone?.name || "");

    const envDescs = uniqueByName(environments)
        .map((env) => stripTrailingPeriod(cleanName(env?.description)))
        .filter(Boolean);

    const envLine = pickOne(envDescs, "");
    const hookCategory = detectHookCategory({
        coreIds,
        toneName,
        genreName,
        label
    });

    const hookLead = buildHookLineByCategory(hookCategory, label);

    const followupPools = {
        disruption: [
            "From there, the campaign starts widening around the first break instead of settling back down.",
            "From there, every attempt to steady the situation reveals something else already slipping.",
            "From there, the first fracture turns into a larger pattern the group cannot ignore."
        ],
        pressure: [
            "From there, the campaign keeps asking what can still be protected before the cost climbs again.",
            "From there, every delay, compromise, or hard choice carries a heavier price than the last one.",
            "From there, the situation keeps tightening faster than anyone can solve it cleanly."
        ],
        mystery: [
            "From there, every answer risks opening a larger contradiction instead of closing the question.",
            "From there, the truth keeps arriving in pieces that are useful, incomplete, and hard to trust all at once.",
            "From there, the group is left sorting through answers that only make the larger pattern stranger."
        ],
        world_state: [
            "From there, the group is dealing with a setting already changing under real strain.",
            "From there, every choice lands inside a world that is already shifting around them.",
            "From there, the story keeps pushing into a larger instability no one can fully step outside of."
        ],
        character: [
            "From there, the conflict starts shaping the people caught inside it as much as the world around them.",
            "From there, what is happening outside the group stops staying separate from what it is doing to them.",
            "From there, the story keeps pressing on identity, change, and what the characters are becoming under strain."
        ]
    };

    const followup = pickOne(followupPools[hookCategory], "");

    let text = [hookLead, followup]
        .filter(Boolean)
        .map((line) => {
            const cleaned = sentenceCase(stripTrailingPeriod(line));
            return cleaned ? `${cleaned}.` : "";
        })
        .filter(Boolean)
        .join(" ");

    text = softenIdentityPhrase(text, experienceProfile);
    text = cleanOutputText(text);

    return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

module.exports = {
    detectHookCategory,
    buildHookLineByCategory,
    buildTitle,
    buildOpening,
    buildAbout,
    buildPlayersDo,
    buildDistinctHook
};