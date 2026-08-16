const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const ACCESS_TOKEN_KEY = "logson_access_token";
const REFRESH_TOKEN_KEY = "logson_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ access_token, refresh_token } = {}) {
  if (access_token) localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);

  if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function rawRequest(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  return { res, data };
}

// Only one refresh call is ever in flight at a time -- if five requests
// all hit a 401 at once, they share this promise instead of each firing
// their own POST /auth/refresh and racing to rotate the token.
let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = rawRequest("/auth/refresh", {
      method: "POST",
      body: { refresh_token: refreshToken },
      auth: false,
    })
      .then(({ res, data }) => {
        if (!res.ok) {
          clearTokens();
          return false;
        }
        setTokens(data);
        return true;
      })
      .catch(() => {
        clearTokens();
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

/**
 * Thin fetch wrapper for the Logson FastAPI backend.
 * - Automatically attaches the bearer access token when present.
 * - On a 401 from an authenticated request, transparently tries
 *   POST /auth/refresh once and retries the original request with the new
 *   access token -- so an expired access token doesn't sign the person out
 *   as long as their refresh token is still valid. Falls through to a
 *   normal ApiError if refreshing fails.
 * - Parses JSON responses and throws ApiError with the backend's `detail`
 *   message on non-2xx responses, so callers can show it directly.
 */
async function request(path, opts = {}) {
  const { auth = true } = opts;
  let { res, data } = await rawRequest(path, opts);

  const isAuthRoute = path.startsWith("/auth/");
  if (res.status === 401 && auth && !isAuthRoute) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      ({ res, data } = await rawRequest(path, opts));
    }
  }

  if (!res.ok) {
    const message = data?.detail || res.statusText || "Something went wrong";
    throw new ApiError(message, res.status, data);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export { ApiError, API_BASE_URL };