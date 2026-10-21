export const BASE = (process.env.E2E_BASE_URL ?? 'http://localhost:8787').replace(/\/$/, '');

export const get = (path: string, headers: Record<string, string> = {}) =>
  fetch(`${BASE}${path}`, { headers, redirect: 'manual' });
