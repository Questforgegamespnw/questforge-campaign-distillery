/**
 * Scores a list of candidates against normalized intake.
 * @param {object} intake
 * @param {Array} candidates
 * @param {string} tagCategory - e.g. "toneTags", "playstyleTags"
 * @returns {Array<{id: string, score: number}>}
 */
function scoreCandidates(intake, candidates, tagCategory) {
  const intakeTags = intake[tagCategory] || [];

  return candidates.map((candidate) => {
    let score = 0;

    // Positive matches
    intakeTags.forEach(({ tag, weight }) => {
      if (candidate.tags && candidate.tags.includes(tag)) {
        score += weight;
      }
    });

    // Avoidance penalties
    (intake.avoidanceTags || []).forEach(({ tag, weight }) => {
      if (candidate.tags && candidate.tags.includes(tag)) {
        score -= weight * 2;
      }
    });

    return {
      id: candidate.id,
      score
    };
  }).sort((a, b) => b.score - a.score);
}

module.exports = {
  scoreCandidates
};