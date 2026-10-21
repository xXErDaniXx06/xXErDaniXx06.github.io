import type { APIRoute } from 'astro';
import { API_PATHS } from '../../agent/api-resources';
import { jsonResponse, siteOrigin } from '../../agent/endpoint';
import { LEGACY_SERVER_CARD_PATH, MCP_PATH } from '../../agent/mcp-info';

// Catálogo de APIs (RFC 9727) en formato linkset (RFC 9264).
// El Worker lo sirve como application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727".
export const GET: APIRoute = () => {
  const origin = siteOrigin();
  return jsonResponse(
    {
      linkset: [
        {
          anchor: `${origin}${API_PATHS.root}`,
          'service-desc': [{ href: `${origin}${API_PATHS.openapi}`, type: 'application/vnd.oai.openapi+json' }],
          'service-doc': [{ href: `${origin}${API_PATHS.docs}`, type: 'text/markdown' }],
          status: [{ href: `${origin}${API_PATHS.status}`, type: 'application/json' }],
        },
        {
          anchor: `${origin}${MCP_PATH}`,
          'service-desc': [{ href: `${origin}${LEGACY_SERVER_CARD_PATH}`, type: 'application/json' }],
          'service-doc': [{ href: `${origin}/auth.md`, type: 'text/markdown' }],
          status: [{ href: `${origin}${API_PATHS.status}`, type: 'application/json' }],
        },
      ],
    },
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  );
};
