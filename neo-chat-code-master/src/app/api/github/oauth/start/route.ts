import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

const STATE_COOKIE = "neo-chat-github-oauth-state";
const DEFAULT_SCOPES = "repo,delete_repo,workflow,read:user,user:email";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth is not configured. Set GITHUB_OAUTH_CLIENT_ID." },
      { status: 503 },
    );
  }

  const requestUrl = new URL(request.url);
  const state = randomBytes(32).toString("hex");
  const callbackUrl = new URL("/api/github/oauth/callback", requestUrl.origin);
  const scope =
    process.env.GITHUB_OAUTH_SCOPES?.trim() || DEFAULT_SCOPES;

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl.toString());
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: requestUrl.protocol === "https:",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
