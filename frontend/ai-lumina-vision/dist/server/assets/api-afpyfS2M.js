const API_BASE = "http://localhost:8000";
async function apiFetch(path, init) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `API error ${res.status}`);
  }
  return res.json();
}
const api = {
  getReport: (role) => apiFetch(`/report?role=${encodeURIComponent(role)}`),
  getCompetitors: (role) => apiFetch(`/competitor-alerts?role=${encodeURIComponent(role)}`),
  downloadReport: (role) => `${API_BASE}/download-report?role=${encodeURIComponent(role)}`,
  clearCache: () => apiFetch("/cache", { method: "DELETE" }),
  health: () => apiFetch("/health"),
  chat: (body) => apiFetch("/chat", {
    method: "POST",
    body: JSON.stringify(body)
  })
};
export {
  api as a
};
