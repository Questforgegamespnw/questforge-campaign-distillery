/**
 * Selects the top three scored candidates.
 * V1 version: simply returns the first three ranked entries.
 *
 * @param {Array<{id: string, score: number}>} scoredCandidates
 * @returns {{
 *   primary: {id: string, score: number} | null,
 *   adjacent: {id: string, score: number} | null,
 *   wildcard: {id: string, score: number} | null
 * }}
 */
function selectTopThree(scoredCandidates) {
  return {
    primary: scoredCandidates[0] || null,
    adjacent: scoredCandidates[1] || null,
    wildcard: scoredCandidates[2] || null
  };
}

module.exports = {
  selectTopThree
};