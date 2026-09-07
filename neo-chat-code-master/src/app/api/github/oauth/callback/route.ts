import { NextResponse } from "next/server";

const STATE_COOKIE = "neo-chat-github-oauth-state";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] || char);
}

function callbackPage(payload: Record<string, unknown>, origin: string) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  const safeOrigin = escapeHtml(origin);
  return `<!doctype html><html><head><meta charset="utf-8"><title>GitHub connection</title></head><body><script>
const payload = ${json};
try {
  if (window.opener) window.opener.postMessage({ type: "neo-chat-github-oauth", ...payload }, ${JSON.stringify(origin)});
} finally {
  document.body.textContent = payload.error ? payload.error : "GitHub connected. You can close this window.";
  setTimeout(() => window.close(), 800);
}
</script><p>Completing GitHub connection…</p><p>${safeOrigin}</p></body></html>`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const state = requestUrl.searchParams.get("state") || "";
  const code = requestUrl.searchParams.get("code") || "";
  const expectedState = request.headers.get("cookie")?.match(
    new RegExp(`${STATE_COOKIE}=([^;]+)`),
  )?.[1] || "";
  const origin = requestUrl.origin;

  if (!state || !expectedState || state !== expectedState) {
    return new NextResponse(
      callbackPage({ error: "Invalid GitHub OAuth state." }, origin),
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  if (!code) {
    const error = requestUrl.searchParams.get("error_description") || "GitHub authorization was cancelled.";
    return new NextResponse(
      callbackPage({ error }, origin),
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return new NextResponse(
      callbackPage({ error: "GitHub OAuth is not configured on the server." }, origin),
      { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
      cache: "no-store",
    });

    const tokenData = (await tokenResponse.json()) as Record<string, unknown>;
    const token = typeof tokenData.access_token === "string" ? tokenData.access_token : "";
    if (!tokenResponse.ok || !token) {
      throw new Error(
        typeof tokenData.error_description === "string"
          ? tokenData.error_description
          : "GitHub did not return an access token.",
      );
    }

    const response = new NextResponse(
      callbackPage({ token }, origin),
      { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
    );
    response.cookies.set(STATE_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: requestUrl.protocol === "https:",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub OAuth failed.";
    return new NextResponse(
      callbackPage({ error: message }, origin),
      { status: 502, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }
}
