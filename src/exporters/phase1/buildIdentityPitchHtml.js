const {
  escapeHtml,
  formatDate
} = require("../shared/htmlUtils");

const DIRECTION_LABELS = {
  primary: "Primary Direction",
  adjacent: "Adjacent Direction",
  wildcard: "Wildcard Direction"
};

function renderDirectionPage(directionKey, pitch, pageNumber) {
  return `
  <section class="page direction-page">
    <header class="page-header">
      <span class="page-brand">QuestForge Games PNW</span>
      <span class="page-number">${pageNumber}</span>
    </header>

    <div class="direction-pill">${escapeHtml(
      DIRECTION_LABELS[directionKey]
    )}</div>
    <h1 class="direction-title">${escapeHtml(pitch.title)}</h1>

    <section class="promise-panel">
      <div class="section-label">Campaign Promise</div>
      <p>${escapeHtml(pitch.pitch)}</p>
    </section>

    <section class="content-section">
      <h2>About This Direction</h2>
      <p>${escapeHtml(pitch.about)}</p>
    </section>

    <section class="content-section">
      <h2>What Players Will Do</h2>
      <p>${escapeHtml(pitch.playersDo)}</p>
    </section>

    <aside class="hook-panel">
      <div class="section-label">Distinct Hook</div>
      <p>${escapeHtml(pitch.hook)}</p>
    </aside>

    <div class="footer-note">Phase 1 Identity Discovery - QuestForge Campaign Distillery</div>
  </section>`;
}

function buildIdentityPitchHtml(
  { identityPitches, metadata },
  options = {},
  cssText = ""
) {
  const preparedFor = options.clientName || "Your group";
  const reference =
    options.reference ||
    metadata.sourceFile ||
    "Campaign intake submission";
  const preparedDate = formatDate(options.preparedDate || new Date());

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QuestForge Campaign Identity Pitches</title>
  <style>${cssText}</style>
</head>
<body>
  <section class="page cover">
    <div class="cover-brand">QuestForge Games PNW</div>

    <div class="cover-center">
      <div class="cover-kicker">Phase 1 - Identity Discovery</div>
      <h1>Campaign Identity Pitches</h1>
      <p class="cover-subtitle">Three possible directions for the campaign you want to build together.</p>
      <div class="gold-rule"></div>
      <p class="cover-intro">These directions explore what your campaign could fundamentally be about, what kind of play it could emphasize, and what emotional promise it could offer. They are intentionally broad and do not yet establish a fixed setting, game system, or plot.</p>
    </div>

    <div class="cover-meta">
      <div><span class="meta-label">Prepared for</span><span class="meta-value">${escapeHtml(preparedFor)}</span></div>
      <div><span class="meta-label">Prepared on</span><span class="meta-value">${escapeHtml(preparedDate)}</span></div>
      <div><span class="meta-label">Reference</span><span class="meta-value">${escapeHtml(reference)}</span></div>
      <div><span class="meta-label">Directions</span><span class="meta-value">Primary / Adjacent / Wildcard</span></div>
    </div>

    <div class="footer-note">Prepared through QuestForge Campaign Distillery</div>
  </section>

  ${renderDirectionPage("primary", identityPitches.primary, 2)}
  ${renderDirectionPage("adjacent", identityPitches.adjacent, 3)}
  ${renderDirectionPage("wildcard", identityPitches.wildcard, 4)}

  <section class="page selection-page">
    <div class="selection-content">
      <div class="selection-kicker">Your next step</div>
      <h1>Which direction resonates most?</h1>
      <p class="selection-intro">There is no wrong answer. Choose the direction that feels closest to the campaign experience you want, then tell us what should be preserved, adjusted, or avoided as the concept moves into its next stage.</p>

      <div class="selection-grid">
        <div class="selection-card"><strong>1. Preferred direction</strong><p>Primary, Adjacent, or Wildcard - and what made it stand out.</p></div>
        <div class="selection-card"><strong>2. Favorite elements</strong><p>Call out themes, activities, tensions, or phrases you especially want to keep.</p></div>
        <div class="selection-card"><strong>3. Changes or boundaries</strong><p>Identify anything you want reduced, removed, softened, or reframed.</p></div>
        <div class="selection-card"><strong>4. Setting or system preferences</strong><p>Share any existing preferences, or say that you remain open to recommendations.</p></div>
        <div class="selection-card"><strong>5. Additional notes</strong><p>Include any new thoughts the three directions helped clarify.</p></div>
      </div>

      <p class="selection-closing">Your selection becomes the foundation for Phase 2: Campaign Concept Development, where the chosen identity is translated into a concrete setting situation, central conflict, recurring campaign engine, and meaningful player choices.</p>
    </div>

    <div class="footer-note">Phase 1 discovers what the campaign wants to be. Phase 2 decides what is actually happening and what the players can change.</div>
  </section>
</body>
</html>`;
}

module.exports = {
  DIRECTION_LABELS,
  renderDirectionPage,
  buildIdentityPitchHtml
};
