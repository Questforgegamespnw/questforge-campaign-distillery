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
    getSystemPitchText,
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
    softenIdentityPhrase
} = require("./pitchSafetyFilters");

///Helpers///

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


function getSettingHookMaterial({ genre = {}, environments = [] }) {
    const genreId = cleanName(genre?.id || "").toLowerCase();
    const genreVoice = genreVoiceMap[genreId] || {};

    const environmentEntries = uniqueByName(environments)
        .map((entry) => cleanName(entry?.id || "").toLowerCase())
        .filter(Boolean);

    const environmentImagery = environmentEntries.flatMap((id) =>
        environmentVoiceMap[id]?.imagery || []
    );

    const environmentGameplay = environmentEntries.flatMap((id) =>
        environmentVoiceMap[id]?.gameplay || []
    );

    return {
        environmentImagery,
        environmentGameplay,
        genreImagery: genreVoice.imagery || [],
        genreFraming: genreVoice.framing || []
    };
}

function buildSettingHookFollowup({ genre = {}, environments = [], label = "primary" }) {
    const material = getSettingHookMaterial({ genre, environments });
    const environmentImagery = pickOne(material.environmentImagery, "");
    const environmentGameplay = pickOne(material.environmentGameplay, "");
    const genreImagery = pickOne(material.genreImagery, "");
    const genreFraming = pickOne(material.genreFraming, "");

    const environmentPools = {
        primary: [
            environmentImagery ? `The first clues emerge through ${environmentImagery}.` : "",
            environmentGameplay || ""
        ],
        adjacent: [
            environmentGameplay || "",
            environmentImagery ? `That shift becomes visible through ${environmentImagery}.` : ""
        ],
        wildcard: [
            environmentImagery ? `The stranger edge shows itself through ${environmentImagery}.` : "",
            environmentGameplay || ""
        ]
    };

    const genreFallbackPools = {
        primary: [
            genreImagery ? `The campaign grounds that tension in ${genreImagery}.` : "",
            genreFraming ? `The campaign grounds that tension in ${genreFraming}.` : ""
        ],
        adjacent: [
            genreImagery ? `The altered emphasis brings ${genreImagery} closer to the foreground.` : "",
            genreFraming ? `That change also draws on ${genreFraming}.` : ""
        ],
        wildcard: [
            genreImagery ? `The bolder interpretation leans into ${genreImagery}.` : "",
            genreFraming ? `The bolder interpretation leans into ${genreFraming}.` : ""
        ]
    };

    const environmentCandidates = (environmentPools[label] || environmentPools.primary).filter(Boolean);
    if (environmentCandidates.length) {
        return pickOne(environmentCandidates, "", true);
    }

    return pickOne((genreFallbackPools[label] || genreFallbackPools.primary).filter(Boolean), "", true);
}

///Main functions below///

function buildTitle({ genreName, coreAName, systemAName, label }) {
    const coreId = cleanName(coreAName).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const systemId = cleanName(systemAName).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    const coreTitles = {
        survival_against_overwhelming_force: "Against Impossible Odds",
        power_comes_from_within: "The Power Awakening",
        entropy_decay: "While the World Fails",
        the_endless_siege: "The Last Line Holds",
        hidden_truth: "The Hidden Pattern",
        lost_knowledge: "What the Ruins Remember",
        investigators_burden: "The Weight of the Truth",
        creation_vs_destruction: "What Must End",
        war_of_ideologies: "The War for What Comes Next",
        power_vacuum: "The Empty Throne",
        fragmented_self: "The Fractured Self",
        becoming_something_else: "What We Are Becoming",
        what_is_humanity: "The Human Question",
        power_has_a_cost: "The Price of Power",
        cycle_recurrence: "The Turning Wheel",
        the_world_is_alive: "The Living World"
    };

    const systemTitles = {
        tactical_positioning_zone_control: "Lines of Battle",
        resource_scarcity: "What Remains",
        asymmetrical_boss_design: "The Unfair Fight",
        clue_web: "A Web of Clues",
        exploration_discovery_loop: "Beyond the Known Road",
        influence_social_leverage: "Leverage and Allegiance",
        hidden_information: "Behind Closed Doors",
        alliance_vs_betrayal: "The Price of Allegiance",
        faction_reputation: "Names Carry Weight",
        living_world_reaction: "A World That Answers",
        upgrade_through_risk: "Power Worth the Risk",
        corruption_transformation_track: "The Shape of Change",
        modular_build_system: "Built by Choice"
    };

    const fallbackCore = humanizeName(coreAName || genreName || "Campaign");
    const fallbackSystem = humanizeName(systemAName || coreAName || "Campaign");

    if (label === "primary") {
        return coreTitles[coreId] || fallbackCore;
    }

    if (label === "adjacent") {
        return systemTitles[systemId] || fallbackSystem;
    }

    if (label === "wildcard") {
        return coreTitles[coreId] || fallbackCore;
    }

    return coreTitles[coreId] || systemTitles[systemId] || fallbackCore;
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
        .replace(/self is incomplete,\s*divided and incomplete/gi, "self is divided and incomplete")
        .replace(/^every gain extracts something in return/i, "every gain comes at a cost")
        .replace(/^understanding what is really happening comes with consequences/i, "understanding the truth carries consequences")
        .trim();

    const followupTransitions = [
        "Alongside that,",
        "At the same time,",
        "Running underneath it all,",
        "What makes it harder is that",
        "What gives it extra weight is that",
        "Beneath that,",
        "Complicating matters,"
    ];

    const transition = pickOne(followupTransitions, "At the same time,");

    let text = `${coreADesc}. ${transition} ${coreBDesc.toLowerCase()}.`;

    text = text
        .replace(/\s+/g, " ")
        .replace(/\.\s*/g, ". ")
        .replace(/(^|\.\s)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`)
        .trim();

    text = softenIdentityPhrase(text, experienceProfile);
    text = cleanOutputText(text);

    return isYouthProfile(experienceProfile) ? softenYouthText(text) : text;
}

///Helpers for buildPlayersDo for sentence structure variation///

function buildPlayersDoActionSentence(opener, actionText) {
    if (!actionText) return "";
    return `${opener} ${actionText}.`;
}

function buildPlayersDoEscalationSentence(text) {
    return text ? `${sentenceCase(text)}.` : "";
}

function normalizeActionText(text) {
    if (!text) return { text: "", hasSubject: false };

    const trimmed = String(text).trim();
    const hasSubject = /^(players|the group|characters)\b/i.test(trimmed);

    return {
        text: hasSubject ? sentenceCase(trimmed) : trimmed,
        hasSubject
    };
}

function makeActionPhraseCompatible(text = "") {
    let cleaned = String(text || "").trim();

    if (/^power changing the characters over time$/i.test(cleaned)) {
        return "dealing with power that gradually reshapes the characters";
    }

    if (/^power gradually reshaping the characters$/i.test(cleaned)) {
        return "dealing with power that gradually reshapes the characters";
    }

    if (/^power reshaping the characters$/i.test(cleaned)) {
        return "dealing with power that reshapes the characters";
    }

    if (/^a world reacting to what the players do$/i.test(cleaned)) {
        return "navigating a world that reacts to what the players do";
    }

    if (/^choices and alliances reshaping how the world responds$/i.test(cleaned)) {
        return "making choices and alliances that reshape how the world responds";
    }

    return cleaned;
}

function softenRepeatedConcept(action = "") {
    const text = action.toLowerCase();

    if (text.includes("power") && text.includes("reshape")) {
        return "coping with changes that alter who the characters are becoming";
    }

    return action;
}
///End of buildPlayersDo Helpers///
function buildPlayersDo(systemA, systemB, experienceProfile, label = "primary", toneName = "") {
    const systemALead = getSystemPitchText(systemA);
    const systemBLead = getSystemPitchText(systemB);

    const openersByLabel = {
        primary: [
            "You’ll spend most of your time",
            "Most of play is about",
            "Play frequently returns to",
            "Play usually revolves around",
            "Most sessions center on",
            "The group spends most of its time",
            "What defines play here is",
            "The experience is built around",
            "Play tends to focus on",
            "The campaign leans heavily on",
            "A typical session focuses on",
            "The core of play is",
            "The gameplay repeatedly centers on"
        ],

        adjacent: [
            "Play here tends to revolve around",
            "Most sessions focus on",
            "The experience shifts toward",
            "You’ll find the group spending more time",
            "The campaign starts focusing more on",
            "There’s a stronger emphasis on",
            "The alternate direction makes more room for",
            "At the table, the change is most visible in",
            "This take repeatedly returns to"
        ],

        wildcard: [
            "Here, the tension comes from",
            "The campaign comes alive through",
            "Most of the pressure shows up through",
            "What defines play here is",
            "Sessions tend to focus on",
            "The wildcard pushes play toward",
            "The campaign leans hardest into",
            "What really drives this direction is",
            "Its boldest table-facing choice is",
            "The stranger version keeps returning to"
        ],

        default: [
            "Play tends to center on",
            "Most sessions revolve around"
        ]
    };

    const connectiveLinesByLabel = {
        primary: [
            "That pressure shows up quickly once play is underway",
            "What starts as manageable play gets more unstable over time",
            "The group gets room to act, but never without consequences pushing back",
            "The table experience keeps tightening as the group pushes further in",
            "Even small decisions start to carry larger consequences",
            "Each success changes what comes next"
        ],
        adjacent: [
            "The wider situation keeps changing around otherwise concrete actions",
            "Each step forward opens up more to deal with, not less",
            "The alternate approach makes familiar problems harder to control",
            "What looks straightforward early on grows more complicated in play",
            "The shift becomes clearer as the group commits to it",
            "The campaign keeps raising the stakes around the new emphasis"
        ],
        wildcard: [
            "The pressure builds in ways the group cannot fully predict",
            "The stranger premise keeps turning simple actions into larger complications",
            "The situation evolves faster than the group can completely stabilize it",
            "The more the group commits, the less familiar the consequences become",
            "The system pushes back harder the further this direction goes",
            "What feels manageable at first becomes increasingly difficult to contain"
        ],
        default: [
            "The situation keeps changing as the group pushes further",
            "Each decision alters what comes next"
        ]
    };


    const secondaryOpeners = [
        "You’ll also spend time",
        "You’ll also keep coming back to",
        "The group also spends time",
        "A second layer of play comes from"
    ];
/// Commented out a fix for wiring pitch into the playersDo function that will be implemented later///
    // const pitchText = (pitch || "").toLowerCase();

    // function isOverlappingConcept(action = "") {
    //     const cleaned = action.toLowerCase();

    //     if (cleaned.includes("power") && pitchText.includes("power")) {
    //         return true;
    //     }

    //     if (cleaned.includes("identity") && pitchText.includes("identity")) {
    //         return true;
    //     }

    //     return false;
    // }

    const opener = chooseByLabel(label, openersByLabel);
    let firstAction = makeActionPhraseCompatible(systemALead || "");
    firstAction = softenRepeatedConcept(firstAction);
    
    const secondAction = systemBLead && systemBLead !== systemALead
        ? makeActionPhraseCompatible(systemBLead)
        : "";
    const toneProfile = resolvePitchToneProfile(toneName);
    const toneEscalationPool = toneRenderMap[toneProfile]?.escalation?.[label] || [];
    const escalation = toneEscalationPool.length
        ? pickOne(toneEscalationPool, "")
        : pickOne(connectiveLinesByLabel[label] || connectiveLinesByLabel.default, "");
    const { text: secondText, hasSubject: secondHasSubject } = normalizeActionText(secondAction);

    const joiners = [
        " while also ",
        ", alongside ",
        ", with an additional focus on "
    ];
    const joiner = pickOne(joiners, " while also ", true);

    const structureType = pickOne(
        ["three_line", "action_then_escalation", "dual_action", "compressed"],
        "three_line",
        true
    );

    let sentences = [];

    if (structureType === "three_line") {
        sentences = [
            buildPlayersDoActionSentence(opener, firstAction),
            secondText
                ? (secondHasSubject
                    ? `${secondText}.`
                    : buildPlayersDoActionSentence(
                        pickOne(secondaryOpeners, "You’ll also spend time"),
                        secondText
                    ))
                : "",
            escalation ? buildPlayersDoEscalationSentence(escalation) : ""
        ];
    }

    if (structureType === "action_then_escalation") {
        let combinedAction;

        if (secondHasSubject) {
            combinedAction = firstAction;
        } else {
            combinedAction = [firstAction, secondText]
                .filter(Boolean)
                .join(joiner);
        }

        sentences = [
            buildPlayersDoActionSentence(opener, combinedAction || firstAction),
            escalation ? buildPlayersDoEscalationSentence(escalation) : ""
        ];
    }

    if (structureType === "dual_action") {
        sentences = [
            buildPlayersDoActionSentence(opener, firstAction),
            secondText
                ? (secondHasSubject
                    ? `${secondText}.`
                    : buildPlayersDoActionSentence(
                        pickOne(secondaryOpeners, "You’ll also spend time"),
                        secondText
                    ))
                : "",
            escalation ? buildPlayersDoEscalationSentence(escalation) : ""
        ];
    }

    if (structureType === "compressed") {
        let combined;

        if (secondHasSubject) {
            combined = firstAction;
        } else {
            combined = [firstAction, secondText]
                .filter(Boolean)
                .join(joiner);
        }

        const compressedEscalation = escalation
            ? ` ${sentenceCase(escalation)}.`
            : "";

        sentences = [
            combined ? `${opener} ${combined}.` : "",
            secondHasSubject ? `${secondText}.` : "",
            compressedEscalation || ""
        ];
    }
    let text = sentences.filter(Boolean).join(" ");

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
    const toneProfile = resolvePitchToneProfile(toneName);

    const followupPools = {
        disruption: [
            "The first break widens instead of settling back down.",
            "Every attempt to steady the situation reveals something else already slipping.",
            "What looks like a single fracture soon becomes a larger pattern the group cannot ignore.",
            "Stability proves temporary, and each repair exposes a deeper fault."
        ],
        pressure: [
            "Every delay, compromise, or hard choice carries a heavier price than the last one.",
            "The situation tightens faster than anyone can solve it cleanly.",
            "The central question becomes what can still be protected before the cost climbs again.",
            "Even successful choices leave the group with less room than before."
        ],
        mystery: [
            "Every answer risks opening a larger contradiction instead of closing the question.",
            "The truth arrives in pieces that are useful, incomplete, and difficult to trust all at once.",
            "The group is left sorting through answers that only make the larger pattern stranger.",
            "Each discovery clarifies one detail while destabilizing the larger picture."
        ],
        world_state: [
            "Every choice lands inside a world already shifting around the group.",
            "The setting is changing under real strain, whether the group is ready or not.",
            "The story keeps pressing into an instability no one can fully step outside of.",
            "What happens next depends as much on the changing world as on the group’s intentions."
        ],
        character: [
            "The conflict shapes the people caught inside it as much as the world around them.",
            "External pressure stops staying separate from what it is doing to the characters.",
            "Identity, change, and what the characters are becoming remain under constant strain.",
            "The longer the campaign runs, the harder it becomes to separate survival from transformation."
        ]
    };
    const followupIndexesByLabel = {
        primary: [0, 1],
        adjacent: [2],
        wildcard: [3],
        default: [0, 1, 2, 3]
    };
    const followupCandidates = (followupPools[hookCategory] || []).filter((_, index) =>
        (followupIndexesByLabel[label] || followupIndexesByLabel.default).includes(index)
    );
    const thematicFollowup = pickOne(followupCandidates, "");
    const settingFollowup = buildSettingHookFollowup({
        genre,
        environments,
        label
    });
    const toneFollowup = pickOne(
        toneRenderMap[toneProfile]?.hook?.[label] || [],
        "",
        true
    );

    const followup = pickOne(
        [toneFollowup, thematicFollowup, settingFollowup].filter(Boolean),
        toneFollowup || thematicFollowup || settingFollowup || "",
        true
    );

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