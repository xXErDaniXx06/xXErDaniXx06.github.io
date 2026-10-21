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

/** Ficheros estáticos en memoria, con la página 404 como el servidor de Cloudflare. */
export function memoryAssets(files: Record<string, { body: string; type: string }>): Fetcher {
  return {
    fetch: (input: RequestInfo | URL) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      const file = files[url.pathname];
      return Promise.resolve(
        file
          ? new Response(file.body, { headers: { 'Content-Type': file.type, 'Cache-Control': 'public, max-age=0' } })
          : new Response('<h1>404</h1>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }),
      );
    },
  } as unknown as Fetcher;
}

/** Limitador que deja pasar las primeras `allowed` peticiones. */
export function countingLimiter(allowed: number): RateLimit {
  let calls = 0;
  return { limit: () => Promise.resolve({ success: ++calls <= allowed }) };
}
