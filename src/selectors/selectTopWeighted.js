/**
 * Selects the top N weighted candidates.
 *
 * @param {Array<{id: string, weight: number}>} candidates
 * @param {number} count
 * @returns {Array<{id: string, weight: number}>}
 */
function selectTopWeighted(candidates, count = 3) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return [];
  }

  return [...candidates]
    .sort((a, b) => {
      const weightA = a.weight || 0;
      const weightB = b.weight || 0;
      return weightB - weightA;
    })
    .slice(0, count);
}

module.exports = {
  selectTopWeighted
};