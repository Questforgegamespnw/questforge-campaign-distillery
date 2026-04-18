module.exports = [
  {
    id: "grimdark",
    name: "Grimdark",
    description: "There are no clean choices, only costly ones, and survival itself may leave scars.",
    tags: ["bleak", "brutal", "high_stakes", "moral_cost"],
    profile: { intensity: 5, darkness: 5, optimism: 1, weirdness: 1 },
    constraints: {
      violenceLevel: "high",
      fearLevel: "high",
      humorAllowed: false,
      languageStyle: "serious"
    },
    contentRules: {
      allowHorror: true,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "sharp",
      descriptiveness: "high",
      pacing: "tight"
    }
  },

  {
    id: "heroic",
    name: "Heroic",
    description: "The players can make a meaningful difference, even when the odds are terrible.",
    tags: ["hope", "triumph", "courage", "resolve"],
    profile: { intensity: 4, darkness: 2, optimism: 5, weirdness: 1 },
    constraints: {
      violenceLevel: "moderate",
      fearLevel: "low",
      humorAllowed: true,
      languageStyle: "elevated"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "clean",
      descriptiveness: "medium",
      pacing: "brisk"
    }
  },

  {
    id: "psychological",
    name: "Psychological",
    description: "Internal strain, unstable perception, and emotional pressure matter as much as external danger.",
    tags: ["mind", "tension", "internal_struggle", "instability"],
    profile: { intensity: 4, darkness: 4, optimism: 2, weirdness: 3 },
    constraints: {
      violenceLevel: "low",
      fearLevel: "high",
      humorAllowed: false,
      languageStyle: "serious"
    },
    contentRules: {
      allowHorror: true,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "layered",
      descriptiveness: "high",
      pacing: "measured"
    }
  },

  {
    id: "noir",
    name: "Noir",
    description: "Truth is hidden, trust is fragile, and every answer drags moral compromise behind it.",
    tags: ["mystery", "morality", "fragile_trust", "corruption"],
    profile: { intensity: 3, darkness: 4, optimism: 2, weirdness: 1 },
    constraints: {
      violenceLevel: "moderate",
      fearLevel: "medium",
      humorAllowed: false,
      languageStyle: "dry"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "lean",
      descriptiveness: "medium",
      pacing: "steady"
    }
  },

  {
    id: "horror",
    name: "Horror",
    description: "Fear, vulnerability, and the unknown define the experience, keeping certainty always out of reach.",
    tags: ["fear", "survival", "unknown", "dread"],
    profile: { intensity: 5, darkness: 5, optimism: 1, weirdness: 4 },
    constraints: {
      violenceLevel: "moderate",
      fearLevel: "high",
      humorAllowed: false,
      languageStyle: "serious"
    },
    contentRules: {
      allowHorror: true,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "tight",
      descriptiveness: "high",
      pacing: "tense"
    }
  },

  {
    id: "mythic",
    name: "Mythic",
    description: "Events feel symbolic, larger-than-life, and tied to forces greater than any one person.",
    tags: ["legend", "epic", "symbolic", "larger_than_life"],
    profile: { intensity: 4, darkness: 2, optimism: 4, weirdness: 2 },
    constraints: {
      violenceLevel: "moderate",
      fearLevel: "low",
      humorAllowed: false,
      languageStyle: "elevated"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "flowing",
      descriptiveness: "high",
      pacing: "measured"
    }
  },

  {
    id: "political_intrigue",
    name: "Political / Intrigue",
    description: "Power moves through influence, manipulation, alliances, and carefully concealed intent.",
    tags: ["scheming", "alliances", "manipulation", "power"],
    profile: { intensity: 3, darkness: 3, optimism: 2, weirdness: 1 },
    constraints: {
      violenceLevel: "low",
      fearLevel: "low",
      humorAllowed: false,
      languageStyle: "controlled"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: true,
      allowDeathThemes: false,
      allowGore: false
    },
    voice: {
      sentenceStyle: "precise",
      descriptiveness: "medium",
      pacing: "steady"
    }
  },

  {
    id: "lighthearted_chaotic",
    name: "Lighthearted / Chaotic",
    description: "Fun, unpredictability, and energetic momentum matter more than heavy emotional burden.",
    tags: ["comedy", "chaos", "fun_first", "unpredictable"],
    profile: { intensity: 3, darkness: 1, optimism: 5, weirdness: 3 },
    constraints: {
      violenceLevel: "low",
      fearLevel: "low",
      humorAllowed: true,
      languageStyle: "playful"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: false,
      allowDeathThemes: false,
      allowGore: false
    },
    voice: {
      sentenceStyle: "bouncy",
      descriptiveness: "medium",
      pacing: "fast"
    }
  },

  {
    id: "melancholic",
    name: "Melancholic",
    description: "A quiet sadness runs through everything, where loss and reflection shape the experience.",
    tags: ["sadness", "reflection", "loss", "quiet"],
    profile: { intensity: 2, darkness: 3, optimism: 2, weirdness: 1 },
    constraints: {
      violenceLevel: "low",
      fearLevel: "low",
      humorAllowed: false,
      languageStyle: "soft"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "gentle",
      descriptiveness: "medium",
      pacing: "slow"
    }
  },

  {
    id: "tense",
    name: "Tense",
    description: "Pressure is constant, and even small decisions feel like they could go wrong.",
    tags: ["pressure", "stress", "uncertainty", "tight"],
    profile: { intensity: 4, darkness: 3, optimism: 2, weirdness: 1 },
    constraints: {
      violenceLevel: "moderate",
      fearLevel: "medium",
      humorAllowed: false,
      languageStyle: "controlled"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: true,
      allowDeathThemes: false,
      allowGore: false
    },
    voice: {
      sentenceStyle: "tight",
      descriptiveness: "medium",
      pacing: "fast"
    }
  },

  {
    id: "hopeful",
    name: "Hopeful",
    description: "Even in darkness, there is a sense that things can improve.",
    tags: ["hope", "light", "resilience", "optimism"],
    profile: { intensity: 2, darkness: 1, optimism: 5, weirdness: 1 },
    constraints: {
      violenceLevel: "low",
      fearLevel: "low",
      humorAllowed: true,
      languageStyle: "clean"
    },
    contentRules: {
      allowHorror: false,
      allowPsychological: true,
      allowDeathThemes: true,
      allowGore: false
    },
    voice: {
      sentenceStyle: "clear",
      descriptiveness: "medium",
      pacing: "steady"
    }
  }
];