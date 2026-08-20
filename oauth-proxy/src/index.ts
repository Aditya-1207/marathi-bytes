/**
 * Decap CMS GitHub OAuth proxy, deployed as a Cloudflare Worker.
 *
 * Decap's github backend can't talk to GitHub's OAuth endpoints directly from
 * the browser (that would expose the client secret), so it expects a small
 * server-side proxy at two routes:
 *
 *   GET /auth      - redirects the author to GitHub to approve access
 *   GET /callback   - exchanges the returned code for an access token, then
 *                     hands it back to the Decap CMS tab via postMessage
 *
 * See spec/spec.md Phase 2 and oauth-proxy/README.md for deployment steps.
 */

export interface Env {
  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  OAUTH_STATE_SECRET: string;
}

const STATE_TTL_MS = 10 * 60 * 1000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      return handleAuth(url, env);
    }
    if (url.pathname === "/callback") {
      return handleCallback(url, env);
    }
    return new Response("Not found", { status: 404 });
  },
};

async function handleAuth(url: URL, env: Env): Promise<Response> {
  const state = await createState(env.OAUTH_STATE_SECRET);

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", env.GITHUB_OAUTH_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", `${url.origin}/callback`);
  // public_repo (not the broader "repo" scope) is enough for a public repo,
  // and doesn't grant access to any private repos on the author's account.
  authorizeUrl.searchParams.set("scope", "public_repo");
  authorizeUrl.searchParams.set("state", state);

  return Response.redirect(authorizeUrl.toString(), 302);
}

async function handleCallback(url: URL, env: Env): Promise<Response> {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !(await verifyState(env.OAUTH_STATE_SECRET, state))) {
    return renderResult({
      error: "This login link expired or is invalid. Close this window and try logging in again.",
    });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    return renderResult({
      error: tokenData.error_description || tokenData.error || "GitHub did not return an access token.",
    });
  }

  return renderResult({ token: tokenData.access_token });
}

// Decap's github backend expects this exact handshake: the popup first pings
// the opener, waits for the opener's reply (which carries the opener's real
// origin), and only then posts the token back to that origin.
function renderResult({ token, error }: { token?: string; error?: string }): Response {
  const message = error
    ? `authorization:github:error:${JSON.stringify({ message: error })}`
    : `authorization:github:success:${JSON.stringify({ token, provider: "github" })}`;

  const html = `<!DOCTYPE html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(${JSON.stringify(message)}, e.origin);
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
    ${error ? `<p>${escapeHtml(error)}</p>` : ""}
  </body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// Cloudflare Workers are stateless between requests, so instead of storing
// the OAuth "state" value server-side, it's a self-verifying, time-limited
// HMAC token: timestamp + random nonce + signature. /callback rejects it if
// the signature doesn't match or it's older than STATE_TTL_MS.
async function createState(secret: string): Promise<string> {
  const payload = `${Date.now()}.${crypto.randomUUID()}`;
  return `${payload}.${await hmacSign(secret, payload)}`;
}

async function verifyState(secret: string, state: string | null): Promise<boolean> {
  if (!state) return false;
  const parts = state.split(".");
  if (parts.length !== 3) return false;
  const [ts, nonce, sig] = parts;
  const expectedSig = await hmacSign(secret, `${ts}.${nonce}`);
  if (expectedSig !== sig) return false;
  const age = Date.now() - Number(ts);
  return age >= 0 && age <= STATE_TTL_MS;
}

async function hmacSign(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64UrlEncode(new Uint8Array(sig));
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
