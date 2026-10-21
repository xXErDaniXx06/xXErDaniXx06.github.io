// Dobles de prueba de los bindings de Cloudflare.

/** KV en memoria. */
export class MemoryKv {
  readonly data = new Map<string, string>();
  readonly ttl = new Map<string, number | undefined>();

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.data.get(key) ?? null);
  }

  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    this.data.set(key, value);
    this.ttl.set(key, options?.expirationTtl);
    return Promise.resolve();
  }

  asKv(): KVNamespace {
    return this as unknown as KVNamespace;
  }
}

/** Huella de un contenido, como el ETag del servidor de ficheros. */
const fingerprint = (body: string): string =>
  `"${[...body].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7).toString(16)}"`;

/**
 * Ficheros estáticos en memoria que responden como el servidor de Cloudflare: página 404,
 * ETag, 304 si coincide If-None-Match y HEAD sin cuerpo.
 */
export function memoryAssets(files: Record<string, { body: string; type: string }>): Fetcher {
  return {
    fetch: (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const file = files[new URL(request.url).pathname];
      const head = request.method === 'HEAD';
      if (!file) {
        return Promise.resolve(
          new Response(head ? null : '<h1>404</h1>', {
            status: 404,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          }),
        );
      }
      const headers = { 'Content-Type': file.type, 'Cache-Control': 'public, max-age=0', ETag: fingerprint(file.body) };
      if (request.headers.get('If-None-Match') === headers.ETag) {
        return Promise.resolve(new Response(null, { status: 304, headers }));
      }
      return Promise.resolve(new Response(head ? null : file.body, { headers }));
    },
  } as unknown as Fetcher;
}

/** Limitador que deja pasar las primeras `allowed` peticiones. */
export function countingLimiter(allowed: number): RateLimit {
  let calls = 0;
  return { limit: () => Promise.resolve({ success: ++calls <= allowed }) };
}
