import type { APIRoute } from 'astro';
import { API_PATHS } from '../../agent/api-resources';
import { jsonResponse, siteOrigin } from '../../agent/endpoint';
import { MCP_SERVER, MCP_TOOLS, SERVER_CARD_PATH } from '../../agent/mcp-info';
import { PERSON_NAME } from '../../data/profile';

// Catálogo de IA (ARD / AI Catalog): todo lo que el sitio ofrece a los agentes.
// El Worker añade Access-Control-Allow-Origin: * y negocia application/ai-catalog+json.
export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const host = new URL(origin).host;
  const urn = (namespace: string, name: string) => `urn:air:${host}:${namespace}:${name}`;
  return jsonResponse({
    specVersion: '1.0',
    host: {
      displayName: PERSON_NAME,
      identifier: origin,
      documentationUrl: `${origin}/llms.txt`,
    },
    entries: [
      {
        identifier: urn('mcp', 'portfolio'),
        displayName: MCP_SERVER.title,
        type: 'application/mcp-server-card+json',
        url: `${origin}${SERVER_CARD_PATH}`,
        description: MCP_SERVER.description,
        tags: ['portfolio', 'resume', 'aerospace', 'software', 'contact'],
        capabilities: [...MCP_TOOLS],
        representativeQueries: [
          'what projects has Daniel Carrasco García worked on',
          "list Daniel Carrasco García's awards and achievements",
          'which programming languages and RF tools does Daniel Carrasco know',
          'send a message to Daniel Carrasco García about an internship',
        ],
      },
      {
        identifier: urn('api', 'portfolio'),
        displayName: `${PERSON_NAME} — Portfolio JSON API`,
        type: 'application/vnd.oai.openapi+json',
        url: `${origin}${API_PATHS.openapi}`,
        description:
          'Read-only JSON API (no authentication) with the profile, projects, skills, achievements and contact details in es, en and fr.',
        tags: ['portfolio', 'json', 'openapi'],
        representativeQueries: [
          "get Daniel Carrasco García's profile as JSON",
          "Daniel Carrasco García's projects in English",
          'contact details of Daniel Carrasco García',
        ],
      },
      {
        identifier: urn('skills', 'index'),
        displayName: `Agent skills for ${PERSON_NAME}'s portfolio`,
        type: 'application/json',
        url: `${origin}/.well-known/agent-skills/index.json`,
        description: 'Agent Skills discovery index: how to answer questions about Daniel and how to contact him.',
        tags: ['agent-skills'],
        representativeQueries: [
          'how should an agent answer questions about Daniel Carrasco García',
          'how can an agent contact Daniel Carrasco García',
        ],
      },
      {
        identifier: urn('docs', 'llms-txt'),
        displayName: `${PERSON_NAME} — llms.txt`,
        type: 'text/markdown',
        url: `${origin}/llms.txt`,
        description: 'Index of every portfolio page in Markdown, in Spanish, English and French.',
        tags: ['llms.txt', 'markdown'],
        representativeQueries: ['who is Daniel Carrasco García', 'summary of Daniel Carrasco García portfolio'],
      },
    ],
  });
};
