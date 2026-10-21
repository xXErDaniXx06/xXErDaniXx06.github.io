// Documentos de descubrimiento que se sirven con caché, ETag y CORS completos
// (MCP Server Card y catálogo de IA, según SEP-2127 y ARD).

import { LEGACY_SERVER_CARD_PATH, SERVER_CARD_PATH } from '../../src/agent/mcp-info';
import { methodNotAllowed } from '../http/headers';

interface DiscoveryDocument {
  /** Fichero estático con el contenido. */
  asset: string;
  contentType: string;
}

const DISCOVERY_DOCUMENTS: Readonly<Record<string, DiscoveryDocument>> = {
  [SERVER_CARD_PATH]: { asset: LEGACY_SERVER_CARD_PATH, contentType: 'application/mcp-server-card+json' },
  [LEGACY_SERVER_CARD_PATH]: { asset: LEGACY_SERVER_CARD_PATH, contentType: 'application/json' },
  '/.well-known/ai-catalog.json': { asset: '/.well-known/ai-catalog.json', contentType: 'application/ai-catalog+json' },
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
  'Access-Control-Expose-Headers': 'ETag',
};

export const isDiscoveryDocument = (pathname: string): boolean => pathname in DISCOVERY_DOCUMENTS;

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** Sirve un documento de descubrimiento desde los ficheros estáticos. */
export async function serveDiscoveryDocument(request: Request, assets: Fetcher): Promise<Response> {
  const url = new URL(request.url);
  const document = DISCOVERY_DOCUMENTS[url.pathname];
  if (!document) return new Response('Not Found', { status: 404 });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const response = methodNotAllowed('GET, HEAD, OPTIONS');
    for (const [name, value] of Object.entries(CORS)) response.headers.set(name, value);
    return response;
  }

  const asset = await assets.fetch(new Request(new URL(document.asset, url)));
  if (!asset.ok) return asset;
  const body = await asset.text();
  const etag = `"${(await sha256Hex(body)).slice(0, 32)}"`;
  const headers = {
    ...CORS,
    'Content-Type': document.contentType,
    'Cache-Control': 'public, max-age=3600',
    ETag: etag,
    'X-Content-Type-Options': 'nosniff',
  };
  if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers });
}
