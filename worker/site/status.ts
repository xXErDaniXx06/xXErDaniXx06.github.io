import { jsonNoStore, PUBLIC_CORS } from '../http/headers';

/** GET /api/v1/status: estado de la web, la API JSON y el servidor MCP. */
export const serveStatus = (): Response =>
  jsonNoStore(
    { status: 'ok', time: new Date().toISOString(), services: { site: 'ok', api: 'ok', mcp: 'ok' } },
    200,
    PUBLIC_CORS,
  );
