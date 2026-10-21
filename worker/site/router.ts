// Todo lo que no es OAuth ni MCP: documentos de descubrimiento, directorio de Web Bot
// Auth, estado del servicio y la web estática.

import { DIRECTORY_PATH } from '../security/web-bot-auth';
import type { Services } from '../services';
import { isDiscoveryDocument, serveDiscoveryDocument } from './discovery-documents';
import { serveStaticSite } from './static-site';
import { serveStatus } from './status';

export const STATUS_PATH = '/api/v1/status';

export async function handleSite(request: Request, services: Services): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (isDiscoveryDocument(path)) return serveDiscoveryDocument(request, services.assets);
  if (path === DIRECTORY_PATH) return services.botAuth.directory(request);
  if (path === STATUS_PATH && (request.method === 'GET' || request.method === 'HEAD')) return serveStatus();
  return serveStaticSite(request, services.assets);
}
