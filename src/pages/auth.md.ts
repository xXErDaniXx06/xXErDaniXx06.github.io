import type { APIRoute } from 'astro';
import { API_PATHS } from '../agent/api-resources';
import { markdownResponse, siteOrigin } from '../agent/endpoint';
import { MCP_MESSAGES_PER_HOUR, MCP_SCOPES, MCP_TOOLS } from '../agent/mcp-info';
import { PERSON_NAME } from '../data/profile';

// /auth.md (https://workos.com/auth-md): cómo obtiene un agente acceso al servidor MCP.
export const GET: APIRoute = () => {
  const o = siteOrigin();
  const host = new URL(o).host;
  const tools = MCP_TOOLS.map((tool) => `\`${tool}\``);
  const toolList = `${tools.slice(0, -1).join(', ')} and ${tools.at(-1)}`;
  const { read, contact, offlineAccess } = MCP_SCOPES;
  const body = `# auth.md

How AI agents get access to the MCP server of ${PERSON_NAME}'s portfolio.

- Resource server: \`${o}/mcp\` (MCP, Streamable HTTP)
- Authorization server: \`${o}\` (OAuth 2.1)
- Protected resource metadata: ${o}/.well-known/oauth-protected-resource and ${o}/.well-known/oauth-protected-resource/mcp
- Authorization server metadata: ${o}/.well-known/oauth-authorization-server

Everything this server returns is also public without authentication (HTML, Markdown, \`${o}/llms.txt\` and the JSON API at \`${o}${API_PATHS.root}\`). Authorization exists so that a person approves each agent before it can use the MCP server, and above all before it can send Daniel a message.

## Step 1 — Discover

An unauthenticated request to the MCP endpoint returns \`401\` with the metadata location:

\`\`\`http
POST /mcp HTTP/1.1
Host: ${host}

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="OAuth", resource_metadata="${o}/.well-known/oauth-protected-resource/mcp", scope="portfolio:read"
\`\`\`

The protected resource metadata names the authorization server (\`authorization_servers\`), whose RFC 8414 metadata lists the endpoints below and an \`agent_auth\` block.

## Step 2 — Pick a method

This service supports one identity type: **anonymous**. There are no user accounts and no API keys. The credential is an OAuth access token (\`credential_types_supported: ["access_token"]\`), bound to the resource \`${o}/mcp\`.

| Scope | Grants |
|---|---|
| \`${read}\` | Every read tool and resource of the MCP server. Required for any call. |
| \`${contact}\` | The \`send_contact_message\` tool (emails Daniel; at most ${MCP_MESSAGES_PER_HOUR} messages per hour per authorization). |
| \`${offlineAccess}\` | A refresh token, valid for 30 days. |

## Step 3 — Register

Register the agent as an OAuth client. Two options:

- **Client ID Metadata Document**: use the HTTPS URL of your client metadata document as \`client_id\` (\`client_id_metadata_document_supported: true\`). No registration call is needed.
- **Dynamic Client Registration** (RFC 7591) at \`register_uri\`:

\`\`\`http
POST /oauth/register HTTP/1.1
Host: ${host}
Content-Type: application/json
\`\`\`

\`\`\`json
{
  "client_name": "My agent",
  "redirect_uris": ["http://localhost:8976/callback"],
  "token_endpoint_auth_method": "none",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"]
}
\`\`\`

The response contains your \`client_id\`. Redirect URIs must use \`https\`, or \`http\` on a loopback address.

## Step 4 — Claim: a person approves the agent

The \`claim_uri\` is the authorization endpoint. Open it in the person's browser with PKCE (S256 only) and the resource:

\`\`\`http
GET /authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&code_challenge=CHALLENGE&code_challenge_method=S256&state=STATE&scope=portfolio%3Aread%20contact%3Asend&resource=${encodeURIComponent(`${o}/mcp`)} HTTP/1.1
Host: ${host}
\`\`\`

The page shows the agent's name, where the access will be sent and the requested permissions. The person completes a CAPTCHA (Cloudflare Turnstile) and approves or denies. On approval the browser is redirected to \`redirect_uri\` with \`code\`, \`state\` and \`iss\`. Each approval creates a new anonymous identity.

## Step 5 — Exchange the code

\`\`\`http
POST /oauth/token HTTP/1.1
Host: ${host}
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=CODE&redirect_uri=REDIRECT_URI&client_id=CLIENT_ID&code_verifier=VERIFIER&resource=${encodeURIComponent(`${o}/mcp`)}
\`\`\`

\`\`\`json
{ "access_token": "…", "token_type": "bearer", "expires_in": 3600, "refresh_token": "…", "scope": "portfolio:read contact:send" }
\`\`\`

Refresh with \`grant_type=refresh_token\`; refresh tokens rotate on use.

## Step 6 — Use the access_token

Send it as a bearer token to the MCP endpoint:

\`\`\`http
POST /mcp HTTP/1.1
Host: ${host}
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
Accept: application/json, text/event-stream

{"jsonrpc":"2.0","id":1,"method":"tools/list"}
\`\`\`

Tools: ${toolList}. Confirm every message with the person before calling \`send_contact_message\`.

## Errors

| Code | Where | What to do |
|---|---|---|
| \`401\` + \`WWW-Authenticate\` | \`/mcp\` | Missing or expired token: start at Step 1 or refresh the token. |
| \`403\` \`insufficient_scope\` | \`/mcp\` | The call needs more scopes (for example \`contact:send\`): repeat Step 4 with the scopes named in the challenge. |
| \`invalid_target\` | \`/authorize\`, \`/oauth/token\` | Use the resource \`${o}/mcp\`. |
| \`invalid_client\` | \`/oauth/token\` | Register again (Step 3); unused registrations expire after 90 days. |
| \`access_denied\` | redirect | The person denied the request. Do not retry without asking them. |
| Tool result with \`isError\` | \`send_contact_message\` | Message limit reached or sending unavailable: tell the person to write to the email in \`get_contact_info\`. |

## Revocation

Revoke tokens with RFC 7009 at the \`revocation_endpoint\` (\`${o}/oauth/token\`):

\`\`\`http
POST /oauth/token HTTP/1.1
Host: ${host}
Content-Type: application/x-www-form-urlencoded

token=ACCESS_OR_REFRESH_TOKEN&client_id=CLIENT_ID
\`\`\`
`;
  return markdownResponse(body);
};
