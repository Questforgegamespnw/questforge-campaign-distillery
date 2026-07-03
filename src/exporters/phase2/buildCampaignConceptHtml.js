const {
  escapeHtml,
  formatDate
} = require("../shared/htmlUtils");

const VARIANT_LABELS = {
  core_interpretation: "Core Interpretation",
  alternate_situation: "Alternate Situation",
  distinctive_interpretation: "Distinctive Interpretation"
};

function pageHeader(pageNumber, conceptTitle = "") {
  return `
    <header class="page-header">
      <span class="page-brand">QuestForge Games PNW</span>
      <span class="page-context">${escapeHtml(conceptTitle)}</span>
      <span class="page-number">${pageNumber}</span>
    </header>`;
}

function renderParagraphSection(
  title,
  text,
  className = "content-section"
) {
  return `
    <section class="${className}">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(text)}</p>
    </section>`;
}

function renderFactionCards(factions) {
  return factions
    .map(
      (faction) => `
      <article class="faction-card">
        <h3>${escapeHtml(faction.name)}</h3>
        <p class="faction-role">${escapeHtml(faction.role)}</p>
        <div class="faction-row">
          <strong>What they want</strong>
          <p>${escapeHtml(faction.wants)}</p>
        </div>
        <div class="faction-row">
          <strong>Pressure on the players</strong>
          <p>${escapeHtml(faction.pressureOnPlayers)}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderChoiceCards(choices) {
  return choices
    .map(
      (choice, index) => `
      <article class="choice-card">
        <div class="choice-number">${index + 1}</div>
        <div>
          <h3>${escapeHtml(choice.choice)}</h3>
          <p>${escapeHtml(choice.whatItChanges)}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderConceptPages(
  concept,
  conceptIndex,
  startPage,
  conceptCount
) {
  const variantLabel =
    VARIANT_LABELS[concept.variantType] || concept.variantType;
  const conceptNumber = conceptIndex + 1;

  return `
  <section class="page concept-page concept-overview-page">
    ${pageHeader(startPage, `Concept ${conceptNumber}`)}
    <div class="variant-pill">Concept ${conceptNumber} - ${escapeHtml(
      variantLabel
    )}</div>
    <h1 class="concept-title">${escapeHtml(concept.conceptTitle)}</h1>

    <section class="premise-panel">
      <div class="section-label">One-Sentence Premise</div>
      <p>${escapeHtml(concept.oneSentencePremise)}</p>
    </section>

    ${renderParagraphSection("Campaign Pitch", concept.campaignPitch)}

    <div class="two-column">
      ${renderParagraphSection(
        "Starting Situation",
        concept.startingSituation,
        "content-section compact-section"
      )}
      ${renderParagraphSection(
        "Central Conflict",
        concept.centralConflict,
        "content-section compact-section"
      )}
    </div>

    <aside class="hook-panel">
      <div class="section-label">Opening Hook</div>
      <p>${escapeHtml(concept.hook)}</p>
    </aside>

    <div class="footer-note">Phase 2 Campaign Concept Development - Concept ${conceptNumber} of ${conceptCount}</div>
  </section>

  <section class="page concept-page concept-engine-page">
    ${pageHeader(startPage + 1, concept.conceptTitle)}
    <div class="page-kicker">How the campaign sustains play</div>
    <h1 class="section-page-title">Campaign Engine & Active Forces</h1>

    ${renderParagraphSection(
      "What Players Will Do",
      concept.playersDo,
      "content-section featured-section"
    )}
    ${renderParagraphSection(
      "Recurring Campaign Engine",
      concept.recurringCampaignEngine,
      "content-section engine-section"
    )}
    ${renderParagraphSection(
      "Why This Is Happening Now",
      concept.whyNow
    )}

    <section class="factions-section">
      <h2>Factions & Forces</h2>
      <div class="faction-grid">${renderFactionCards(
        concept.factionsOrForces
      )}</div>
    </section>

    <div class="footer-note">The forces below create pressure, opportunity, and competing directions - not a fixed plot.</div>
  </section>

  <section class="page concept-page concept-choice-page">
    ${pageHeader(startPage + 2, concept.conceptTitle)}
    <div class="page-kicker">Where player decisions matter</div>
    <h1 class="section-page-title">Escalation, Choices & Implementation</h1>

    ${renderParagraphSection(
      "Escalation",
      concept.escalation,
      "content-section escalation-section"
    )}

    <section class="distinctive-panel">
      <div class="section-label">Distinctive Element</div>
      <p>${escapeHtml(concept.distinctiveElement)}</p>
    </section>

    <section class="choices-section">
      <h2>Meaningful Choices</h2>
      <div class="choice-grid">${renderChoiceCards(
        concept.meaningfulChoices
      )}</div>
    </section>

    <div class="implementation-grid">
      <section class="implementation-card">
        <h2>System Implementation Notes</h2>
        <p>${escapeHtml(
          concept.systemImplementationNotes ||
            "No system has been fixed yet. This concept can remain system-flexible until the next decision stage."
        )}</p>
      </section>
      <section class="implementation-card">
        <h2>Setting Implementation Notes</h2>
        <p>${escapeHtml(
          concept.settingImplementationNotes ||
            "No specific setting has been fixed yet. The concept can be adapted without changing its core identity."
        )}</p>
      </section>
    </div>

    <div class="footer-note">Player choices determine alliances, institutions, and long-term direction.</div>
  </section>`;
}

function buildComparisonCards(concepts) {
  return concepts
    .map((concept, index) => {
      const label =
        VARIANT_LABELS[concept.variantType] || concept.variantType;

      return `
      <article class="comparison-card">
        <div class="comparison-number">${index + 1}</div>
        <div class="comparison-copy">
          <span class="comparison-label">${escapeHtml(label)}</span>
          <h2>${escapeHtml(concept.conceptTitle)}</h2>
          <p>${escapeHtml(concept.oneSentencePremise)}</p>
        </div>
      </article>`;
    })
    .join("");
}

function buildCampaignConceptHtml(
  data,
  options = {},
  cssText = ""
) {
  const identity = data.identitySummary || {};
  const preparedFor = options.clientName || "Your group";
  const reference =
    options.reference ||
    data.submissionId ||
    "Campaign concept package";
  const preparedDate = formatDate(
    options.preparedDate || new Date()
  );
  const identityTitle =
    identity.identityTitle || "Selected Campaign Identity";
  const identityPitch =
    identity.identityPitch || identity.corePromise || "";

  let pageNumber = 3;
  const conceptPages = data.concepts
    .map((concept, index) => {
      const html = renderConceptPages(
        concept,
        index,
        pageNumber,
        data.concepts.length
      );
      pageNumber += 3;
      return html;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QuestForge Campaign Concept Pitches</title>
  <style>${cssText}</style>
</head>
<body>
  <section class="page cover">
    <div class="cover-brand">QuestForge Games PNW</div>

    <div class="cover-center">
      <div class="cover-kicker">Phase 2 - Campaign Concept Development</div>
      <h1>Campaign Concept Pitches</h1>
      <p class="cover-subtitle">Three concrete, playable interpretations of the campaign identity you selected.</p>
      <div class="gold-rule"></div>
      <p class="cover-intro">Each concept preserves the same thematic promise while changing the situation, active forces, recurring campaign engine, and choices available to the players. These are foundations for an ongoing campaign, not predetermined plots.</p>
    </div>

    <div class="cover-meta">
      <div><span class="meta-label">Prepared for</span><span class="meta-value">${escapeHtml(preparedFor)}</span></div>
      <div><span class="meta-label">Prepared on</span><span class="meta-value">${escapeHtml(preparedDate)}</span></div>
      <div><span class="meta-label">Reference</span><span class="meta-value">${escapeHtml(reference)}</span></div>
      <div><span class="meta-label">Selected identity</span><span class="meta-value">${escapeHtml(identityTitle)}</span></div>
    </div>

    <div class="footer-note">Prepared through QuestForge Campaign Distillery</div>
  </section>

  <section class="page guide-page">
    ${pageHeader(2, "Reading Guide")}
    <div class="page-kicker">The shared foundation</div>
    <h1 class="section-page-title">How to Read These Concepts</h1>

    <section class="identity-panel">
      <div class="section-label">Selected Campaign Identity</div>
      <h2>${escapeHtml(identityTitle)}</h2>
      <p>${escapeHtml(identityPitch)}</p>
    </section>

    <div class="guide-grid">
      <article class="guide-card"><span>1</span><h3>Core Interpretation</h3><p>The clearest and most direct implementation of the selected identity.</p></article>
      <article class="guide-card"><span>2</span><h3>Alternate Situation</h3><p>A different starting crisis, setting condition, or campaign structure built from the same identity.</p></article>
      <article class="guide-card"><span>3</span><h3>Distinctive Interpretation</h3><p>A bolder but still compatible feature that gives the campaign a memorable signature.</p></article>
    </div>

    <section class="reading-note">
      <h2>What you are choosing</h2>
      <p>You are not choosing every future event. You are selecting the campaign situation and recurring structure that feels most exciting to explore. Factions, escalation, and choices are included to show how the concept can sustain play while leaving the long-term outcome in the players' hands.</p>
    </section>

    <div class="footer-note">All three concepts preserve the approved Phase 1 identity.</div>
  </section>

  ${conceptPages}

  <section class="page selection-page">
    ${pageHeader(pageNumber, "Concept Selection")}
    <div class="selection-kicker">Your next decision</div>
    <h1>Which campaign concept should move forward?</h1>
    <p class="selection-intro">Choose the concept that gives you the strongest sense of a campaign you would be excited to play. You may also combine specific elements from another concept, as long as the final direction remains clear.</p>

    <div class="comparison-grid">${buildComparisonCards(
      data.concepts
    )}</div>

    <section class="reply-panel">
      <h2>When replying, please include:</h2>
      <div class="reply-grid">
        <div><strong>Preferred concept</strong><span>Which concept should become the working campaign foundation?</span></div>
        <div><strong>Elements to preserve</strong><span>Which factions, situations, activities, or choices are especially important?</span></div>
        <div><strong>Requested changes</strong><span>What should be adjusted, reduced, replaced, or clarified?</span></div>
        <div><strong>Elements to borrow</strong><span>Should anything from another concept be carried into the selected direction?</span></div>
        <div><strong>System and setting decisions</strong><span>Confirm existing preferences or remain open to recommendations.</span></div>
      </div>
    </section>

    <p class="selection-closing">Once a concept is selected, QuestForge can refine it into the working campaign foundation, confirm the game system and setting implementation, and develop the material needed to begin play.</p>

    <div class="footer-note">Phase 2 decides what is happening and what the players can change.</div>
  </section>
</body>
</html>`;
}

module.exports = {
  VARIANT_LABELS,
  pageHeader,
  renderParagraphSection,
  renderFactionCards,
  renderChoiceCards,
  renderConceptPages,
  buildComparisonCards,
  buildCampaignConceptHtml
};
