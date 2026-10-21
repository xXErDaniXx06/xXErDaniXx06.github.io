import type { APIRoute } from 'astro';
import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js';
import { jsonResponse, siteOrigin } from '../../../agent/endpoint';
import { MCP_PATH, MCP_SERVER } from '../../../agent/mcp-info';
import { SOURCE_REPOSITORY } from '../../../data/profile';

// MCP Server Card. Cumple el formato aprobado en SEP-2127 (esquema v1: name, version,
// description, remotes…) y conserva los campos del borrador anterior (SEP-1649:
// serverInfo, transport, capabilities) que aún leen escáneres y clientes antiguos.
// El Worker la sirve aquí y en /mcp/server-card, la ubicación recomendada por SEP-2127.
export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const endpoint = `${origin}${MCP_PATH}`;
  return jsonResponse({
    $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
    name: MCP_SERVER.name,
    version: MCP_SERVER.version,
    title: MCP_SERVER.title,
    description: MCP_SERVER.description,
    websiteUrl: `${origin}/`,
    repository: { url: SOURCE_REPOSITORY, source: 'github' },
    remotes: [{ type: 'streamable-http', url: endpoint, supportedProtocolVersions: [...SUPPORTED_PROTOCOL_VERSIONS] }],

    // Campos del borrador SEP-1649
    serverInfo: { name: MCP_SERVER.name, title: MCP_SERVER.title, version: MCP_SERVER.version },
    url: endpoint,
    transport: { type: 'streamable-http', endpoint },
    protocolVersion: SUPPORTED_PROTOCOL_VERSIONS[0],
    capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
    authentication: {
      required: true,
      schemes: ['oauth2'],
      protectedResourceMetadata: `${origin}/.well-known/oauth-protected-resource/mcp`,
      documentation: `${origin}/auth.md`,
    },
    documentationUrl: `${origin}/api/v1/docs.md`,
  });
};
