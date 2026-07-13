import React from "react";

export default function StatusBadge({ value = "unknown" }) {
  const token = String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return <span className={`status-badge status-${token}`}>{String(value).replace(/_/g, " ")}</span>;
}
