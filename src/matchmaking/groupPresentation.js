function normalizeText(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1");
}

function uniqueByNormalized(values = []) {
  const seen = new Set();
  const output = [];

  for (const value of values) {
    const text = normalizeText(value);
    if (!text) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    output.push(text);
  }

  return output;
}

function humanizeId(value = "", namesById = {}) {
  return namesById[value] || value;
}

function pairKey(memberA, memberB) {
  return [memberA, memberB].sort().join("::");
}

function parsePairPrefix(message = "") {
  const match = /^Pair\s+([^/]+?)\s*\/\s*([^:]+?):\s*(.+)$/i.exec(
    normalizeText(message)
  );

  if (!match) return null;

  return {
    memberA: match[1].trim(),
    memberB: match[2].trim(),
    reason: match[3].trim()
  };
}

function parsePairReviewMessage(message = "") {
  const match = /^(.+?)\s*\/\s*(.+?)\s+should review their pairwise discussion points\.?$/i.exec(
    normalizeText(message)
  );

  if (!match) return null;

  return {
    memberA: match[1].trim(),
    memberB: match[2].trim()
  };
}

function categorizeDiscussionPoint(message = "") {
  const text = normalizeText(message);
  const lower = text.toLowerCase();

  if (
    lower.includes("collect or reconfirm") ||
    lower.includes("reconfirm profile") ||
    lower.includes("missing profile information") ||
    lower.includes("before making introductions")
  ) {
    return "reconfirm";
  }

  if (parsePairReviewMessage(text)) {
    return "pairReview";
  }

  return "sessionZero";
}

function consolidateReconfirmationPoints(points = []) {
  const relevant = uniqueByNormalized(points);
  if (relevant.length === 0) return [];

  return [
    "Collect or reconfirm missing profile information before introduction."
  ];
}

function buildDiscussionPresentation(points = [], namesById = {}) {
  const buckets = {
    reconfirm: [],
    sessionZero: []
  };
  const pairReviews = new Map();

  for (const raw of points) {
    const message = normalizeText(raw);
    if (!message) continue;

    const category = categorizeDiscussionPoint(message);

    if (category === "reconfirm") {
      buckets.reconfirm.push(message);
      continue;
    }

    if (category === "pairReview") {
      const parsed = parsePairReviewMessage(message);
      const key = pairKey(parsed.memberA, parsed.memberB);

      if (!pairReviews.has(key)) {
        pairReviews.set(key, {
          members: [
            humanizeId(parsed.memberA, namesById),
            humanizeId(parsed.memberB, namesById)
          ],
          points: []
        });
      }

      continue;
    }

    buckets.sessionZero.push(message);
  }

  return {
    reconfirm: consolidateReconfirmationPoints(buckets.reconfirm),
    pairReviews: [...pairReviews.values()].sort((a, b) =>
      a.members.join(" ").localeCompare(b.members.join(" "))
    ),
    sessionZero: uniqueByNormalized(buckets.sessionZero)
  };
}

function collapseGroupSizeConflicts(conflicts = [], namesById = {}) {
  const grouped = new Map();
  const passthrough = [];

  for (const conflict of conflicts) {
    const reason = normalizeText(conflict.reason);
    const match = /^(.+?) accepts no more than (\d+) players\.?$/i.exec(reason);

    if (!match) {
      passthrough.push(conflict);
      continue;
    }

    const maximum = Number(match[2]);
    const name = match[1].trim();
    const key = String(maximum);

    if (!grouped.has(key)) {
      grouped.set(key, {
        maximum,
        names: []
      });
    }

    grouped.get(key).names.push(humanizeId(name, namesById));
  }

  const collapsed = [...grouped.values()].map(({ maximum, names }) => ({
    dimension: "group_size",
    classification: "blocked_by_group_size",
    reason:
      names.length === 1
        ? `The selected group exceeds ${names[0]}'s maximum of ${maximum} players.`
        : `The selected group exceeds the maximum of ${maximum} players accepted by ${names.join(", ")}.`,
    evidence: []
  }));

  return [...collapsed, ...passthrough];
}

function buildBlockerPresentation(conflicts = [], namesById = {}) {
  const exactSeen = new Set();
  const deduplicated = [];

  for (const conflict of collapseGroupSizeConflicts(conflicts, namesById)) {
    const reason = normalizeText(conflict.reason);
    const key = [
      conflict.dimension || "",
      conflict.classification || "",
      reason.toLowerCase()
    ].join("|");

    if (exactSeen.has(key)) continue;
    exactSeen.add(key);

    deduplicated.push({
      ...conflict,
      reason
    });
  }

  const groupLevel = [];
  const pairGroups = new Map();

  for (const conflict of deduplicated) {
    const parsed = parsePairPrefix(conflict.reason);

    if (!parsed) {
      groupLevel.push(conflict);
      continue;
    }

    const dimension = conflict.dimension || "other";
    const key = pairKey(parsed.memberA, parsed.memberB);

    if (!pairGroups.has(dimension)) {
      pairGroups.set(dimension, new Map());
    }

    const dimensionPairs = pairGroups.get(dimension);

    if (!dimensionPairs.has(key)) {
      dimensionPairs.set(key, {
        members: [
          humanizeId(parsed.memberA, namesById),
          humanizeId(parsed.memberB, namesById)
        ],
        reasons: []
      });
    }

    const entry = dimensionPairs.get(key);
    entry.reasons = uniqueByNormalized([
      ...entry.reasons,
      parsed.reason
    ]);
  }

  return {
    groupLevel: uniqueByNormalized(groupLevel.map((item) => item.reason)),
    pairGroups: [...pairGroups.entries()]
      .map(([dimension, pairs]) => ({
        dimension,
        pairs: [...pairs.values()].sort((a, b) =>
          a.members.join(" ").localeCompare(b.members.join(" "))
        )
      }))
      .sort((a, b) => a.dimension.localeCompare(b.dimension))
  };
}

export {
  buildDiscussionPresentation,
  buildBlockerPresentation,
  normalizeText,
  uniqueByNormalized
};
