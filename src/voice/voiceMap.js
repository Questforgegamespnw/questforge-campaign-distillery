// src/voice/voiceMap.js

const coreVoiceMap = {
  hidden_truth: {
    premise: [
      "Something important is being concealed.",
      "Answers are scattered across people and places, but the clues do not line up cleanly.",
      "The truth exists, but it is buried behind fear, silence, or deliberate design.",
      "Important pieces are easy to find, but hard to understand until the group sees how they fit.",
      "No one seems to be lying outright, but no one is telling the whole story either.",
      "The truth has not disappeared, it has been kept out of reach.",
      "What looks settled from the outside starts coming apart the moment the group looks closely.",
      "The world is holding something back, and the pressure starts to build as soon as the group notices the gaps.",
      "What matters most has been hidden in plain sight.",
      "The mystery is not whether something is wrong. It is how long that wrongness has been allowed to stand."
    ],
    burden: [
      "The deeper the group digs, the harder it becomes to remain untouched by what they find.",
      "Every answer pulls the group further away from easy explanations.",
      "Learning more does not simplify the situation; it exposes how much has been built on missing or distorted truth.",
      "The truth has consequences, especially for the people who were safer not asking.",
      "Each discovery changes the shape of the problem instead of resolving it cleanly.",
      "Once the group starts connecting the pieces, ignoring them stops being a real option."
    ],
    question: [
      "what happens when the truth finally costs more than ignorance",
      "what the group does once the hidden pattern becomes impossible to dismiss",
      "who benefits from the story staying incomplete",
      "how much can be uncovered before the search itself starts changing the people involved",
      "what it means to keep pushing once the answers stop feeling safe",
      "what remains standing after the truth changes the way the group sees the world"
    ]
  },

  investigators_burden: {
    premise: [
      "Solving the mystery is only part of the problem.",
      "Knowing more means carrying more.",
      "The truth does not arrive as relief; it arrives as responsibility.",
      "Understanding what is happening creates pressure as much as clarity.",
      "Every answer brings the group closer to a point where ignorance is no longer possible.",
      "The deeper the group gets, the less possible it becomes to stay detached from what they uncover.",
      "Discovery does not stay abstract for long; sooner or later, it demands a response."
    ],
    burden: [
      "Answers create obligation, not relief.",
      "The truth has weight, especially once the group understands what it requires of them.",
      "Learning more means inheriting problems that were easier to ignore from a distance.",
      "Each revelation shifts the burden from curiosity to responsibility.",
      "The hardest part is not uncovering the truth, but living with what it now demands.",
      "What is learned cannot be cleanly set aside once it changes the shape of the world."
    ],
    question: [
      "what you do once you know something you cannot ignore",
      "how much responsibility comes with finally understanding the truth",
      "what the group owes to the people affected by what they uncover",
      "whether knowledge is worth the burden it places on the people who carry it",
      "what has to change once the truth becomes impossible to dismiss",
      "how far the group is willing to go once discovery turns into obligation"
    ]
  },

  survival_against_overwhelming_force: {
    premise: [
      "The world does not care whether the group is ready.",
      "The pressure is bigger than anything the characters can simply overpower.",
      "The danger here is not a single enemy, but a scale of threat that keeps closing in.",
      "Survival depends less on dominance and more on endurance, compromise, and timing.",
      "The group is forced into a struggle where winning cleanly is rarely an option.",
      "What stands against the characters is larger, harsher, and more persistent than anything they can solve in one stroke.",
      "The world keeps applying pressure long after a normal victory would have ended the problem."
    ],
    burden: [
      "Survival comes from tradeoffs, endurance, and choosing what can still be saved.",
      "Every decision costs something, because there is never enough time, safety, or strength to protect everything at once.",
      "The group is measured by what they can preserve under pressure, not by whether they avoid loss entirely.",
      "Hard choices define survival here, especially when every path leaves something exposed.",
      "Endurance matters as much as courage, because the crisis does not stop after one good stand.",
      "The challenge is not just beating the odds once, but continuing to function while the pressure keeps building."
    ],
    question: [
      "what you are willing to lose to make it through",
      "what the group chooses to protect when everything cannot be saved",
      "how much can be endured before survival starts changing who the characters are",
      "what remains worth fighting for when the pressure never fully lets up",
      "how the group decides what sacrifice is acceptable under impossible conditions",
      "what it means to survive when survival is never clean"
    ]
  },

  endless_siege: {
    premise: [
      "Safety keeps failing faster than it can be rebuilt.",
      "Every reprieve is temporary, because the pressure returns before anyone can fully recover.",
      "The crisis is not a single event but an ongoing grind that keeps eroding whatever stability remains.",
      "The group is trapped in a struggle where defense, recovery, and resistance all happen at once.",
      "Even moments of calm feel provisional, because the next wave is never far behind.",
      "The world does not offer lasting security here; it offers breathing room, then takes it back.",
      "What should have been a temporary emergency becomes the new shape of daily life."
    ],
    burden: [
      "Every defense buys time, but never enough of it.",
      "Holding the line means accepting that relief is partial, temporary, and always under threat.",
      "The group has to keep functioning while pressure, exhaustion, and attrition slowly accumulate.",
      "Success is measured in delays, survival, and narrow reprieves rather than decisive peace.",
      "The longer the siege continues, the harder it becomes to tell whether the group is enduring or only postponing collapse.",
      "What wears people down is not only danger, but the realization that the danger keeps coming back."
    ],
    question: [
      "what it costs to keep holding the line",
      "how long the group can endure before defense turns into desperation",
      "what is worth protecting when every victory only buys a little more time",
      "how much can be sacrificed to preserve something that may still fall",
      "what happens when survival depends on resisting one more wave, and then another",
      "whether endurance alone is enough when the pressure never fully breaks"
    ]
  },

  power_comes_from_within: {
    premise: [
      "Greatness begins as potential before it becomes proof.",
      "The group carries more power than the world first realizes.",
      "What matters most is not only what the characters face, but what they are becoming in response.",
      "The source of strength is internal, waiting to be awakened, shaped, or understood.",
      "The group is not searching only for external answers; they are discovering what they themselves are capable of.",
      "Power begins as possibility here, and the story grows around whether that possibility can be realized well.",
      "The characters carry the seeds of transformation long before the world fully recognizes it."
    ],
    burden: [
      "Strength has to be shaped before it becomes salvation instead of destruction.",
      "Growth creates pressure, because becoming more powerful also raises the stakes of every choice.",
      "The challenge is not merely gaining strength, but learning what kind of force that strength will become.",
      "Potential is not automatically heroic; it has to be disciplined, directed, and tested.",
      "Power invites consequence, especially once the world starts reacting to what the group might become.",
      "The more clearly the characters grow into their strength, the less room they have to remain unchanged by it."
    ],
    question: [
      "what kind of force you become once your power can no longer stay dormant",
      "how the group chooses to shape the strength growing inside them",
      "whether inner power becomes a gift, a burden, or both",
      "what awakening real strength demands from the people who carry it",
      "how much growth changes the characters before it changes the world",
      "what responsibility comes with becoming capable of more than before"
    ]
  },

  creation_vs_destruction: {
    premise: [
      "Everything the group builds stands against something eager to break it.",
      "Power can preserve the world or remake it beyond recognition.",
      "The central struggle is not only whether change happens, but what kind of change survives afterward.",
      "Acts of renewal and acts of ruin are bound tightly together here.",
      "The story turns on whether the group's strength protects what matters or tears something vital apart in the process.",
      "Every attempt to build something better happens under the shadow of what could be broken instead.",
      "What is made, restored, or defended always exists in tension with forces that would unmake it."
    ],
    burden: [
      "Every act of creation risks inviting an equal and opposite ruin.",
      "Building something lasting means deciding what must be preserved, changed, or abandoned.",
      "The group cannot reshape the world without also accepting what that reshaping may destroy.",
      "Renewal comes with cost, especially when old structures do not disappear quietly.",
      "The more ambitious the group becomes, the greater the risk that improvement and devastation start to overlap.",
      "The challenge is not only whether the world can be changed, but whether the result will be worth what was broken to get there."
    ],
    question: [
      "what your strength leaves standing after the dust settles",
      "what the group is willing to break in order to build something better",
      "whether renewal can happen without unacceptable loss",
      "what deserves to be preserved when change becomes unavoidable",
      "how much destruction can be justified in the name of creation",
      "what kind of world remains once the group has the power to reshape it"
    ]
  },

  fragmented_self: {
    premise: [
      "The self is not whole, and understanding who someone is becomes part of the larger mystery.",
      "Something about identity has been broken, altered, or split in a way that cannot be ignored.",
      "The people the group meets are not always who they seem, including themselves.",
      "Memory, identity, and truth do not line up cleanly, forcing the group to question what defines a person.",
      "What someone believes about themselves may not match what is actually true.",
      "Identity feels unstable, shaped as much by hidden truths as by lived experience.",
      "The line between who someone is and who they were starts to blur under pressure."
    ],

    burden: [
      "Understanding the truth means confronting parts of identity that are incomplete or uncomfortable.",
      "The deeper the group digs, the more they have to reconcile conflicting versions of people and events.",
      "Discovery is not just external; it forces characters to reconsider who they are and how they got there.",
      "What is uncovered may change how the group sees themselves as much as how they see the world.",
      "Reconstructing the truth often means rebuilding identity from pieces that do not fully agree.",
      "The challenge is not just learning the truth, but deciding which version of it to accept."
    ],

    question: [
      "what defines a person when memory, truth, and experience do not fully align",
      "how much of identity is chosen and how much is discovered",
      "what remains of someone once the full truth comes to light",
      "whether identity is something fixed or something that can be rebuilt",
      "who someone becomes once they understand what they have been missing",
      "what it means to move forward after discovering who you really are"
    ]
  },

  lost_knowledge: {
    premise: [
      "The answers exist, but they are buried, forgotten, sealed away, or deliberately erased.",
      "Something important has been lost, hidden, or left behind badly enough that the present is still shaped by its absence.",
      "What the group needs to understand is not gone, just buried under time, damage, or deliberate neglect.",
      "The past left something behind that still matters, even if no one has the full shape of it anymore.",
      "Knowledge survives in fragments, ruins, records, and half-remembered stories that no longer line up cleanly.",
      "The world still carries the remains of older answers, but reaching them means working through what time and silence have broken apart.",
      "What was once understood has slipped out of reach, and the group has to decide how much of it can be pieced back together."
    ],
    burden: [
      "Recovering what was lost is rarely simple, because the pieces that remain are incomplete, damaged, or in the wrong hands.",
      "Each discovery helps, but it also makes clear how much has already been forgotten or distorted.",
      "The deeper the group reaches into the past, the more they have to sort truth from ruin, memory, and myth.",
      "What has been lost often stayed buried for a reason, and bringing it back changes more than just what the group knows.",
      "Old answers rarely return intact; they come back partial, contested, and loaded with consequences.",
      "The challenge is not just finding the missing pieces, but deciding what they are worth once they are found."
    ],
    question: [
      "what can still be recovered from what history left behind",
      "how much of the truth can be rebuilt from what remains",
      "what it costs to bring lost answers back into the present",
      "whether something forgotten should always be uncovered",
      "who is changed most by recovering what was meant to stay buried",
      "what remains possible once the past starts speaking again"
    ]
  },

  fate_vs_free_will: {
    premise: [
      "The central question is whether the characters are shaping their own path or fulfilling one already written.",
      "The group keeps running into signs that events may be moving toward something larger than individual choice.",
      "What looks like freedom starts to blur with pattern, prophecy, expectation, or design.",
      "The characters are not just deciding what to do next; they are testing how much of their future is actually theirs to decide.",
      "Choice still matters, but the world keeps suggesting that some outcomes may have been waiting for them all along.",
      "The deeper the group moves into the story, the harder it becomes to tell the difference between destiny and momentum."
    ],
    burden: [
      "Every major decision raises the question of whether the group is changing the future or stepping into one that was already prepared.",
      "The more clearly the pattern emerges, the harder it becomes to know whether defiance is freedom or just another part of the design.",
      "Choice carries weight here, especially when the world keeps offering signs that some paths were anticipated long before the group arrived.",
      "The tension is not just in what the group chooses, but in whether those choices open new paths or confirm older ones.",
      "Trying to resist a larger design can be as defining as accepting it."
    ],
    question: [
      "how much of the future belongs to the people living it",
      "whether a chosen path matters less if it was always possible to foresee",
      "what freedom looks like in a world full of patterns, prophecies, and expectations",
      "whether resisting destiny changes it or merely fulfills it differently",
      "what the group becomes when they stop asking what is expected of them and decide for themselves"
    ]
  },

  the_world_is_alive: {
    premise: [
      "The environment is not passive, and the world reacts, adapts, and resists the characters' presence.",
      "The world behaves less like a backdrop and more like an active participant in what unfolds.",
      "Places here have momentum, response, and pressure of their own.",
      "The group is moving through a world that notices what they do and changes around it.",
      "The setting is alive in more than a visual sense; it answers, shifts, and pushes back.",
      "The world does not simply contain the story; it helps shape it in real time.",
      "Every place the group enters feels active, responsive, and capable of changing the terms of the conflict."
    ],
    burden: [
      "The group cannot treat the environment as neutral, because it keeps affecting what is possible.",
      "Progress depends on reading and adapting to a world that will not stay still for long.",
      "The setting itself creates pressure, changing opportunities and dangers as the story moves forward.",
      "What worked once may stop working as the world shifts in response to the group's choices.",
      "The challenge is not just surviving enemies, but navigating a setting that keeps asserting itself.",
      "The more the group moves through the world, the clearer it becomes that the world is moving back."
    ],
    question: [
      "how the group survives in a world that refuses to stay passive",
      "what it means to act inside a setting that responds to every move",
      "how much control the characters really have when the world itself keeps changing",
      "what can be learned from a world that pushes back instead of standing still",
      "whether the group can work with the world as easily as they can struggle against it",
      "what happens when the setting becomes part of the conflict instead of just its location"
    ]
  },

  cycle_recurrence: {
  premise: [
    "This has all happened before, and the world is shaped by loops, returns, and repeating history.",
    "The story keeps circling patterns that feel older than the current moment.",
    "What the group faces is not entirely new, only newly arrived again.",
    "The world carries signs of repetition, as though old outcomes are finding new ways to return.",
    "Events seem to move in cycles, forcing the group to question what can actually be changed.",
    "The past does not stay in the past here; it keeps reasserting itself through repetition.",
    "What is happening now feels connected to older turns of the same wheel."
  ],
  burden: [
    "The group has to decide whether they are breaking a pattern or only stepping into its next repetition.",
    "Every discovery raises the possibility that the current crisis is only the latest version of something much older.",
    "Patterns create pressure because they suggest some outcomes may be easier to repeat than to escape.",
    "The challenge is not just understanding the cycle, but figuring out what could interrupt it.",
    "Repetition turns history into a warning, especially when the world keeps drifting toward familiar failures.",
    "The more clearly the pattern emerges, the harder it becomes to know whether change is truly possible."
  ],
  question: [
    "whether the group can break a pattern the world keeps returning to",
    "what it takes to interrupt a cycle that has outlived generations",
    "how much freedom exists inside a story shaped by repetition",
    "what the current moment can become if history is not allowed to repeat itself again",
    "whether understanding the cycle is enough to escape it",
    "what changes when the group stops repeating the old answer and chooses differently"
  ]
},

war_of_ideologies: {
  premise: [
    "The real struggle is not just between sides, but between competing beliefs about how the world should work.",
    "Conflict here grows out of incompatible convictions as much as clashing interests.",
    "The group is caught in a struggle where ideas shape the battlefield as much as armies or institutions do.",
    "Every faction believes it has a vision worth imposing, defending, or preserving.",
    "The conflict is driven by worldviews that cannot easily coexist once pressure rises.",
    "What is being contested is not only power, but the principles that justify how power should be used.",
    "The deeper the group gets, the clearer it becomes that this is a battle over meaning as much as control."
  ],
  burden: [
    "Choosing a side means inheriting the costs, blind spots, and consequences of that side's beliefs.",
    "No position stays abstract once people begin suffering under the systems built from it.",
    "The group cannot stay above the conflict forever, because belief always becomes action sooner or later.",
    "Every alliance asks the group to decide which compromises they can live with.",
    "The challenge is not merely deciding who is strongest, but which vision deserves to endure.",
    "The more clearly the ideologies come into focus, the harder it becomes to imagine a clean or neutral path through them."
  ],
  question: [
    "which vision of the future the group is willing to strengthen",
    "what compromises become acceptable when beliefs start shaping real harm",
    "whether a side can be chosen without becoming part of what makes it dangerous",
    "what the group owes to people trapped inside a conflict of competing ideals",
    "how much principle survives once power enters the equation",
    "what kind of world is left after one vision wins"
  ]
},

  power_vacuum: {
    premise: [
      "Something that once held the world together is gone, and competing forces are rising to fill the gap.",
      "The collapse of old authority leaves room for new claimants, new instability, and new danger.",
      "What follows the absence of power is not peace, but contest.",
      "The world is reorganizing itself around a space that no one can afford to leave empty.",
      "The group steps into a moment where weakened structures invite ambition from every direction.",
      "What used to restrain conflict has broken down, and everyone can feel the opening it created.",
      "The absence of a clear center turns every major decision into part of a larger struggle over who takes control next."
    ],
    burden: [
      "Every move the group makes helps someone gain ground in the scramble to define what comes next.",
      "Instability spreads because no one agrees on who should hold power, or how it should be used.",
      "The group cannot act in a vacuum, because every intervention strengthens one possibility over another.",
      "What appears to be opportunity is also danger, especially when ambitious forces are moving faster than stable ones.",
      "The challenge is not only surviving the instability, but deciding what should fill the empty space afterward.",
      "The longer the vacuum remains open, the more destructive the contest around it becomes."
    ],
    question: [
      "who should shape what comes after the old order fails",
      "what the group is willing to support in a world reorganizing around absence",
      "how much instability is acceptable while something new takes form",
      "whether power can be transferred without simply creating a new version of the same problem",
      "what kind of authority deserves to replace what was lost",
      "what happens if the wrong force reaches the center first"
    ]
  },

  something_is_wrong: {
  premise: [
    "Reality feels off, patterns break down, and the world carries signs that something fundamental is distorted.",
    "The group keeps encountering details that should fit together cleanly, but do not.",
    "The wrongness is not always obvious at first, but it keeps showing through in ways that cannot be fully dismissed.",
    "What is unsettling here is not only danger, but the sense that the world itself is out of alignment.",
    "The deeper the group looks, the more ordinary things start to feel subtly but unmistakably incorrect.",
    "The setting keeps producing moments that feel misaligned, unstable, or harder to explain than they should be.",
    "The problem begins as unease, but gradually reveals itself as something larger and more systemic."
  ],
  burden: [
    "The group has to function in a world where certainty keeps eroding around them.",
    "Wrongness creates pressure because it makes even familiar situations harder to trust or interpret.",
    "The challenge is not just finding danger, but recognizing what the danger has already changed.",
    "Each new sign of distortion raises the question of how deep the damage actually goes.",
    "The more the group investigates, the harder it becomes to separate anomaly from reality.",
    "What makes the situation dangerous is not only what is wrong, but how long that wrongness may have been spreading."
  ],
  question: [
    "how far the wrongness extends beneath the surface of the world",
    "what caused the world to slip out of alignment in the first place",
    "how much can still be trusted once the pattern of wrongness becomes clear",
    "what the group does when unease turns into undeniable evidence",
    "whether the damage can be understood before it becomes irreversible",
    "what it will take to make the world feel coherent again"
  ]
},

power_has_a_cost: {
  premise: [
    "Every gain extracts something in return, forcing sacrifice, corruption, or loss.",
    "Strength is available here, but never without consequence.",
    "The world offers power on terms that become harder to ignore the longer the group accepts them.",
    "What makes power dangerous is not only what it can do, but what it asks from the people who use it.",
    "Every advantage carries a price that eventually demands to be paid.",
    "Power creates pressure because each use risks changing the people who rely on it.",
    "The group is forced to confront a version of strength that solves problems while creating new ones."
  ],
  burden: [
    "The more power the group reaches for, the harder it becomes to avoid what that power is taking in return.",
    "Strength stops feeling simple once its costs begin shaping identity, relationships, or the world around it.",
    "The challenge is not only whether power can be gained, but whether its price can be endured.",
    "Every shortcut to strength leaves traces that accumulate over time.",
    "What begins as useful compromise can become a pattern of damage if the group keeps accepting the exchange.",
    "The real danger is not only the cost itself, but how easy it becomes to justify paying it again."
  ],
  question: [
    "what price the group is willing to pay for strength",
    "how much power is worth sacrificing before it changes who the characters are",
    "whether the cost of victory can remain acceptable once it starts compounding",
    "what line should never be crossed in pursuit of greater strength",
    "how the group decides when power has become too expensive to keep using",
    "what remains once the price of strength has finally been paid in full"
  ]
},

becoming_something_else: {
  premise: [
    "The characters are changing, whether they want to or not, and power or circumstance is reshaping who they are.",
    "Transformation is not a possibility here; it is already underway.",
    "The group is dealing with pressures that alter identity, body, role, or purpose over time.",
    "What begins as growth or adaptation gradually raises the question of whether the characters are remaining themselves.",
    "Change is built into the story here, but not all change is welcome or reversible.",
    "The deeper the group goes, the harder it becomes to tell where survival, evolution, and loss stop being separate things.",
    "The story keeps pushing the characters toward forms of change that may be useful, dangerous, or both."
  ],
  burden: [
    "Transformation creates pressure because each change solves one problem while creating another.",
    "The challenge is not only surviving what is happening, but deciding what kind of person remains afterward.",
    "Every step deeper into change forces the group to ask what they are becoming in the process.",
    "What is gained through transformation may come at the cost of stability, familiarity, or self-recognition.",
    "The more the characters adapt, the more uncertain it becomes whether they can return to what they were before.",
    "Change stops being abstract once it starts rewriting identity in ways that cannot be ignored."
  ],
  question: [
    "what the characters become once change can no longer be resisted",
    "how much transformation can be accepted before it becomes loss",
    "whether becoming something new is liberation, danger, or both",
    "what parts of the self must be protected while everything else is changing",
    "how the group decides which changes are worth embracing",
    "what remains of identity once transformation has fully taken hold"
  ]
},

entropy_decay: {
  premise: [
    "Everything is falling apart, and every success is measured against a world already in decline.",
    "The world is not failing all at once, but in enough places at once that stability starts to feel temporary.",
    "What surrounds the group is eroding faster than it can be repaired.",
    "Decay here is not background texture; it is one of the main forces shaping every decision.",
    "The group moves through a world that has already begun to break down in ways no one can fully reverse cleanly.",
    "Collapse is not a future threat so much as an active condition the group is already living inside.",
    "What once held things together is weakening, and every effort to preserve it feels increasingly provisional."
  ],
  burden: [
    "Survival means acting in a world where every solution is measured against larger decline.",
    "The group has to decide what can still be saved before the cost of saving it becomes too high.",
    "Decay creates pressure because even meaningful victories happen inside a larger pattern of loss.",
    "The challenge is not just overcoming immediate threats, but doing so while the world around them keeps worsening.",
    "Every success risks feeling temporary when the structures supporting that success continue to fail.",
    "The longer the group pushes forward, the more clearly they see how much has already slipped beyond easy repair."
  ],
  question: [
    "what is still worth saving in a world already coming apart",
    "how much can be preserved before decline overtakes it anyway",
    "what kind of hope remains when the larger system keeps failing",
    "whether resistance still matters inside a world already in collapse",
    "what the group chooses to protect when restoration is no longer fully possible",
    "how to keep meaning alive while everything around it deteriorates"
  ]
},

what_is_humanity: {
  premise: [
    "The campaign asks where the line lies between person and monster, empathy and power, self and loss.",
    "The central tension is not only what people can do, but what still makes them recognizable once they do it.",
    "The group keeps confronting choices that blur the boundary between humanity, utility, and transformation.",
    "The story turns on what personhood means once power, survival, or change begins to distort it.",
    "What matters here is not simply whether someone is dangerous, but whether they are still someone in the same way they were before.",
    "The world keeps forcing the group to question whether identity is moral, emotional, physical, or something harder to define cleanly.",
    "This is a story where personhood itself becomes unstable under pressure."
  ],
  burden: [
    "The challenge is not only confronting what is changing, but deciding what parts of a person still deserve recognition, care, or protection.",
    "Every transformation, compromise, or adaptation raises harder questions about what should still count as human.",
    "The group is forced to act in situations where empathy becomes difficult, but abandoning it may cost something just as serious.",
    "Power and survival both create pressure because they can erode the boundaries that once felt morally clear.",
    "The deeper the group moves into the problem, the less comfortable any simple definition of humanity becomes.",
    "What makes this painful is not only the danger of losing humanity, but the uncertainty of knowing when that loss has actually happened."
  ],
  question: [
    "what still defines a person once power and loss begin reshaping them",
    "where the boundary lies between survival and becoming something unrecognizable",
    "how much change can happen before personhood itself is altered",
    "whether empathy can survive in a world that keeps blurring the line between person and monster",
    "what the group owes to those who are changing in frightening ways",
    "how humanity is measured once the old definitions stop holding cleanly"
  ]
},

power_must_be_controlled: {
  premise: [
    "Unchecked power destroys everything, and the struggle is not only to gain strength but to restrain it.",
    "The danger is not merely weakness, but what happens when strength outpaces judgment.",
    "Power here is useful, necessary, and perpetually at risk of becoming catastrophic.",
    "The group is forced to treat restraint as seriously as ambition.",
    "What matters is not only whether power can be wielded, but whether it can be kept within acceptable bounds.",
    "Strength creates danger when it grows faster than discipline, wisdom, or moral clarity.",
    "The story keeps returning to the same pressure point: control is not optional once power becomes real."
  ],
  burden: [
    "The challenge is learning how to use strength without becoming governed by it.",
    "Every increase in power raises the risk of misjudgment, overreach, or irreversible damage.",
    "The group has to decide what safeguards matter before the consequences of failing to impose them become too large.",
    "Control creates pressure because it demands limitation precisely when strength makes limitless action feel possible.",
    "The hardest choices come when the fastest path to victory is also the least restrained one.",
    "Power only stays useful if the group can keep it from becoming its own new threat."
  ],
  question: [
    "how much control is enough once real power is on the table",
    "what limits the group is willing to place on strength before it harms everything around it",
    "whether restraint can survive once power begins offering easier answers",
    "what discipline looks like when the consequences of failure keep getting larger",
    "how the group decides which uses of power are already too dangerous",
    "what happens when control fails at exactly the wrong moment"
  ]
},

};

const systemVoiceMap = {
  clue_web: {
    gameplay: [
      "Progress comes from assembling fragments that only start to make sense when viewed together.",
      "The group uncovers answers by connecting details that first appear unrelated.",
      "Discovery depends on following multiple threads instead of relying on a single obvious lead.",
      "The group builds understanding by noticing how separate clues reinforce, contradict, or reframe each other.",
      "What matters is rarely one revelation on its own, but the network of meaning formed between many smaller findings.",
      "The investigation moves forward when scattered information starts locking together into a larger pattern.",
      "Answers emerge through connection, comparison, and interpretation rather than simple direct disclosure."
    ],
    pressure: [
      "Each discovery points toward larger patterns instead of simple solutions.",
      "The more clues the group finds, the clearer it becomes that no single one explains the whole problem.",
      "Partial answers create momentum, but they also widen the sense of what still has not been understood.",
      "Every lead opens new possibilities, forcing the group to decide which threads matter most.",
      "The challenge is not just finding clues, but knowing how to weigh them against each other.",
      "The web of information grows more useful and more overwhelming at the same time."
    ]
  },

  hidden_information: {
    gameplay: [
      "People, institutions, and even records withhold what matters most.",
      "What is missing often matters as much as what is found.",
      "The group keeps running into gaps, omissions, and half-answers that matter as much as the clues themselves.",
      "Important information exists, but it rarely arrives cleanly or all at once.",
      "Progress depends on noticing what is absent, obscured, or deliberately left unsaid.",
      "The truth is pieced together through fragments, omissions, and the spaces between conflicting accounts.",
      "Answers rarely come directly; the group has to read around what others refuse to say plainly."
    ],
    pressure: [
      "Certainty is hard won because no one reveals the full picture willingly.",
      "Every answer tends to expose another missing piece.",
      "The more the group learns, the clearer it becomes that someone benefits from the confusion.",
      "Missing context keeps turning good leads into incomplete ones.",
      "The problem is not just finding information. It is knowing who shaped it, hid it, or left it out."
    ],

    
  },

  resource_scarcity: {
    gameplay: [
      "The group cannot answer every problem without sacrifice.",
      "Limited supplies turn even simple decisions into real tradeoffs.",
      "Every plan has to account for the fact that time, safety, and materials are all running short.",
      "Scarcity turns logistics into part of the drama rather than something that happens offscreen.",
      "What the group chooses to spend, save, or leave behind matters as much as any victory they win.",
      "Pressure builds because useful resources never stretch as far as the situation demands.",
      "Survival and progress depend on deciding what can be afforded now and what must be preserved for later."
    ],
    pressure: [
      "Need accumulates faster than relief.",
      "There is never quite enough to save everything at once.",
      "Every shortage forces the group to decide which problem matters most right now.",
      "The more pressure builds, the more expensive even basic choices become.",
      "Running low on resources changes not only what the group can do, but what risks they are forced to accept.",
      "Scarcity keeps narrowing the margin for error."
    ]
  },

  attrition_combat: {
    gameplay: [
      "Victory is measured by what the group still has left afterward.",
      "Even successful fights leave lasting strain.",
      "Combat is dangerous less because of one decisive blow and more because repeated pressure wears the group down over time.",
      "The group wins by surviving the accumulated cost of conflict, not by escaping every battle cleanly.",
      "Encounters matter because damage, exhaustion, and depletion continue shaping what comes next.",
      "Fights leave marks that carry forward into later choices, later risks, and later survival.",
      "The battlefield is only part of the challenge; the aftermath matters just as much."
    ],
    pressure: [
      "Every confrontation costs something the party may need later.",
      "Even small victories become dangerous when they steadily erode the group's long-term resilience.",
      "What makes conflict threatening is how quickly repeated encounters stack strain on top of strain.",
      "The longer the group stays under pressure, the harder it becomes to recover what each fight has taken.",
      "Attrition turns survival into a matter of endurance as much as tactics.",
      "Each battle narrows the room the group has to make mistakes later."
    ]
  },

  asymmetrical_boss_design: {
    gameplay: [
      "Major enemies demand new approaches rather than routine tactics.",
      "Important confrontations feel like problems to solve, not just walls of hit points.",
      "Boss encounters stand out because they change the rules of engagement around themselves.",
      "The group has to read, adapt to, and exploit enemy behavior instead of repeating a familiar pattern.",
      "Big confrontations become memorable because each one asks the group to solve a different kind of threat.",
      "Victory depends on understanding how a major enemy reshapes the battlefield, timing, or stakes of the fight.",
      "The strongest enemies feel distinct because they force different responses instead of bigger numbers."
    ],
    pressure: [
      "The group has to adapt under pressure when brute force is not enough.",
      "What makes these encounters dangerous is how quickly old habits stop working.",
      "The challenge escalates when the enemy keeps forcing the group to rethink what the fight actually requires.",
      "Every major confrontation tests flexibility as much as raw power.",
      "The group is pressured not only to survive, but to understand the fight before it overwhelms them.",
      "A boss becomes dangerous the moment it changes what a normal victory would look like."
    ]
  },

  upgrade_through_risk: {
    gameplay: [
      "Growth comes from taking meaningful risks instead of waiting for safe rewards.",
      "Power is earned by pressing forward when caution would be easier.",
      "Advancement is tied to bold choices, exposed opportunities, and moments where the group decides to push deeper.",
      "The most valuable gains sit behind danger, uncertainty, or hard commitment.",
      "Progress rewards initiative, especially when the group reaches for more than basic survival.",
      "Improvement comes from engaging with risk directly rather than avoiding it until conditions feel perfect.",
      "The group grows stronger by choosing the harder path when it offers something worth the danger."
    ],
    pressure: [
      "Every step toward greater strength invites greater danger.",
      "Risk creates momentum, but it also raises the cost of failure.",
      "The path to real growth stays dangerous precisely because it offers meaningful reward.",
      "The group has to decide when greater strength is worth the exposure required to reach it.",
      "Advancement becomes part of the tension because safety and growth keep pulling in different directions.",
      "The more valuable the opportunity, the more dangerous it usually is to seize."
    ]
  },

  tactical_positioning_zone_control: {
    gameplay: [
      "Where the group stands matters as much as what the group attempts.",
      "Terrain, spacing, and battlefield control constantly shape the flow of danger.",
      "Position determines opportunity, safety, and pressure throughout the fight.",
      "The group wins by controlling movement, angles, chokepoints, and space rather than only trading damage.",
      "Encounters reward careful use of ground, cover, distance, and denial.",
      "The battlefield matters because placement changes what actions become possible or too dangerous to attempt.",
      "Small adjustments in movement and control can decide the outcome before raw damage does."
    ],
    pressure: [
      "Small positional mistakes become expensive quickly.",
      "Losing control of space often matters more than losing one exchange.",
      "Pressure rises whenever the group is forced out of strong positions or denied room to maneuver.",
      "The challenge escalates when terrain starts limiting safe choices instead of supporting them.",
      "Bad spacing turns manageable threats into compounding ones.",
      "Control of the battlefield can shift faster than the group can recover from a mistake."
    ]
  },

  escalation_meter: {
    gameplay: [
      "Trouble compounds when the group cannot regain control quickly.",
      "Once pressure starts rising, events tend to spiral instead of stabilize.",
      "The situation worsens in visible steps, making delay and miscalculation increasingly dangerous.",
      "Momentum matters because the cost of waiting grows over time.",
      "The group is pushed to act before the crisis reaches a level that reshapes every later choice.",
      "Escalation turns inaction into a real decision with real cost.",
      "The problem intensifies as events continue, forcing the group to respond before the next threshold is crossed."
    ],
    pressure: [
      "Delay makes every later problem worse.",
      "The longer the group waits, the fewer clean options remain available.",
      "Escalation creates urgency by turning manageable problems into layered ones.",
      "Every missed chance to contain the situation makes the next response more expensive.",
      "The threat is dangerous not only because it exists, but because it keeps accelerating.",
      "Pressure climbs fastest when the group cannot interrupt the pattern early."
    ]
  },

  exploration_discovery_loop: {
    gameplay: [
      "Progress comes through uncovering what the world has hidden or forgotten.",
      "Discovery drives momentum as each answer opens new paths and new dangers.",
      "The group moves forward by entering unfamiliar places and learning what those places reveal.",
      "Exploration matters because each new location changes what the group understands and where they can go next.",
      "Discovery is not filler between major events; it is the engine that keeps the campaign unfolding.",
      "The world rewards curiosity with access, context, and opportunities that would otherwise remain unreachable.",
      "Moving into the unknown creates both narrative progress and practical advantage."
    ],
    pressure: [
      "The farther the group pushes into the unknown, the more the stakes change.",
      "New discoveries rarely simplify the situation; they broaden it.",
      "Each answer creates momentum, but also raises new questions about what lies deeper in.",
      "The unknown creates pressure because every step forward changes the scale of the story.",
      "Exploration keeps widening the field of consequences instead of closing it down neatly.",
      "The challenge grows as discovery keeps revealing larger structures behind the first mystery."
    ]
  },

  living_world_reaction: {
    gameplay: [
      "The world changes in response to the group's choices.",
      "Actions leave marks that reshape future opportunities, threats, and alliances.",
      "What the group does now affects how places, people, and problems develop later.",
      "The setting evolves over time instead of waiting in place for the characters to return.",
      "Consequences become visible because the world keeps absorbing and reflecting the group's decisions.",
      "The campaign gains momentum from the fact that earlier actions continue shaping later realities.",
      "The group is playing inside a world that remembers, adapts, and moves forward with or without them."
    ],
    pressure: [
      "Nothing stays neutral forever once the group starts moving pieces on the board.",
      "Every major choice changes the landscape the group will have to navigate next.",
      "Delay can be costly because the world keeps developing in the meantime.",
      "The challenge is not only making decisions, but living inside their evolving aftermath.",
      "Reaction creates pressure because old choices remain active long after the moment that created them.",
      "The more the group changes the world, the more the world changes the conditions around the group."
    ]
  },

  influence_social_leverage: {
    gameplay: [
      "Power comes from pressure, relationships, and what people can be persuaded to reveal or protect.",
      "Words, favors, and leverage can matter as much as weapons.",
      "The group gains ground by shifting motives, reading vulnerabilities, and controlling what others believe is possible.",
      "Social play matters because influence can unlock doors that force cannot reach cleanly.",
      "Progress depends on understanding what people fear, value, owe, or want badly enough to act on.",
      "Negotiation, pressure, and relationship management become core tools for changing the shape of the situation.",
      "What the group knows about people is often as important as what they know about the problem."
    ],
    pressure: [
      "Every alliance creates a new vulnerability.",
      "Influence is powerful, but it also ties the group more tightly to unstable people and unstable arrangements.",
      "The more leverage the group uses, the more they risk becoming entangled in what that leverage depends on.",
      "Social power creates pressure because every gain may generate resentment, expectation, or obligation elsewhere.",
      "Relationships open opportunities, but they also make betrayal more expensive.",
      "The challenge is not only getting what the group needs, but managing what that exchange will now cost."
    ]
  },

  faction_reputation: {
    gameplay: [
      "Different groups remember what the party has done and respond accordingly.",
      "Standing with one power often closes doors with another.",
      "The group's history becomes a resource that shapes future negotiations, conflicts, and alliances.",
      "Reputation matters because institutions and factions interpret the same action in very different ways.",
      "Progress depends in part on how the group is perceived by the powers already competing in the setting.",
      "Choices echo outward through organized groups that adapt their behavior to what the party has become known for.",
      "The party's standing changes what help, resistance, suspicion, or access they encounter next."
    ],
    pressure: [
      "Reputation becomes a resource that can be spent, damaged, or weaponized.",
      "Every strong alliance makes another relationship harder to maintain.",
      "The more visible the group becomes, the less freedom they have to move without consequence.",
      "Perception creates pressure because factions keep reacting to what they think the group represents.",
      "The party can gain influence, but only by becoming legible to powers that may not agree on what that means.",
      "Each decision narrows some paths even while it opens others."
    ]
  },

  environmental_combat: {
    gameplay: [
      "The battlefield matters as much as the enemies, with hazards, terrain, and interaction shaping the fight.",
      "Combat is defined by what the environment allows, threatens, or disrupts as much as by who is present.",
      "The group has to use terrain, instability, and physical context as part of every major confrontation.",
      "Fights become dynamic because the setting itself keeps influencing movement, danger, and opportunity.",
      "Victory often depends on understanding the environment before it turns into an additional enemy.",
      "The battlefield is active, forcing the group to treat position, hazards, and surroundings as part of the encounter's logic.",
      "What surrounds the group in a fight is rarely neutral; it can be used, survived, or turned against them."
    ],
    pressure: [
      "The environment keeps creating new risks even when the enemy is already dangerous enough.",
      "Hazards, collapsing footing, shifting terrain, and unstable conditions make every round harder to predict.",
      "The group is pressured not only by opponents, but by a battlefield that keeps changing what is safe.",
      "Small mistakes become costly when the environment amplifies them.",
      "The encounter escalates whenever the terrain itself starts narrowing the group's options.",
      "The challenge is not just surviving the enemy, but surviving where the fight is happening."
    ]
  },

  alliance_vs_betrayal: {
    gameplay: [
      "No alliance is simple, and choosing sides carries long-term consequences, tension, and compromise.",
      "Relationships are strategic assets, but also possible fault lines waiting to split under pressure.",
      "The group advances by building trust carefully in a world where trust is rarely guaranteed.",
      "Every alliance offers help, but also creates exposure to the motives and failures of others.",
      "Progress often depends on deciding who can be relied on, who cannot, and what proof would ever be enough to know the difference.",
      "The campaign gains tension from the fact that cooperation and betrayal stay uncomfortably close together.",
      "The group is constantly navigating promises, loyalties, and the possibility that any of them may fail when the stakes rise."
    ],
    pressure: [
      "Trust becomes harder to manage the more valuable an alliance becomes.",
      "Every new partnership raises the risk of disappointment, compromise, or outright betrayal.",
      "The group cannot align with anyone without also inheriting the danger of being let down by them.",
      "The closer the characters get to others, the more damaging disloyalty becomes.",
      "Betrayal creates pressure not only because it hurts, but because it reshapes what future trust can look like.",
      "The challenge is not just finding allies, but surviving what those alliances may eventually cost."
    ]
  },

  corruption_transformation_track: {
    gameplay: [
      "Power changes the characters over time, creating tradeoffs between strength, identity, and consequence.",
      "Progress is tied to forms of change that may be useful, but never feel entirely free of cost.",
      "The group has to weigh immediate advantage against the longer-term effects of what that advantage is doing to them.",
      "Transformation is tracked as an active part of play, turning growth into something both strategic and unsettling.",
      "Characters become stronger by engaging with forces that also threaten to alter what they are becoming.",
      "Every step deeper into this system asks whether the gained power is worth the accumulating change attached to it.",
      "The mechanics make transformation visible, forcing the group to reckon with change instead of treating it as background flavor."
    ],
    pressure: [
      "Each gain creates the risk of becoming harder to recognize, harder to trust, or harder to return from.",
      "The more the group leans on transformative power, the more difficult it becomes to pretend nothing important is changing.",
      "Corruption creates pressure because useful choices may also be the ones that reshape the characters most severely.",
      "Every advancement risks pushing identity, morality, or stability further from where it started.",
      "The challenge intensifies when strength and self-preservation stop pulling in the same direction.",
      "What makes the system dangerous is not only the cost, but how gradually that cost becomes normalized."
    ]
  },

  legacy_inheritance_system: {
    gameplay: [
      "Previous characters, past selves, or inherited consequences continue shaping the current campaign.",
      "The group advances inside a story where what came before remains active instead of staying resolved.",
      "Legacy matters because older choices, identities, and unfinished consequences keep feeding into present action.",
      "The campaign treats inheritance as live material, letting the past alter what options exist now.",
      "Progress is shaped by what earlier lives, earlier generations, or earlier decisions already set in motion.",
      "The group keeps moving forward while carrying systems of meaning, debt, and consequence they did not fully create themselves.",
      "What has been handed down becomes part of play, not just lore."
    ],
    pressure: [
      "The past keeps narrowing or complicating the choices available in the present.",
      "Inheritance creates pressure because unresolved consequences do not stay politely contained in history.",
      "The group has to navigate obligations, patterns, or burdens that were already in motion before they arrived.",
      "Every attempt to move forward also means deciding what to do with what was left behind.",
      "Legacy becomes dangerous when older answers continue exerting force on a present that wants to be different.",
      "The challenge is not just understanding the inheritance, but deciding whether to continue it, reject it, or reshape it."
    ]
  },

  modular_build_system: {
    gameplay: [
      "Players build their identity through flexible components, allowing highly customized growth and expression.",
      "Character development happens through meaningful combinations that let the group shape capability and identity at the same time.",
      "The system rewards deliberate construction, letting players define how their strengths fit together rather than only increasing fixed numbers.",
      "Growth feels personal because it comes from assembling parts into a coherent style rather than following a single narrow path.",
      "The group's evolving builds become part of the campaign's identity, reflecting changing priorities, risks, and self-concepts.",
      "Customization creates play depth by turning development into a series of design choices rather than a single predetermined track.",
      "Players express who they are becoming through the way they assemble their tools, features, and tradeoffs."
    ],
    pressure: [
      "Each choice closes off other possibilities, making growth feel authored rather than automatic.",
      "Customization creates tension because every build decision reflects a priority the player cannot fully optimize around all at once.",
      "The challenge is not only becoming stronger, but becoming stronger in a way that remains coherent under pressure.",
      "Flexibility creates pressure because the group must decide what kind of capability matters most before the next problem appears.",
      "Every layer of customization raises the stakes of choosing wrong, overcommitting, or discovering too late what was actually needed.",
      "The more expressive the system becomes, the more meaningful every tradeoff feels."
    ]
  },
};

const environmentVoiceMap = {
  desert_wasteland: {
    imagery: [
      "dry horizons, failing routes, and settlements hanging on by habit and grit",
      "empty distance, exposed travel, and little mercy once supplies run thin",
      "heat-blasted expanses where shelter is rare and every mile feels earned",
      "windswept waste, exhausted trails, and communities surviving one hard decision at a time",
      "sun-struck emptiness where distance becomes a threat long before any enemy appears",
      "parched ground, collapsing waystations, and the constant sense that relief lies farther away than it should",
      "a harsh landscape of ruin, exposure, and dwindling reserves where nature offers almost nothing freely"
    ],
    gameplay: [
      "Travel itself becomes part of the challenge, not just the space between scenes.",
      "Distance, heat, and limited supplies turn movement into a constant test of judgment and endurance.",
      "The environment creates pressure by making every route feel costly, exposed, and uncertain.",
      "Progress depends on managing attrition across long stretches where mistakes are difficult to recover from.",
      "Survival is shaped as much by what the land withholds as by any direct threat moving through it.",
      "The group cannot treat travel as neutral because the wasteland keeps taxing time, safety, and resources."
    ]
  },

  frontier_wildlands: {
    imagery: [
      "isolated outposts, uncertain roads, and communities too far apart to protect each other well",
      "hard country where help rarely arrives before the damage is done",
      "wide open land marked by fragile settlements, dangerous routes, and long gaps between safety",
      "untamed spaces where distance, exposure, and local hardship shape daily life",
      "remote territory held together by grit, rumor, and whatever protection people can manage for themselves",
      "a rough frontier of scattered strongholds, vulnerable roads, and threats that move faster than support does",
      "borderland spaces where opportunity and danger sit close together, and no one is fully insulated from either"
    ],
    gameplay: [
      "Distance creates pressure because every choice leaves something else unattended.",
      "The frontier turns movement, timing, and divided attention into meaningful sources of tension.",
      "Travel and response time matter because trouble often spreads faster than protection can.",
      "The group has to choose carefully where to intervene, knowing they cannot be everywhere at once.",
      "Isolation makes each settlement, road, and decision feel more consequential because support stays far away.",
      "The environment creates pressure by stretching resources, protection, and attention across too much ground."
    ]
  },

  dense_city_urban: {
    imagery: [
      "crowded streets, closed circles, and too many secrets packed too close together",
      "a city that hides danger behind routine, status, and architecture",
      "tight districts, layered power, and constant movement through spaces built to conceal as much as they reveal",
      "dense neighborhoods where influence, suspicion, and opportunity overlap block by block",
      "an urban maze of institutions, alleyways, social boundaries, and pressure hidden in plain sight",
      "streets full of commerce, rumor, hierarchy, and the uneasy sense that everyone knows something they are not saying",
      "a city shaped by proximity, reputation, and systems that keep functioning even while something underneath them is going wrong"
    ],
    gameplay: [
      "Information moves through people, institutions, and rumor before it ever reaches the party cleanly.",
      "Progress depends on navigating layers of access, status, and hidden relationships rather than moving directly toward the answer.",
      "The city creates pressure by compressing danger, opportunity, and secrecy into the same crowded spaces.",
      "Every district, faction, and institution filters what the group can learn and how quickly they can act on it.",
      "Urban play becomes about reading people, networks, and power structures as carefully as physical spaces.",
      "The setting rewards careful movement through social and institutional terrain, not just geographic terrain."
    ]
  },

  ruined_civilization: {
    imagery: [
      "broken legacies, failed monuments, and the remains of systems that once promised order",
      "evidence of past greatness now cracked open, abandoned, or repurposed",
      "collapsed structures, buried histories, and old ambitions still visible in what they left behind",
      "the remains of power, belief, and design lingering long after the people who built them are gone",
      "ruins that feel less empty than interrupted, as though the past stopped speaking only halfway through the sentence",
      "shattered monuments, reclaimed corridors, and traces of an older world still shaping the one built on top of it",
      "a landscape of remnants, warnings, and unfinished legacies too large to ignore"
    ],
    gameplay: [
      "The past never stays buried; it keeps shaping the present.",
      "Exploration becomes an act of interpretation, because ruins hold both forgotten answers and distorted remains.",
      "The environment creates pressure by forcing the group to work through what history broke, hid, or left behind.",
      "Every ruin offers access to lost context, but rarely without danger, ambiguity, or cost.",
      "The setting keeps turning old systems and old failures into present-day obstacles and opportunities.",
      "Progress depends on deciding what the remnants of the past still mean and what they are still capable of causing."
    ]
  },

  coastal_oceanic: {
    imagery: [
      "storm-worn shores, ancient crossings, and power tied to tides, distance, and weather",
      "a horizon that promises discovery while hiding what waits beyond it",
      "restless coastlines where movement, trade, and danger all depend on forces no one fully controls",
      "salt-marked ruins, uncertain waters, and long stretches of open distance shaped by tide and wind",
      "harbors, cliffs, islands, and crossings that make the edge of the world feel both expansive and precarious",
      "a maritime landscape of shifting weather, exposed passages, and the constant pull of what lies farther out",
      "shorelines where discovery feels close enough to chase and far enough to fear"
    ],
    gameplay: [
      "Movement across the world feels expansive, dangerous, and full of old significance.",
      "Travel depends on reading weather, distance, and timing in a setting where the route itself can turn hostile quickly.",
      "The coast creates pressure by opening paths outward while making every crossing vulnerable to interruption.",
      "Exploration gains weight because each shoreline, island, and passage suggests both opportunity and risk.",
      "The environment makes movement feel consequential, especially when tide, storm, and exposure can reshape the plan.",
      "The world feels larger here, but that scale comes with uncertainty, separation, and the danger of being caught between places."
    ]
  },

  otherworld_abstract: {
    imagery: [
      "places where reality bends, symbols feel physical, and the landscape behaves more like thought than geography",
      "dreamlike spaces where distance, logic, and meaning refuse to stay stable",
      "an environment that feels symbolic, disorienting, and only partially governed by ordinary rules",
      "surreal terrain where direction, scale, and cause no longer behave the way they should",
      "a setting shaped by impossible geometry, unstable perception, and meanings that feel half-buried in the world itself",
      "reality warped into forms that feel dreamlike, uncanny, and difficult to trust",
      "spaces that seem to react to attention, emotion, or hidden logic rather than simple physical law"
    ],
    gameplay: [
      "Navigation, interpretation, and survival all become harder when the environment does not behave predictably.",
      "The group has to read the world symbolically as well as physically, because obvious rules do not always apply.",
      "Progress depends on adapting to a setting where meaning and space can shift under pressure.",
      "The environment creates tension by making certainty harder to hold onto from one moment to the next.",
      "The world itself becomes part puzzle, part hazard, and part warning.",
      "What the group perceives cannot always be trusted, so movement and understanding stay tightly linked."
    ]
  },

  underground_caverns: {
    imagery: [
      "darkness, depth, claustrophobia, and the unsettling feeling of descending too far",
      "narrow passages, buried chambers, and vast underground spaces that make the surface feel very far away",
      "a subterranean world of pressure, silence, and hidden routes through stone and shadow",
      "deep places where confinement and scale exist side by side in uncomfortable ways",
      "caverns shaped by darkness, echo, unstable footing, and the sense of being enclosed by something ancient",
      "underground spaces where visibility, direction, and safety are all harder to hold onto",
      "a world below the world, marked by depth, isolation, and the weight of too much stone overhead"
    ],
    gameplay: [
      "Movement becomes more dangerous when space is confined, visibility is limited, and retreat is uncertain.",
      "Exploration carries extra pressure because the underground resists quick exits and easy orientation.",
      "The environment turns descent into commitment, making each step inward harder to reverse cleanly.",
      "Survival depends on reading darkness, terrain, and enclosure as carefully as any enemy threat.",
      "Every path underground feels more consequential because wrong turns cost time, safety, and clarity.",
      "The deeper the group goes, the more the setting itself starts to compress their options."
    ]
  },

  dense_jungle_overgrowth: {
    imagery: [
      "thick vegetation, swallowed ruins, and living growth that keeps reclaiming everything left still too long",
      "overgrown paths, humid pressure, and a landscape where visibility and movement are constantly obstructed",
      "dense natural spaces where the world feels vibrant, encroaching, and difficult to fully penetrate",
      "jungle terrain that hides routes, dangers, and old structures beneath relentless growth",
      "a setting shaped by heat, abundance, concealment, and the sense that nature is always closing back in",
      "ruins half-consumed by roots, vines, and living systems older than any recent claim on the land",
      "lush overgrowth that makes travel, scouting, and certainty feel slower and more fragile"
    ],
    gameplay: [
      "Exploration becomes tense because the environment keeps concealing what lies only a short distance away.",
      "The group has to work through obstruction, concealment, and living terrain that resists easy movement.",
      "Progress depends on reading signs hidden beneath layers of growth, decay, and misdirection.",
      "The setting rewards patience and attention because it rarely reveals its routes cleanly.",
      "Nature acts as both cover and obstacle, shaping every approach to movement and discovery.",
      "The deeper the group pushes into overgrowth, the more the environment controls pace and visibility."
    ]
  },

  frozen_expanse: {
  imagery: [
    "ice, distance, exposure, and a cold so constant it becomes part of every decision",
    "bleak frozen reaches where survival depends on shelter, endurance, and respect for the environment",
    "snowbound emptiness shaped by stillness, visibility, and the threat of being caught without protection",
    "a harsh white landscape where the scale of distance and weather makes people feel dangerously small",
    "frozen terrain marked by isolation, scarce warmth, and conditions that punish carelessness immediately",
    "an environment of brittle stillness, biting cold, and long stretches where survival feels provisional",
    "icy horizons where travel is slow, shelter is precious, and nature itself feels unforgiving"
  ],
  gameplay: [
    "Cold and exposure turn movement, rest, and preparation into central parts of survival.",
    "The environment creates danger by punishing delay, overconfidence, and poor planning.",
    "Progress depends on respecting weather, distance, and the limits of endurance.",
    "Every stretch of travel matters more when warmth and safety are never fully secure.",
    "The frozen landscape narrows mistakes quickly, leaving little room for careless choices.",
    "Survival becomes a question of pace, preparation, and whether the group can stay functional against the cold."
  ]
},

  volcanic_firelands: {
    imagery: [
      "unstable ground, burning vents, and a landscape shaped by eruption, heat, and violent transformation",
      "firelit ridges, ash-choked air, and terrain that feels one bad moment away from breaking open",
      "a violent landscape of magma, smoke, fracture, and relentless thermal pressure",
      "terrain that looks half-formed and half-destroyed, as though creation and ruin are happening at the same time"
    ],
    gameplay: [
      "The environment creates danger by making stability temporary and movement continually risky.",
      "Heat, eruption, and unstable terrain force the group to treat the setting itself as an active threat.",
      "Progress depends on timing, positioning, and surviving a landscape that can become hostile without warning.",
      "The terrain keeps amplifying pressure by turning ordinary mistakes into catastrophic ones quickly."
    ]
  },

  mountain_highlands: {
    imagery: [
      "thin air, exposed ridges, high winds, and steep ground that turns every crossing into commitment",
      "elevated terrain where visibility stretches far but safety does not",
      "jagged heights, isolated passes, and hard-won routes through harsh and strategic ground",
      "a landscape of altitude, exposure, and dangerous vantage where distance and elevation both matter"
    ],
    gameplay: [
      "Movement is shaped by exposure, bottlenecks, and the constant risk of being caught in bad terrain.",
      "The highlands create pressure by making every route narrow, visible, and difficult to retreat from cleanly.",
      "Progress depends on endurance, pathing, and respecting the terrain's ability to punish overconfidence.",
      "The environment rewards careful positioning while making mistakes feel harsher and more final."
    ]
  },

  swamp_marsh: {
    imagery: [
      "murky water, rotting ground, obscured paths, and a landscape that keeps hiding what matters until it is too close",
      "slow, wet terrain full of concealed danger, decay, and movement that never feels fully visible",
      "fog, stagnant water, tangled roots, and unstable footing that turns simple travel into layered risk",
      "a landscape of concealment, saturation, and soft ground that seems to swallow certainty first and people second"
    ],
    gameplay: [
      "The environment creates pressure by slowing movement, obscuring threats, and punishing bad footing.",
      "Progress is harder because visibility, direction, and safe passage all become less reliable at once.",
      "The swamp resists clean movement, forcing the group to work through uncertainty, concealment, and attrition.",
      "Travel and confrontation both become more dangerous when the terrain keeps hiding what should already be obvious."
    ]
  },

  floating_islands: {
    imagery: [
      "broken land suspended above open sky, with unstable crossings and distances that feel one mistake away from disaster",
      "fragmented heights, drifting landmasses, and routes that depend on timing, balance, and nerve",
      "a vertical world of suspended terrain, dangerous gaps, and beauty inseparable from exposure",
      "floating geography where separation, altitude, and instability reshape what movement even means"
    ],
    gameplay: [
      "The environment creates pressure by turning traversal into a problem of altitude, separation, and unstable connection.",
      "Movement matters more because every route is exposed, segmented, and vulnerable to disruption.",
      "Progress depends on navigating vertical space where a wrong step can change everything immediately.",
      "The terrain rewards daring and precision while punishing hesitation, overreach, and poor planning."
    ]
  },

  ancient_megastructure: {
    imagery: [
      "massive artificial spaces built at a scale that makes the group feel small, temporary, and poorly informed",
      "impossibly large constructions full of hidden purpose, overwhelming geometry, and systems too vast to understand at a glance",
      "ancient engineered spaces whose size and design suggest intent long after meaning has been lost",
      "a colossal environment of chambers, mechanisms, and structural logic that dwarfs ordinary human assumptions"
    ],
    gameplay: [
      "Exploration becomes a matter of surviving scale, deciphering purpose, and navigating spaces not built with people like the group in mind.",
      "The structure creates pressure by making orientation, interpretation, and safe passage harder than they should be.",
      "Progress depends on understanding fragments of a design too large to ever fully hold in view at once.",
      "The environment turns size and mystery into active pressure, constantly reminding the group how little of it they actually control."
    ]
  },

};

const toneVoiceMap = {
  grimdark: {
    adjectives: ["fraying", "harsh", "failing", "compromised", "costly", "bleak", "scarred"],
    verbs: ["endure", "cling", "deteriorate", "withstand", "bleed", "erode"],
    cadence: "heavy",
    sentenceStyle: "sharp",
    intensity: 5,
    opening: [
      "Start with pressure already in motion.",
      "Frame the world as damaged before the group fully enters it.",
      "Lead with instability, consequence, or failure already underway."
    ],
    transition: [
      "Shift from survival to cost quickly.",
      "Let every success carry implied damage.",
      "Move from action into erosion or compromise."
    ],
    pressureFlavor: [
      "costly endurance",
      "moral abrasion",
      "attritional loss",
      "survival under worsening conditions"
    ],
    endingFlavor: [
      "end on consequence rather than triumph",
      "leave the sense that survival itself changed something important",
      "close on what had to be paid, preserved, or surrendered"
    ]
  },

  horror: {
    adjectives: ["unsettling", "distorted", "unnerving", "forbidden", "unwelcome", "wrong", "invasive"],
    verbs: ["uncover", "disturb", "linger", "haunt", "encroach", "warp"],
    cadence: "slow_burn",
    sentenceStyle: "tight",
    intensity: 5,
    opening: [
      "Begin with unease before explanation.",
      "Lead with something subtly wrong rather than openly monstrous.",
      "Frame certainty as already unstable."
    ],
    transition: [
      "Move from unease into realization.",
      "Let each answer widen vulnerability instead of resolving it.",
      "Keep explanation partial and pressure cumulative."
    ],
    pressureFlavor: [
      "destabilized certainty",
      "creeping dread",
      "vulnerability to the unknown",
      "erosion of trust in what is real"
    ],
    endingFlavor: [
      "end on exposure rather than closure",
      "leave a sense that knowledge made the situation larger",
      "close on what can no longer be dismissed"
    ]
  },

  mythic: {
    adjectives: ["ancient", "consequential", "sacred", "world-shaping", "legendary", "symbolic", "fated"],
    verbs: ["rise", "awaken", "claim", "transform", "ascend", "answer"],
    cadence: "elevated",
    sentenceStyle: "flowing",
    intensity: 4,
    opening: [
      "Begin with scale and significance.",
      "Frame events as part of something older and larger than the immediate moment.",
      "Lead with symbolic weight, not just plot motion."
    ],
    transition: [
      "Move from character action into larger meaning.",
      "Let discoveries feel consequential beyond the immediate scene.",
      "Keep the language elevated without becoming vague."
    ],
    pressureFlavor: [
      "symbolic consequence",
      "larger-than-life stakes",
      "destiny under pressure",
      "meaning carried at world scale"
    ],
    endingFlavor: [
      "end on significance and transformation",
      "close on what the moment means beyond itself",
      "leave the sense of a larger pattern still moving"
    ]
  },

  heroic: {
    adjectives: ["bold", "rising", "defiant", "hard-won", "luminous", "resolute", "steadfast"],
    verbs: ["stand", "protect", "answer", "overcome", "hold", "defy"],
    cadence: "driving",
    sentenceStyle: "clean",
    intensity: 4,
    opening: [
      "Begin with challenge and possibility in the same breath.",
      "Lead with stakes, but leave room for meaningful agency.",
      "Frame the group as capable of mattering against real danger."
    ],
    transition: [
      "Move from pressure into response.",
      "Let action feel purposeful, not merely reactive.",
      "Keep momentum clean and forward-driving."
    ],
    pressureFlavor: [
      "courage under strain",
      "meaningful resistance",
      "hard-won momentum",
      "agency against the odds"
    ],
    endingFlavor: [
      "end on resolve, not easy comfort",
      "close on what can still be done",
      "leave the sense that action still matters"
    ]
  },

  psychological: {
    adjectives: ["fractured", "personal", "uncertain", "internal", "destabilizing", "intimate", "unsteady"],
    verbs: ["doubt", "unravel", "interpret", "withstand", "question", "reconstruct"],
    cadence: "intimate",
    sentenceStyle: "layered",
    intensity: 4,
    opening: [
      "Begin close to perception, pressure, or uncertainty.",
      "Lead with instability in how events are experienced, not just what events are.",
      "Frame conflict as internal and external at once."
    ],
    transition: [
      "Move from observation into implication.",
      "Let discoveries change interpretation, not just facts.",
      "Keep pressure personal as well as structural."
    ],
    pressureFlavor: [
      "internal strain",
      "unstable interpretation",
      "emotional pressure",
      "identity under stress"
    ],
    endingFlavor: [
      "end on what the truth does to people",
      "close on the cost of understanding",
      "leave the sense that perception itself has shifted"
    ]
  },

  noir: {
    adjectives: ["smoky", "uncertain", "compromised", "worn", "private", "hard-edged"],
    verbs: ["probe", "question", "uncover", "tail", "press", "compromise"],
    cadence: "measured",
    sentenceStyle: "lean",
    intensity: 3,
    opening: [
      "Begin with pressure hidden under routine.",
      "Lead with distrust, concealment, or moral compromise.",
      "Frame the situation as already shaped by damage and secrecy."
    ],
    transition: [
      "Move quickly from clue to cost.",
      "Keep the prose lean and unsentimental.",
      "Let every answer drag a new compromise into view."
    ],
    pressureFlavor: [
      "fragile trust",
      "moral compromise",
      "hidden motives",
      "truth under contamination"
    ],
    endingFlavor: [
      "end on ambiguity, not purity",
      "close on what the answer cost to learn",
      "leave the sense that clarity did not clean anything up"
    ]
  },

  political_intrigue: {
    adjectives: ["calculated", "delicate", "layered", "strategic", "careful", "leveraged"],
    verbs: ["maneuver", "influence", "position", "negotiate", "signal", "pressure"],
    cadence: "controlled",
    sentenceStyle: "precise",
    intensity: 3,
    opening: [
      "Begin with imbalance, leverage, or competing agendas.",
      "Lead with the movement of power rather than spectacle.",
      "Frame the problem through people, factions, and incentives."
    ],
    transition: [
      "Move from appearance into hidden motive.",
      "Keep the phrasing exact and deliberate.",
      "Let every development imply shifting alliances or costs."
    ],
    pressureFlavor: [
      "unstable alliances",
      "leveraged relationships",
      "careful maneuvering",
      "control through influence"
    ],
    endingFlavor: [
      "end on repositioning rather than resolution",
      "close on what the new balance of power looks like",
      "leave the sense that every gain changed the board"
    ]
  },

  lighthearted_chaotic: {
    adjectives: ["wild", "ridiculous", "unpredictable", "playful", "spirited", "energetic"],
    verbs: ["leap", "improvise", "collide", "scramble", "bounce", "chase"],
    cadence: "fast",
    sentenceStyle: "bouncy",
    intensity: 3,
    opening: [
      "Begin with motion, curiosity, or playful disruption.",
      "Lead with energy before weight.",
      "Frame the experience as adventurous and lively rather than burdened."
    ],
    transition: [
      "Move quickly and lightly between ideas.",
      "Let complications feel exciting before they feel threatening.",
      "Keep the pace brisk and expressive."
    ],
    pressureFlavor: [
      "fun-first unpredictability",
      "energetic momentum",
      "chaotic opportunity",
      "light pressure without heavy despair"
    ],
    endingFlavor: [
      "end on momentum or possibility",
      "close on a lively next step",
      "leave the sense that the trouble is exciting, not crushing"
    ]
  },

  melancholic: {
    adjectives: ["quiet", "fading", "heavy", "bittersweet", "distant", "softened"],
    verbs: ["linger", "remember", "fade", "reflect", "mourn", "carry"],
    cadence: "slow",
    sentenceStyle: "gentle",
    intensity: 2,
    opening: [
      "Begin with absence, memory, or something already slipping away.",
      "Lead with emotional residue rather than sharp impact.",
      "Frame the world through what has been lost or is quietly diminishing."
    ],
    transition: [
      "Move through reflection rather than urgency.",
      "Let emotional weight gather gradually.",
      "Keep the phrasing soft but specific."
    ],
    pressureFlavor: [
      "quiet loss",
      "emotional residue",
      "bittersweet endurance",
      "reflection under strain"
    ],
    endingFlavor: [
      "end on what remains rather than what is conquered",
      "close on memory, loss, or fragile continuation",
      "leave the sense of something meaningful but not fully healed"
    ]
  },

  tense: {
    adjectives: ["tight", "pressured", "uncertain", "fragile", "compressed", "narrow"],
    verbs: ["brace", "hold", "react", "strain", "watch", "push"],
    cadence: "urgent",
    sentenceStyle: "tight",
    intensity: 4,
    opening: [
      "Begin with pressure already narrowing options.",
      "Lead with urgency and limited room for error.",
      "Frame the situation as unstable and time-sensitive."
    ],
    transition: [
      "Move fast from setup into consequence.",
      "Keep the rhythm compressed and reactive.",
      "Let the prose feel like it is under time pressure too."
    ],
    pressureFlavor: [
      "compressed decision space",
      "narrow margins",
      "constant risk of escalation",
      "instability under time pressure"
    ],
    endingFlavor: [
      "end on what has to happen next",
      "close on unresolved pressure rather than broad reflection",
      "leave the sense that there is no real room to relax yet"
    ]
  },

  hopeful: {
    adjectives: ["rising", "steady", "resilient", "warm", "restorative", "clear"],
    verbs: ["endure", "grow", "restore", "stand", "mend", "rebuild"],
    cadence: "steady",
    sentenceStyle: "clear",
    intensity: 2,
    opening: [
      "Begin with difficulty, but leave visible room for improvement.",
      "Lead with resilience rather than despair.",
      "Frame the experience as challenged, not defeated."
    ],
    transition: [
      "Move from strain into possibility.",
      "Let effort feel meaningful and cumulative.",
      "Keep the language clear, grounded, and forward-looking."
    ],
    pressureFlavor: [
      "resilience under hardship",
      "meaningful recovery",
      "steady repair",
      "light held against difficulty"
    ],
    endingFlavor: [
      "end on restoration, resolve, or earned possibility",
      "close on what can still be rebuilt",
      "leave the sense that improvement remains believable"
    ]
  },
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
  },

  classic_fantasy: {
    framing: [
      "traditional adventure in a world of kingdoms, monsters, and old magic",
      "heroic travel through a setting shaped by castles, danger, and familiar mythic structures",
      "classic fantasy conflict where the world feels broad, dangerous, and full of storied possibility",
      "adventure rooted in recognizable fantasy institutions, powers, and threats"
    ],
    imagery: [
      "fortresses, roads, ruins, banners, monsters, and the ever-present promise of danger beyond the next border",
      "kingdoms under strain, old forests, ancient towers, and communities living in the shadow of larger threats",
      "magic, steel, legends, and wilderness pressing against the edges of civilization"
    ],
    stakes: [
      "the fate of communities, realms, and the people caught between them",
      "whether courage and action can still make a difference in a dangerous world",
      "what kind of future can be defended against forces larger than any one person"
    ],
    conflictLanguage: [
      "quests, rival powers, dangerous frontiers, and the burden of stepping into larger trouble",
      "adventure, peril, discovery, and the responsibility that comes with having the strength to act",
      "threats that demand both bravery and judgment from the people confronting them"
    ]
  },

  dark_fantasy: {
    framing: [
      "fantasy shaped by decay, corruption, and power that never arrives cleanly",
      "a failing world where magic, ambition, and survival are all edged with danger",
      "dark fantasy conflict where every answer carries stain, cost, or compromise",
      "adventure in a world already marked by decline and moral instability"
    ],
    imagery: [
      "rotting strongholds, corrupted wonders, dangerous rites, and systems held together by desperation",
      "blighted lands, compromised protectors, and beauty that feels inseparable from ruin",
      "old power curdled into something unstable, useful, and difficult to trust"
    ],
    stakes: [
      "what can still be preserved before corruption overtakes it",
      "how much compromise survival can demand before it becomes its own kind of loss",
      "whether power can still be used meaningfully inside a world already going wrong"
    ],
    conflictLanguage: [
      "corruption, sacrifice, failing orders, and strength purchased at unacceptable cost",
      "survival under rot, unstable power, and choices with no clean outcomes",
      "danger shaped as much by moral erosion as by direct threat"
    ]
  },

  feudal_eastern: {
    framing: [
      "conflict shaped by duty, hierarchy, spirits, and the weight of inherited order",
      "a world of ritual, honor, discipline, and power carried through tradition as much as force",
      "feudal tension where personal desire and social obligation rarely stay separate",
      "mythic struggle framed through lineage, structure, and disciplined violence"
    ],
    imagery: [
      "fortified estates, sacred sites, ancestral obligations, and landscapes where ritual and danger overlap",
      "courtly pressure, disciplined warfare, old vows, and spiritual forces woven through daily order",
      "shrines, banners, blades, and traditions powerful enough to guide or trap the people living inside them"
    ],
    stakes: [
      "whether duty preserves order or merely protects what should already have changed",
      "what must be sacrificed to uphold honor, lineage, or responsibility",
      "how much of the self survives under systems built long before the current generation arrived"
    ],
    conflictLanguage: [
      "obligation, inheritance, discipline, and the cost of preserving order",
      "loyalty, rebellion, ritual power, and choices shaped by station as much as desire",
      "the struggle between structure and selfhood inside a world that takes hierarchy seriously"
    ]
  },

  sci_fi: {
    framing: [
      "speculative conflict shaped by advanced systems, technological dependence, and the scale of the unknown",
      "science-fiction adventure where progress, control, and discovery all carry destabilizing consequences",
      "a futuristic setting where systems are powerful, fragile, and never fully understood by everyone living inside them",
      "exploration and pressure inside a world defined by technology, reach, and widening possibility"
    ],
    imagery: [
      "stations, ships, artificial environments, machine logic, and frontiers widened by technology rather than tamed by it",
      "advanced systems, failing infrastructure, sterile corridors, unknown signals, and distances large enough to dwarf certainty",
      "interfaces, engines, orbital routes, and environments where control always depends on systems that can still fail"
    ],
    stakes: [
      "whether progress expands freedom or only creates larger systems of dependence",
      "how humanity navigates power made possible by technologies it may not fully control",
      "what is risked when discovery outpaces ethics, stability, or understanding"
    ],
    conflictLanguage: [
      "systems failure, exploration, engineered power, and the dangers hidden inside advancement",
      "unknown frontiers, compromised infrastructure, and choices shaped by technological scale",
      "the pressure of living inside powerful systems that can solve problems and create them at the same time"
    ]
  },

  post_apocalyptic: {
    framing: [
      "survival and rebuilding in the ruins of a world that already failed once",
      "conflict shaped by collapse, scarcity, and the question of what deserves to be rebuilt",
      "a broken world where endurance and reconstruction exist side by side",
      "post-collapse struggle where the old world survives only as remains, warnings, and resources"
    ],
    imagery: [
      "shattered infrastructure, scavenged survival, improvised communities, and remnants too dangerous or useful to ignore",
      "ruined systems, exposed travel, fractured settlements, and the constant evidence of previous failure",
      "the remains of old abundance reduced to salvage, memory, and threat"
    ],
    stakes: [
      "what kind of world can be rebuilt from collapse without repeating it",
      "who gets protected when scarcity shapes every structure that remains",
      "whether survival alone is enough, or whether something better must still be attempted"
    ],
    conflictLanguage: [
      "rebuilding, salvage, faction pressure, scarcity, and the politics of survival",
      "collapse, adaptation, and the struggle to create meaning after systemic failure",
      "danger born from both the ruins of the old world and the ambitions of the new one"
    ]
  },

  cosmic_eldritch: {
    framing: [
      "conflict shaped by truths too large, strange, or destabilizing to fit cleanly inside ordinary understanding",
      "a setting where discovery widens dread, scale, and uncertainty instead of closing them down",
      "cosmic pressure driven by incomprehensible forces and the fragility of human perspective",
      "eldritch mystery where meaning becomes harder to hold the more the group truly learns"
    ],
    imagery: [
      "impossible structures, altered perception, hostile scale, and signs that reality is not arranged for human comfort",
      "vast forces, broken logic, unstable symbols, and environments that feel indifferent to ordinary meaning",
      "truths that distort scale, certainty, and the sense that the world can still be understood cleanly"
    ],
    stakes: [
      "how much truth can be endured before understanding itself becomes destabilizing",
      "whether meaning, identity, and agency can survive contact with something vastly larger than them",
      "what the group does when the world stops confirming the assumptions it was built on"
    ],
    conflictLanguage: [
      "incomprehension, destabilizing discovery, altered reality, and truths too large to contain safely",
      "pressure from forces that do not think in human terms and do not need human permission",
      "the struggle to keep hold of purpose inside a world suddenly too vast or too wrong"
    ]
  },
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

function resolveToneVoice(toneIds, toneSkins, toneVoiceMap) {
  const selected = toneIds
    .map(id => toneSkins.find(t => t.id === id))
    .filter(Boolean);

  if (selected.length === 0) return null;

  return {
    intensity: Math.max(...selected.map(t => t.profile.intensity)),
    darkness: Math.max(...selected.map(t => t.profile.darkness)),
    optimism: Math.min(...selected.map(t => t.profile.optimism)),

    humorAllowed: selected.every(t => t.constraints.humorAllowed),

    cadence: toneVoiceMap[selected[0].id]?.cadence || "neutral",
    sentenceStyle: toneVoiceMap[selected[0].id]?.sentenceStyle || "neutral"
  };
}


module.exports = {
  coreVoiceMap,
  systemVoiceMap,
  environmentVoiceMap,
  toneVoiceMap,
  genreVoiceMap,
  getVoiceEntry,
  collectVoiceLines,
  pickOne,
  resolveToneVoice
};