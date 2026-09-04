export const API_BASE = "http://localhost:8000/api";

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Makes sure the browser has a csrftoken cookie, fetching one from the
 * backend if it doesn't. Needed for any POST made while a session is
 * already active (e.g. onboarding, right after signup/login). */
export async function ensureCsrfToken() {
  let token = getCookie("csrftoken");
  if (!token) {
    await fetch(`${API_BASE}/auth/csrf/`, { credentials: "include" });
    token = getCookie("csrftoken");
  }
  return token;
}

/** POST JSON to the API with session cookies + CSRF header attached.
 * Returns { ok, status, data } — never throws on a non-2xx response,
 * only on a genuine network failure. */
export async function apiPost(path, body) {
  const csrftoken = await ensureCsrfToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}