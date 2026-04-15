// src/voice/voiceMap.js

const coreVoiceMap = {
  hidden_truth: {
    premise: [
      "Something important is being concealed.",
      "The truth exists, but it is buried behind fear, silence, or design."
    ],
    burden: [
      "The deeper the group digs, the harder it becomes to remain untouched by what they find."
    ],
    question: [
      "what happens when the truth finally costs more than ignorance"
    ]
  },

  investigators_burden: {
    premise: [
      "Solving the mystery is only part of the problem.",
      "Knowing more means carrying more."
    ],
    burden: [
      "Answers create obligation, not relief."
    ],
    question: [
      "what you do once you know something you cannot ignore"
    ]
  },

  survival_overwhelming_force: {
    premise: [
      "The world does not care whether the group is ready.",
      "The pressure is bigger than anything the characters can simply overpower."
    ],
    burden: [
      "Survival comes from tradeoffs, endurance, and choosing what can still be saved."
    ],
    question: [
      "what you are willing to lose to make it through"
    ]
  },

  endless_siege: {
    premise: [
      "Safety keeps failing faster than it can be rebuilt."
    ],
    burden: [
      "Every defense buys time, but never enough of it."
    ],
    question: [
      "what it costs to keep holding the line"
    ]
  },

  power_within: {
    premise: [
      "Greatness begins as potential before it becomes proof.",
      "The group carries more power than the world first realizes."
    ],
    burden: [
      "Strength has to be shaped before it becomes salvation instead of destruction."
    ],
    question: [
      "what kind of force you become once your power can no longer stay dormant"
    ]
  },

  creation_vs_destruction: {
    premise: [
      "Everything the group builds stands against something eager to break it.",
      "Power can preserve the world or remake it beyond recognition."
    ],
    burden: [
      "Every act of creation risks inviting an equal and opposite ruin."
    ],
    question: [
      "what your strength leaves standing after the dust settles"
    ]
  }
};

const systemVoiceMap = {
  clue_web: {
    gameplay: [
      "Progress comes from assembling fragments that only start to make sense when viewed together.",
      "The group uncovers answers by connecting details that first appear unrelated."
    ],
    pressure: [
      "Each discovery points toward larger patterns instead of simple solutions."
    ]
  },

  hidden_information: {
    gameplay: [
      "People, institutions, and even records withhold what matters most.",
      "What is missing often matters as much as what is found."
    ],
    pressure: [
      "Certainty is hard won because no one reveals the full picture willingly."
    ]
  },

  resource_scarcity: {
    gameplay: [
      "The group cannot answer every problem without sacrifice.",
      "Limited supplies turn even simple decisions into real tradeoffs."
    ],
    pressure: [
      "Need accumulates faster than relief.",
      "There is never quite enough to save everything at once."
    ]
  },

  attrition_combat: {
    gameplay: [
      "Victory is measured by what the group still has left afterward.",
      "Even successful fights leave lasting strain."
    ],
    pressure: [
      "Every confrontation costs something the party may need later."
    ]
  },

  asymmetrical_boss_design: {
    gameplay: [
      "Major enemies demand new approaches rather than routine tactics.",
      "Important confrontations feel like problems to solve, not just walls of hit points."
    ],
    pressure: [
      "The group has to adapt under pressure when brute force is not enough."
    ]
  },

  upgrade_through_risk: {
    gameplay: [
      "Growth comes from taking meaningful risks instead of waiting for safe rewards.",
      "Power is earned by pressing forward when caution would be easier."
    ],
    pressure: [
      "Every step toward greater strength invites greater danger."
    ]
  },

  tactical_positioning_zone_control: {
    gameplay: [
      "Where the group stands matters as much as what the group attempts.",
      "Terrain, spacing, and battlefield control constantly shape the flow of danger."
    ],
    pressure: [
      "Small positional mistakes become expensive quickly."
    ]
  },

  escalation_meter: {
    gameplay: [
      "Trouble compounds when the group cannot regain control quickly.",
      "Once pressure starts rising, events tend to spiral instead of stabilize."
    ],
    pressure: [
      "Delay makes every later problem worse."
    ]
  },

  exploration_discovery_loop: {
    gameplay: [
      "Progress comes through uncovering what the world has hidden or forgotten.",
      "Discovery drives momentum as each answer opens new paths and new dangers."
    ],
    pressure: [
      "The farther the group pushes into the unknown, the more the stakes change."
    ]
  },

  living_world_reaction: {
    gameplay: [
      "The world changes in response to the group's choices.",
      "Actions leave marks that reshape future opportunities, threats, and alliances."
    ],
    pressure: [
      "Nothing stays neutral forever once the group starts moving pieces on the board."
    ]
  },

  influence_social_leverage: {
    gameplay: [
      "Power comes from pressure, relationships, and what people can be persuaded to reveal or protect.",
      "Words, favors, and leverage can matter as much as weapons."
    ],
    pressure: [
      "Every alliance creates a new vulnerability."
    ]
  },

  faction_reputation: {
    gameplay: [
      "Different groups remember what the party has done and respond accordingly.",
      "Standing with one power often closes doors with another."
    ],
    pressure: [
      "Reputation becomes a resource that can be spent, damaged, or weaponized."
    ]
  }
};

const environmentVoiceMap = {
  desert_wasteland: {
    imagery: [
      "dry horizons, failing routes, and settlements hanging on by habit and grit",
      "empty distance, exposed travel, and little mercy once supplies run thin"
    ],
    gameplay: [
      "Travel itself becomes part of the challenge, not just the space between scenes."
    ]
  },

  frontier_wildlands: {
    imagery: [
      "isolated outposts, uncertain roads, and communities too far apart to protect each other well",
      "hard country where help rarely arrives before the damage is done"
    ],
    gameplay: [
      "Distance creates pressure because every choice leaves something else unattended."
    ]
  },

  dense_city_urban: {
    imagery: [
      "crowded streets, closed circles, and too many secrets packed too close together",
      "a city that hides danger behind routine, status, and architecture"
    ],
    gameplay: [
      "Information moves through people, institutions, and rumor before it ever reaches the party cleanly."
    ]
  },

  ruined_civilization: {
    imagery: [
      "broken legacies, failed monuments, and the remains of systems that once promised order",
      "evidence of past greatness now cracked open, abandoned, or repurposed"
    ],
    gameplay: [
      "The past never stays buried; it keeps shaping the present."
    ]
  },

  coastal_oceanic: {
    imagery: [
      "storm-worn shores, ancient crossings, and power tied to tides, distance, and weather",
      "a horizon that promises discovery while hiding what waits beyond it"
    ],
    gameplay: [
      "Movement across the world feels expansive, dangerous, and full of old significance."
    ]
  }
};

const toneVoiceMap = {
  grimdark: {
    adjectives: ["fraying", "harsh", "failing", "compromised", "costly"],
    verbs: ["endure", "cling", "deteriorate", "withstand"],
    cadence: "heavy"
  },

  horror: {
    adjectives: ["unsettling", "distorted", "unnerving", "forbidden", "unwelcome"],
    verbs: ["uncover", "disturb", "linger", "haunt"],
    cadence: "slow_burn"
  },

  mythic: {
    adjectives: ["ancient", "consequential", "sacred", "world-shaping", "legendary"],
    verbs: ["rise", "awaken", "claim", "transform"],
    cadence: "elevated"
  },

  heroic: {
    adjectives: ["bold", "rising", "defiant", "hard-won", "luminous"],
    verbs: ["stand", "protect", "answer", "overcome"],
    cadence: "driving"
  },

  psychological: {
    adjectives: ["fractured", "personal", "uncertain", "internal", "destabilizing"],
    verbs: ["doubt", "unravel", "interpret", "withstand"],
    cadence: "intimate"
  }
};

const genreVoiceMap = {
  western_frontier: {
    framing: [
      "survival on the edge of order",
      "hard choices in places too remote to save cleanly"
    ],
    motifs: ["outposts", "roads", "scarcity", "distance"]
  },

  victorian_gothic: {
    framing: [
      "mystery shaped by old power, social pressure, and buried wrongdoing",
      "investigation in a world obsessed with appearances and secrecy"
    ],
    motifs: ["archives", "societies", "estates", "reputation"]
  },

  heroic_fantasy: {
    framing: [
      "rising power set against dangers large enough to reshape the world",
      "adventure where personal strength and world-scale consequence grow together"
    ],
    motifs: ["relics", "prophecy", "ruins", "setpieces"]
  }
};

function getVoiceEntry(map, key) {
  if (!key) return null;
  return map[key] || null;
}

function collectVoiceLines(map, keys, field) {
  if (!Array.isArray(keys)) return [];
  return keys
    .map((key) => map[key]?.[field] || [])
    .flat()
    .filter(Boolean);
}

function pickOne(arr, fallback = "") {
  if (!Array.isArray(arr) || arr.length === 0) return fallback;
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  coreVoiceMap,
  systemVoiceMap,
  environmentVoiceMap,
  toneVoiceMap,
  genreVoiceMap,
  getVoiceEntry,
  collectVoiceLines,
  pickOne
};