// Todo lo que no es OAuth ni MCP: documentos de descubrimiento, directorio de Web Bot
// Auth, estado del servicio, security.txt y la web estática.

import { API_PATHS } from '../../src/agent/api-resources';
import { SECURITY_TXT_PATH } from '../../src/agent/security-txt';
import { DIRECTORY_PATH } from '../security/web-bot-auth';
import type { Services } from '../services';
import { isDiscoveryDocument, serveDiscoveryDocument } from './discovery-documents';
import { serveSecurityTxt } from './security-txt';
import { serveStaticSite } from './static-site';
import { serveStatus } from './status';

export async function handleSite(request: Request, services: Services): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (isDiscoveryDocument(path)) return serveDiscoveryDocument(request, services.assets);
  if (path === DIRECTORY_PATH) return services.botAuth.directory(request);
  const read = request.method === 'GET' || request.method === 'HEAD';
  if (path === API_PATHS.status && read) return serveStatus();
  if (path === SECURITY_TXT_PATH && read) return serveSecurityTxt(request, services.origin);
  return serveStaticSite(request, services.assets);
}
