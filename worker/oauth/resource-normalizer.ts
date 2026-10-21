// Peticiones de autorización y de token para el origen → para el servidor MCP, el único
// recurso protegido. Así funcionan los clientes que piden el token para la web entera.

import { normalizeResource } from './metadata';

function normalizeAll(params: URLSearchParams, origin: string): boolean {
  if (!params.has('resource')) return false;
  const resources = params.getAll('resource').map((resource) => normalizeResource(resource, origin));
  params.delete('resource');
  for (const resource of resources) params.append('resource', resource);
  return true;
}

export async function withNormalizedResource(request: Request, origin: string): Promise<Request> {
  const url = new URL(request.url);
  if (url.pathname === '/authorize' && normalizeAll(url.searchParams, origin)) {
    return new Request(url, request);
  }
  const isForm = (request.headers.get('Content-Type') ?? '').includes('application/x-www-form-urlencoded');
  if (url.pathname === '/oauth/token' && request.method === 'POST' && isForm) {
    const form = new URLSearchParams(await request.clone().text());
    if (!normalizeAll(form, origin)) return request;
    const headers = new Headers(request.headers);
    headers.delete('Content-Length');
    return new Request(url, { method: 'POST', headers, body: form.toString() });
  }
  return request;
}
