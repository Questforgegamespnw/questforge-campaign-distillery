const coreFrames = require("../data/coreFrames");

const AUDIENCE_POLICY_ACTIONS = Object.freeze([
    "preserve",
    "soften",
    "downweight",
    "substitute",
    "suppress"
]);

function substitute(...entries) {
    return entries.map(([id, weight]) => ({ id, weight }));
}

/**
 * Explicit audience handling policy for every standard Core Frame.
 *
 * Action meanings:
 * - preserve: keep the Core Frame as a valid candidate for that audience.
 * - soften: keep the Core Frame, but interpret/render it with gentler framing.
 * - downweight: keep the Core Frame, but reduce its candidate weight.
 * - substitute: replace the Core Frame with youth/kids-safe Core Frames.
 * - suppress: remove the Core Frame for that audience.
 */
const CORE_FRAME_AUDIENCE_POLICY = Object.freeze({
    fate_vs_free_will: {
        youth: {
            action: "soften",
            interpretation: "Choice, agency, and responsibility without fatalism."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["a_small_problem_that_feels_big", 2],
                ["teamwork_solves_everything", 1]
            )
        }
    },

    becoming_something_else: {
        youth: {
            action: "soften",
            interpretation: "Growth, change, and self-understanding without body-horror or loss-of-self framing."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["the_misunderstood_problem", 3],
                ["fixing_whats_broken", 2]
            )
        }
    },

    fragmented_self: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.55,
            interpretation: "Belonging, memory, identity, and self-understanding without severe destabilization."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["the_misunderstood_problem", 3],
                ["a_small_problem_that_feels_big", 2]
            )
        }
    },

    what_is_humanity: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.6,
            interpretation: "Empathy, personhood, and kindness without monster/self-loss framing."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["the_misunderstood_problem", 3],
                ["helping_those_in_need", 2]
            )
        }
    },

    survival_against_overwhelming_force: {
        youth: {
            action: "soften",
            interpretation: "Perseverance under pressure with agency and possible improvement."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["helping_those_in_need", 2],
                ["teamwork_solves_everything", 3]
            )
        }
    },

    war_of_ideologies: {
        youth: {
            action: "soften",
            interpretation: "Competing values and disagreements about what should happen next."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["teamwork_solves_everything", 2],
                ["the_misunderstood_problem", 2]
            )
        }
    },

    power_vacuum: {
        youth: {
            action: "soften",
            interpretation: "Unstable leadership, competing groups, and responsibility after change."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["fixing_whats_broken", 2],
                ["teamwork_solves_everything", 1]
            )
        }
    },

    the_endless_siege: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.65,
            interpretation: "Sustained pressure and endurance with clear chances for relief and progress."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["teamwork_solves_everything", 3],
                ["helping_those_in_need", 2]
            )
        }
    },

    hidden_truth: {
        youth: {
            action: "preserve",
            interpretation: "Secrets, clues, and revelations are appropriate when not framed as forbidden or hopeless."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["something_is_lost_or_missing", 3],
                ["the_misunderstood_problem", 2]
            )
        }
    },

    lost_knowledge: {
        youth: {
            action: "preserve",
            interpretation: "Discovery, lore, history, and missing answers."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["curiosity_leads_the_way", 3],
                ["fixing_whats_broken", 1]
            )
        }
    },

    something_is_wrong: {
        youth: {
            action: "soften",
            interpretation: "A strange pattern or problem needs investigation without severe unreality or dread."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["the_misunderstood_problem", 3],
                ["curiosity_leads_the_way", 2]
            )
        }
    },

    investigators_burden: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.55,
            interpretation: "Truth may be difficult, but discovery should create constructive choices."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["curiosity_leads_the_way", 2],
                ["teamwork_solves_everything", 1]
            )
        }
    },

    power_has_a_cost: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.65,
            interpretation: "Power has tradeoffs and responsibilities without corruption, sacrifice, or doom as the default."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["fixing_whats_broken", 2],
                ["helping_those_in_need", 1]
            )
        }
    },

    power_must_be_controlled: {
        youth: {
            action: "soften",
            interpretation: "Learning discipline, responsibility, and safe use of power."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["fixing_whats_broken", 2],
                ["teamwork_solves_everything", 1]
            )
        }
    },

    power_comes_from_within: {
        youth: {
            action: "preserve",
            interpretation: "Inner growth, confidence, mastery, and self-realization."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["teamwork_solves_everything", 2],
                ["curiosity_leads_the_way", 1]
            )
        }
    },

    power_is_stolen_or_borrowed: {
        youth: {
            action: "soften",
            interpretation: "Borrowed power creates responsibility, limits, and trust questions."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["fixing_whats_broken", 2],
                ["helping_those_in_need", 1]
            )
        }
    },

    cycle_recurrence: {
        youth: {
            action: "soften",
            interpretation: "Repeating patterns can be recognized, understood, and changed."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["curiosity_leads_the_way", 2],
                ["fixing_whats_broken", 2]
            )
        }
    },

    entropy_decay: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.6,
            interpretation: "Things are breaking down, but repair, protection, and improvement remain possible."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["fixing_whats_broken", 3],
                ["helping_those_in_need", 1]
            )
        }
    },

    creation_vs_destruction: {
        youth: {
            action: "soften",
            interpretation: "Change, renewal, and rebuilding without framing loss as inevitable."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["fixing_whats_broken", 2],
                ["the_world_reacts_to_kindness", 2]
            )
        }
    },

    the_world_is_alive: {
        youth: {
            action: "preserve",
            interpretation: "The setting reacts and responds to what the group does."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["the_world_reacts_to_kindness", 3],
                ["curiosity_leads_the_way", 2]
            )
        }
    },

    found_family: {
        youth: {
            action: "preserve",
            interpretation: "Trust, belonging, and bonds formed through shared challenges."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["teamwork_solves_everything", 3],
                ["the_world_reacts_to_kindness", 2]
            )
        }
    },

    duty_vs_self: {
        youth: {
            action: "soften",
            interpretation: "Responsibility, priorities, and choosing what matters without severe sacrifice framing."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["helping_those_in_need", 2],
                ["teamwork_solves_everything", 2]
            )
        }
    },

    moral_grayness: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.65,
            interpretation: "Complicated choices with tradeoffs, but not hopeless no-win moral burden."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["the_misunderstood_problem", 2],
                ["teamwork_solves_everything", 2]
            )
        }
    },

    rise_to_power: {
        youth: {
            action: "soften",
            interpretation: "Growing into influence and responsibility through earned progress."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["teamwork_solves_everything", 2],
                ["curiosity_leads_the_way", 1]
            )
        }
    },

    fall_from_grace: {
        youth: {
            action: "downweight",
            weightMultiplier: 0.5,
            interpretation: "Something trusted needs repair, accountability, or restoration without tragedy as the endpoint."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["fixing_whats_broken", 3],
                ["helping_those_in_need", 2]
            )
        }
    },

    exploration_wonder: {
        youth: {
            action: "preserve",
            interpretation: "Wonder, discovery, and curiosity as rewards."
        },
        kids: {
            action: "substitute",
            behavior: "substitute",
            substitutes: substitute(
                ["curiosity_leads_the_way", 3],
                ["teamwork_solves_everything", 1]
            )
        }
    }
});

const HIGH_RISK_CORE_COMBINATION_RULES = Object.freeze([
    {
        id: "youth_identity_destabilization_stack",
        profiles: ["youth"],
        coreFrameIds: ["fragmented_self", "what_is_humanity"],
        action: "downweight",
        affectedCoreFrameIds: ["fragmented_self", "what_is_humanity"],
        weightMultiplier: 0.5,
        reason: "Avoid stacking severe identity destabilization for youth audiences."
    },
    {
        id: "youth_hopeless_cost_stack",
        profiles: ["youth"],
        coreFrameIds: ["entropy_decay", "power_has_a_cost"],
        action: "downweight",
        affectedCoreFrameIds: ["entropy_decay", "power_has_a_cost"],
        weightMultiplier: 0.6,
        reason: "Avoid letting collapse and sacrifice dominate youth outputs together."
    },
    {
        id: "youth_attrition_pressure_stack",
        profiles: ["youth"],
        coreFrameIds: ["survival_against_overwhelming_force", "the_endless_siege"],
        action: "downweight",
        affectedCoreFrameIds: ["the_endless_siege"],
        weightMultiplier: 0.6,
        reason: "Keep sustained pressure from becoming hopeless endurance."
    },
    {
        id: "kids_identity_destabilization_block",
        profiles: ["kids"],
        coreFrameIds: ["fragmented_self", "what_is_humanity"],
        action: "substitute",
        affectedCoreFrameIds: ["fragmented_self", "what_is_humanity"],
        reason: "Kids output should route identity destabilization into misunderstanding, empathy, and support."
    },
    {
        id: "kids_hopeless_cost_block",
        profiles: ["kids"],
        coreFrameIds: ["entropy_decay", "power_has_a_cost"],
        action: "substitute",
        affectedCoreFrameIds: ["entropy_decay", "power_has_a_cost"],
        reason: "Kids output should route collapse and cost into repair and helping."
    }
]);

function normalizeProfile(profile = "standard") {
    const value = String(profile || "standard").trim().toLowerCase();
    return ["standard", "youth", "kids"].includes(value) ? value : "standard";
}

function sortWeightedEntries(entries = []) {
    return entries
        .map((entry) => ({ id: entry.id, weight: entry.weight }))
        .sort((a, b) => b.weight - a.weight);
}

function getCoreFrameAudiencePolicy(coreFrameId, experienceProfile) {
    const profile = normalizeProfile(experienceProfile);
    if (profile === "standard") {
        return {
            action: "preserve",
            interpretation: "Standard audience handling."
        };
    }

    return CORE_FRAME_AUDIENCE_POLICY[coreFrameId]?.[profile] || {
        action: "suppress",
        interpretation: `No ${profile} audience policy is defined for ${coreFrameId}.`
    };
}

function getMissingCoreFrameAudiencePolicies(coreFrameIds = coreFrames.map((entry) => entry.id)) {
    return coreFrameIds.filter((id) => {
        const policy = CORE_FRAME_AUDIENCE_POLICY[id];
        return !policy || !policy.youth || !policy.kids;
    });
}

function hasCompleteCoreFrameAudiencePolicy(coreFrameIds = coreFrames.map((entry) => entry.id)) {
    return getMissingCoreFrameAudiencePolicies(coreFrameIds).length === 0;
}

function applyCombinationRules(coreFrameCandidates = [], experienceProfile = "standard") {
    const profile = normalizeProfile(experienceProfile);
    const ids = new Set(coreFrameCandidates.map((entry) => entry.id));
    const appliedCombinationRuleIds = [];
    let output = coreFrameCandidates.map((entry) => ({ ...entry }));

    for (const rule of HIGH_RISK_CORE_COMBINATION_RULES) {
        if (!rule.profiles.includes(profile)) continue;

        const matched = rule.coreFrameIds.every((id) => ids.has(id));
        if (!matched) continue;

        appliedCombinationRuleIds.push(rule.id);

        if (rule.action === "downweight") {
            output = output.map((entry) =>
                rule.affectedCoreFrameIds.includes(entry.id)
                    ? {
                        ...entry,
                        weight: entry.weight * rule.weightMultiplier
                    }
                    : entry
            );
        }

        if (rule.action === "suppress") {
            output = output.filter(
                (entry) => !rule.affectedCoreFrameIds.includes(entry.id)
            );
        }
    }

    return {
        candidates: output,
        appliedCombinationRuleIds
    };
}

function applyCoreFrameAudiencePolicyToCandidates(coreFrameCandidates = [], experienceProfile = "standard") {
    const profile = normalizeProfile(experienceProfile);

    if (profile === "standard") {
        return {
            coreFrames: sortWeightedEntries(coreFrameCandidates),
            appliedPolicies: [],
            appliedCombinationRuleIds: []
        };
    }

    const combinationResult = applyCombinationRules(coreFrameCandidates, profile);
    const bucket = new Map();
    const appliedPolicies = [];

    for (const candidate of combinationResult.candidates) {
        const policy = getCoreFrameAudiencePolicy(candidate.id, profile);
        const action = policy.action || "preserve";

        appliedPolicies.push({
            id: candidate.id,
            action,
            interpretation: policy.interpretation || "",
            behavior: policy.behavior || action
        });

        if (action === "suppress") continue;

        if (action === "substitute") {
            const substitutes = policy.substitutes || [];
            for (const entry of substitutes) {
                const current = bucket.get(entry.id) || 0;
                bucket.set(entry.id, current + (entry.weight * candidate.weight));
            }
            continue;
        }

        const multiplier = action === "downweight"
            ? Number(policy.weightMultiplier || 0.5)
            : 1;

        const current = bucket.get(candidate.id) || 0;
        bucket.set(candidate.id, current + (candidate.weight * multiplier));
    }

    return {
        coreFrames: sortWeightedEntries(
            Array.from(bucket.entries()).map(([id, weight]) => ({ id, weight }))
        ),
        appliedPolicies,
        appliedCombinationRuleIds: combinationResult.appliedCombinationRuleIds
    };
}

module.exports = {
    AUDIENCE_POLICY_ACTIONS,
    CORE_FRAME_AUDIENCE_POLICY,
    HIGH_RISK_CORE_COMBINATION_RULES,
    normalizeProfile,
    getCoreFrameAudiencePolicy,
    getMissingCoreFrameAudiencePolicies,
    hasCompleteCoreFrameAudiencePolicy,
    applyCombinationRules,
    applyCoreFrameAudiencePolicyToCandidates
};
