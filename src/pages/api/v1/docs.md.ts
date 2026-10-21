import type { APIRoute } from 'astro';
import { API_PATHS, apiResourcePath, PORTFOLIO_RESOURCES, RESOURCE_DOCS } from '../../../agent/api-resources';
import { markdownResponse, siteOrigin } from '../../../agent/endpoint';
import { AGENT_RESOURCES } from '../../../agent/llms';
import { PERSON_NAME } from '../../../data/profile';
import { LANGS } from '../../../i18n';

// Documentación para agentes de la API JSON y del servidor MCP.
export const GET: APIRoute = () => {
  const o = siteOrigin();
  const body = `# ${PERSON_NAME} — Portfolio API and MCP server

Everything on ${o} is published for AI agents in four equivalent forms: HTML pages, Markdown, a read-only JSON API and a remote MCP server. Content is available in ${LANGS.join(', ')} (Spanish is the default).

## Markdown

- Send \`Accept: text/markdown\` to any page URL (for example \`${o}/es/proyectos\`) to get its Markdown version, with \`Content-Type: text/markdown\` and an \`x-markdown-tokens\` estimate.
- Or request the \`.md\` URL directly: \`${o}/{lang}/{page}.md\`, where page is \`index\`, \`proyectos\` (projects), \`habilidades\` (skills), \`logros\` (achievements) or \`contacto\` (contact).
- \`${o}/llms.txt\` lists every page; \`${o}/llms-full.txt\` contains all of them.

## JSON API (no authentication)

Index: ${o}${API_PATHS.root} · OpenAPI 3.1: ${o}${API_PATHS.openapi} · Status: ${o}${API_PATHS.status} · CORS: \`*\`

| Endpoint | Content |
|---|---|
${PORTFOLIO_RESOURCES.map((resource) => `| \`GET ${apiResourcePath(resource)}\` | ${RESOURCE_DOCS[resource].description} |`).join('\n')}

\`POST ${API_PATHS.contact}\` is the endpoint of the website contact form. It needs a Cloudflare Turnstile token from the form, so agents should send messages with the MCP tool \`send_contact_message\` instead.

## MCP server (OAuth 2.1)

- Endpoint: \`${o}/mcp\` (Streamable HTTP, stateless, JSON responses).
- Server card: ${o}/.well-known/mcp/server-card.json
- Authorization: OAuth 2.1 with PKCE (S256). Protected resource metadata at ${o}/.well-known/oauth-protected-resource, authorization server metadata at ${o}/.well-known/oauth-authorization-server. Clients register with Client ID Metadata Documents or Dynamic Client Registration (\`${o}/oauth/register\`). No account is needed: the person approves the connection on a consent page with a CAPTCHA and gets an anonymous identity. See ${o}/auth.md.
- Scopes: \`portfolio:read\` (required for every call), \`contact:send\` (only for \`send_contact_message\`; requested by step-up with a 403 \`insufficient_scope\` challenge), \`offline_access\`.
- Tools: \`get_profile\`, \`list_projects\`, \`get_project\`, \`list_skills\`, \`list_achievements\`, \`get_contact_info\`, \`get_page_markdown\` (read-only) and \`send_contact_message\` (sends Daniel an email; at most 3 per hour per authorization). Always confirm a message with the user before sending it.
- Resources: every page as Markdown (\`${o}/{lang}/{page}.md\`).

## In the browser (WebMCP)

Pages register WebMCP tools when the browser supports them: \`get_page_content\`, \`get_portfolio_data\`, \`navigate_to_page\`, \`get_cv_link\` and \`set_accessibility_options\`. The contact form is exposed declaratively as \`send_contact_message\`; the person confirms by pressing the send button.

## Discovery

${AGENT_RESOURCES.map((r) => `- [${r.name}](${o}${r.path}): ${r.note}`).join('\n')}
`;
  return markdownResponse(body);
};
