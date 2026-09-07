# GitHub MCP integration

Neo Chat includes a personal-use GitHub connector in the MCP market. It uses the official GitHub MCP remote endpoint (`https://api.githubcopilot.com/mcp/`) and stores the GitHub credential in Neo Chat's encrypted local secret store.

## GitHub OAuth App

Create an OAuth App in GitHub and configure its authorization callback URL to:

```text
https://YOUR_NEO_CHAT_HOST/api/github/oauth/callback
```

Set these server environment variables:

```text
GITHUB_OAUTH_CLIENT_ID=...
GITHUB_OAUTH_CLIENT_SECRET=...
GITHUB_OAUTH_SCOPES=repo,delete_repo,workflow,read:user,user:email
```

For local Docker Compose, put them in the deployment environment or `.env`; do not commit the client secret.

## What the connector does

Open **Plugin Market -> MCP -> GitHub MCP -> Connect GitHub**. Neo Chat opens GitHub OAuth in a popup. After authorization, the callback posts the access token to the originating Neo Chat window, the token is immediately stored as an encrypted local plugin secret, and the GitHub MCP server is installed automatically.

The AI then receives GitHub MCP tools discovered from the server. Depending on the granted GitHub scopes and the toolset exposed by the remote server, this can include repository reads/writes, code search, branches, commits, pull requests, issues, and other GitHub operations. GitHub remains the final authorization boundary.

## Security

The OAuth client secret remains server-side. The GitHub access token is not written to the URL. Neo Chat encrypts the local credential with its browser-local WebCrypto secret store. Disconnecting GitHub removes the installed GitHub MCP plugin and its local credential.

For personal use, broad repository scopes are enabled by default. If you do not need destructive repository operations, remove `delete_repo` from `GITHUB_OAUTH_SCOPES`.

## Important limitation

This connector is intentionally a **personal-use OAuth integration**. It does not implement multi-user server-side GitHub token storage. Each browser profile keeps its own encrypted GitHub credential. For a public multi-user deployment, use per-user OAuth sessions and server-side secret storage instead of sharing one credential.
