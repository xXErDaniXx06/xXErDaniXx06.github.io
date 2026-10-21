import type { APIRoute } from 'astro';
import { jsonResponse, siteOrigin } from '../../agent/endpoint';

// Catálogo de APIs (RFC 9727) en formato linkset (RFC 9264).
// El Worker lo sirve como application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727".
export const GET: APIRoute = () => {
  const origin = siteOrigin();
  return jsonResponse(
    {
      linkset: [
        {
          anchor: `${origin}/api/v1/`,
          'service-desc': [{ href: `${origin}/api/v1/openapi.json`, type: 'application/vnd.oai.openapi+json' }],
          'service-doc': [{ href: `${origin}/api/v1/docs.md`, type: 'text/markdown' }],
          status: [{ href: `${origin}/api/v1/status`, type: 'application/json' }],
        },
        {
          anchor: `${origin}/mcp`,
          'service-desc': [{ href: `${origin}/.well-known/mcp/server-card.json`, type: 'application/json' }],
          'service-doc': [{ href: `${origin}/auth.md`, type: 'text/markdown' }],
          status: [{ href: `${origin}/api/v1/status`, type: 'application/json' }],
        },
      ],
    },
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  );
};
