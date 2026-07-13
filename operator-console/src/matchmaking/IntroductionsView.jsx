import React, { useEffect, useMemo, useState } from "react";
import EmptyState from "../shared/EmptyState";
import StatusBadge from "../shared/StatusBadge";

const api = window.questforge;

function Preview({ record }) {
  if (!record) {
    return (
      <EmptyState title="Select an introduction">
        Review drafts, approvals, participant responses, and released contacts.
      </EmptyState>
    );
  }

  const preview = record.preview || {};
  const responses = record.participantResponses || {};
  const contactsVisible = ["contact_released", "introduced"].includes(
    record.status
  );

  return (
    <div className="detail-stack introduction-detail">
      <div className="detail-title">
        <div>
          <h2>{preview.title || "Introduction"}</h2>
          <div className="muted">{record.introductionId}</div>
        </div>
        <StatusBadge value={record.status} />
      </div>

      <div className="introduction-score-row">
        <div>
          <span>Compatibility</span>
          <strong>{record.sourceMatch?.score ?? "—"}</strong>
        </div>
        <div>
          <span>Confidence</span>
          <strong>{record.sourceMatch?.confidence || "—"}</strong>
        </div>
        <div>
          <span>Classification</span>
          <strong>
            {(record.sourceMatch?.classification || "—").replace(/_/g, " ")}
          </strong>
        </div>
      </div>

      <section className="privacy-callout">
        <strong>Controlled release:</strong> {preview.privacyNotice}
      </section>

      {(record.readiness?.errors || []).length > 0 && (
        <section className="readiness-blockers">
          <h3>Readiness blockers</h3>
          <ul>
            {record.readiness.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      {(record.readiness?.warnings || []).length > 0 && (
        <section>
          <h3>Operator review notes</h3>
          <ul>
            {record.readiness.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3>Sanitized participant preview</h3>
        <div className="introduction-members">
          {(preview.members || []).map((member) => (
            <article key={member.playerId}>
              <h4>{member.displayName}</h4>
              <p>{member.availabilitySummary || "No availability summary."}</p>
              <p>{member.systemSummary || "No system summary."}</p>
              <p>{member.tableStyleSummary || "No table-style summary."}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3>Participant approvals</h3>
        <div className="response-grid">
          {record.members.map((playerId) => {
            const member = preview.members?.find(
              (entry) => entry.playerId === playerId
            );
            const response = responses[playerId] || { status: "pending" };
            return (
              <div key={playerId} className="response-card">
                <strong>{member?.displayName || playerId}</strong>
                <StatusBadge value={response.status} />
                <small>{response.note || "No response note."}</small>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3>Contact release</h3>
        {!contactsVisible ? (
          <p className="muted">
            Contact references remain withheld until all approvals and current
            consent checks pass.
          </p>
        ) : (
          <div className="released-contact-grid">
            {Object.entries(record.releasedContacts || {}).map(
              ([playerId, contact]) => (
                <div key={playerId}>
                  <strong>{contact.displayName}</strong>
                  <span>{contact.contact}</span>
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section>
        <h3>Audit history</h3>
        <ol className="history-list">
          {(record.history || []).slice().reverse().map((entry, index) => (
            <li key={`${entry.timestamp}-${index}`}>
              <strong>{entry.event.replace(/_/g, " ")}</strong>
              <span>{entry.actor} · {entry.timestamp}</span>
              {entry.note && <p>{entry.note}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default function IntroductionsView({
  records,
  selectedId,
  onSelect,
  detail,
  onRefresh
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const record = detail?.record || null;

  async function act(fn) {
    if (!record) return;
    setBusy(true);
    setMessage("");
    try {
      await fn();
      await onRefresh(record.introductionId);
      setMessage("Introduction record updated.");
    } catch (error) {
      setMessage(error.message || String(error));
    } finally {
      setBusy(false);
    }
  }

  const actions = useMemo(() => {
    if (!record) return null;

    if (record.status === "awaiting_operator_approval") {
      return (
        <div className="button-row">
          <button
            className="primary"
            disabled={busy}
            onClick={() => act(() =>
              api.approveIntroduction(record.introductionId, "")
            )}
          >
            Approve for Participant Review
          </button>
          <button
            className="danger"
            disabled={busy}
            onClick={() => act(() =>
              api.declineIntroduction(
                record.introductionId,
                "Operator declined the introduction."
              )
            )}
          >
            Decline Draft
          </button>
        </div>
      );
    }

    if (record.status === "awaiting_participant_consent") {
      return (
        <div className="participant-action-stack">
          {record.members.map((playerId) => {
            const member = record.preview?.members?.find(
              (entry) => entry.playerId === playerId
            );
            const status =
              record.participantResponses?.[playerId]?.status || "pending";

            if (status !== "pending") return null;

            return (
              <div key={playerId} className="participant-action-row">
                <strong>{member?.displayName || playerId}</strong>
                <button
                  disabled={busy}
                  onClick={() => act(() =>
                    api.recordIntroductionParticipantResponse(
                      record.introductionId,
                      playerId,
                      "approved",
                      ""
                    )
                  )}
                >
                  Record Approval
                </button>
                <button
                  className="danger"
                  disabled={busy}
                  onClick={() => act(() =>
                    api.recordIntroductionParticipantResponse(
                      record.introductionId,
                      playerId,
                      "declined",
                      ""
                    )
                  )}
                >
                  Record Decline
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    if (record.status === "approved") {
      return (
        <button
          className="primary"
          disabled={busy}
          onClick={() => act(() =>
            api.releaseIntroductionContacts(record.introductionId)
          )}
        >
          Release Contact References
        </button>
      );
    }

    if (record.status === "contact_released") {
      return (
        <button
          className="primary"
          disabled={busy}
          onClick={() => act(() =>
            api.completeIntroduction(record.introductionId)
          )}
        >
          Mark Introduction Complete
        </button>
      );
    }

    if (["introduced", "declined"].includes(record.status)) {
      return (
        <button
          disabled={busy}
          onClick={() => act(() =>
            api.archiveIntroduction(record.introductionId)
          )}
        >
          Archive Record
        </button>
      );
    }

    return null;
  }, [record, busy]);

  return (
    <div className="split-view introductions-view">
      <section className="list-panel">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Controlled handoffs</div>
            <h2>Introductions</h2>
          </div>
          <button disabled={busy} onClick={() => onRefresh()}>
            Refresh
          </button>
        </div>

        {records.length === 0 ? (
          <EmptyState title="No introduction records">
            Create a draft from an eligible pair or group result.
          </EmptyState>
        ) : (
          records.map((entry) => (
            <button
              key={entry.introductionId}
              className={`record-row ${
                selectedId === entry.introductionId ? "selected" : ""
              }`}
              onClick={() => onSelect(entry.introductionId)}
            >
              <div>
                <strong>{entry.members.join(" + ")}</strong>
                <span>{entry.matchType} · {entry.classification.replace(/_/g, " ")}</span>
              </div>
              <div className="record-meta">
                <StatusBadge value={entry.status} />
                <strong>{entry.score ?? "—"}</strong>
              </div>
            </button>
          ))
        )}
      </section>

      <aside className="detail-panel">
        {actions && <div className="introduction-actions">{actions}</div>}
        {message && <div className="notice">{message}</div>}
        <Preview record={record} />
      </aside>
    </div>
  );
}
