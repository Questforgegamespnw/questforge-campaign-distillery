const STANDARD_PROFILE = "standard";
const YOUTH_PROFILE = "youth";
const KIDS_PROFILE = "kids";

function normalizeProfile(value = STANDARD_PROFILE) {
    const profile = String(value || STANDARD_PROFILE).trim().toLowerCase();
    return [STANDARD_PROFILE, YOUTH_PROFILE, KIDS_PROFILE].includes(profile)
        ? profile
        : STANDARD_PROFILE;
}

function cleanVoiceText(text = "") {
    return String(text || "")
        .replace(/\s+/g, " ")
        .replace(/\s+([.,!?;:])/g, "$1")
        .replace(/\.\s+\./g, ".")
        .trim();
}

const TEEN_VOICE_RULES = Object.freeze([
    {
        id: "no_clean_options_to_no_easy_options",
        pattern: /\bno clean options?\b/gi,
        replacement: "no easy options"
    },
    {
        id: "no_clean_route_to_no_simple_route",
        pattern: /\bno clean route through it\b/gi,
        replacement: "no simple route through it"
    },
    {
        id: "strip_last_clean_option_to_harder_choices",
        pattern: /\bstrip away the last clean option\b/gi,
        replacement: "make every choice harder"
    },
    {
        id: "hopeless_to_difficult",
        pattern: /\bhopeless\b/gi,
        replacement: "difficult"
    },
    {
        id: "despair_to_pressure",
        pattern: /\bdespair\b/gi,
        replacement: "pressure"
    },
    {
        id: "doomed_to_in_real_danger",
        pattern: /\bdoomed\b/gi,
        replacement: "in real danger"
    },
    {
        id: "crushing_to_difficult",
        pattern: /\bcrushing\b/gi,
        replacement: "difficult"
    },
    {
        id: "world_in_decline_to_under_strain",
        pattern: /\bworld (?:is )?already in decline\b/gi,
        replacement: "world is already under strain"
    },
    {
        id: "everything_falling_apart_to_under_strain",
        pattern: /\beverything is falling apart\b/gi,
        replacement: "everything is under real strain"
    },
    {
        id: "coming_apart_to_under_strain",
        pattern: /\bcoming apart\b/gi,
        replacement: "under real strain"
    },
    {
        id: "collapse_to_breaking_point",
        pattern: /\bcollapse\b/gi,
        replacement: "breaking point"
    },
    {
        id: "damage_left_behind_to_challenges_left_behind",
        pattern: /\bevery gain leaves damage behind\b/gi,
        replacement: "every gain leaves new challenges behind"
    },
    {
        id: "cannot_be_saved_to_cannot_all_be_protected",
        pattern: /\bcannot be saved\b/gi,
        replacement: "cannot all be protected at once"
    },
    {
        id: "cannot_save_everything_to_cannot_protect_everything_at_once",
        pattern: /\bcannot save everything\b/gi,
        replacement: "cannot protect everything at once"
    },
    {
        id: "identity_unstable_to_identity_uncertain",
        pattern: /\bidentity becomes unstable\b/gi,
        replacement: "identity becomes uncertain"
    },
    {
        id: "personhood_unstable_to_selfhood_uncertain",
        pattern: /\bpersonhood itself becomes unstable\b/gi,
        replacement: "what makes someone who they are becomes uncertain"
    },
    {
        id: "survival_never_clean_to_survival_requires_hard_choices",
        pattern: /\bsurvival is never clean\b/gi,
        replacement: "survival requires hard choices"
    },
    {
        id: "victory_indistinguishable_from_loss",
        pattern: /\bvictory that may be indistinguishable from another kind of loss\b/gi,
        replacement: "victory that may change what it costs to keep going"
    }
]);

const KIDS_VOICE_RULES = Object.freeze([
    {
        id: "dangerous_to_challenging",
        pattern: /\bdangerous\b/gi,
        replacement: "challenging"
    },
    {
        id: "danger_to_challenge",
        pattern: /\bdanger\b/gi,
        replacement: "challenge"
    },
    {
        id: "costly_to_important",
        pattern: /\bcostly\b/gi,
        replacement: "important"
    },
    {
        id: "sacrifice_to_hard_choice",
        pattern: /\bsacrifice\b/gi,
        replacement: "hard choice"
    },
    {
        id: "scars_to_lessons",
        pattern: /\bscars\b/gi,
        replacement: "lessons"
    },
    {
        id: "loss_to_setback",
        pattern: /\bloss\b/gi,
        replacement: "setback"
    },
    {
        id: "damage_to_trouble",
        pattern: /\bdamage\b/gi,
        replacement: "trouble"
    },
    {
        id: "monster_to_creature",
        pattern: /\bmonster\b/gi,
        replacement: "creature"
    },
    {
        id: "survival_to_making_it_through",
        pattern: /\bsurvival\b/gi,
        replacement: "making it through"
    },
    {
        id: "truth_costs_to_truth_changes_choices",
        pattern: /\bthe truth costs more than ignorance\b/gi,
        replacement: "learning the truth changes what the group can do next"
    },
    {
        id: "burden_to_challenge",
        pattern: /\bburden\b/gi,
        replacement: "challenge"
    },
    {
        id: "bleak_to_mysterious",
        pattern: /\bbleak\b/gi,
        replacement: "mysterious"
    }
]);

function applyVoiceRules(text = "", rules = []) {
    const input = String(text || "");
    const appliedRuleIds = [];

    const normalized = rules.reduce((output, rule) => {
        const next = output.replace(rule.pattern, rule.replacement);
        if (next !== output) {
            appliedRuleIds.push(rule.id);
        }
        return next;
    }, input);

    return {
        text: cleanVoiceText(normalized),
        appliedRuleIds
    };
}

function applyTeenVoice(text = "") {
    return applyVoiceRules(text, TEEN_VOICE_RULES).text;
}

function applyKidsVoice(text = "") {
    const teenAdjusted = applyVoiceRules(text, TEEN_VOICE_RULES).text;
    return applyVoiceRules(teenAdjusted, KIDS_VOICE_RULES).text;
}

function applyYouthVoiceLayerWithMetadata(text = "", options = {}) {
    const profile = normalizeProfile(options.experienceProfile);

    if (profile === STANDARD_PROFILE) {
        return {
            text: cleanVoiceText(text),
            experienceProfile: profile,
            appliedRuleIds: []
        };
    }

    const teenResult = applyVoiceRules(text, TEEN_VOICE_RULES);

    if (profile === YOUTH_PROFILE) {
        return {
            text: teenResult.text,
            experienceProfile: profile,
            appliedRuleIds: teenResult.appliedRuleIds
        };
    }

    const kidsResult = applyVoiceRules(teenResult.text, KIDS_VOICE_RULES);

    return {
        text: kidsResult.text,
        experienceProfile: profile,
        appliedRuleIds: [
            ...teenResult.appliedRuleIds,
            ...kidsResult.appliedRuleIds
        ]
    };
}

function applyYouthVoiceLayer(text = "", options = {}) {
    return applyYouthVoiceLayerWithMetadata(text, options).text;
}

module.exports = {
    STANDARD_PROFILE,
    YOUTH_PROFILE,
    KIDS_PROFILE,
    TEEN_VOICE_RULES,
    KIDS_VOICE_RULES,
    normalizeProfile,
    applyVoiceRules,
    applyTeenVoice,
    applyKidsVoice,
    applyYouthVoiceLayer,
    applyYouthVoiceLayerWithMetadata
};
