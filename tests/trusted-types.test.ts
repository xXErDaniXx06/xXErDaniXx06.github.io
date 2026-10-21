import { afterEach, describe, expect, it, vi } from 'vitest';
import { TURNSTILE_SCRIPT } from '../src/config/turnstile';

describe('política de Trusted Types', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('solo admite el script de Turnstile y lo pasa por la política', async () => {
    const created: string[] = [];
    vi.stubGlobal('window', {
      trustedTypes: {
        createPolicy: (name: string, rules: { createScriptURL: (url: string) => string }) => {
          created.push(name);
          return { createScriptURL: (url: string) => `trusted:${rules.createScriptURL(url)}` };
        },
      },
    });
    const { trustedScriptUrl, TRUSTED_TYPES_POLICY } = await import('../src/scripts/trusted-types');
    expect(trustedScriptUrl(`${TURNSTILE_SCRIPT}?render=explicit`)).toBe(`trusted:${TURNSTILE_SCRIPT}?render=explicit`);
    expect(created).toEqual([TRUSTED_TYPES_POLICY]);
    expect(() => trustedScriptUrl('https://evil.example/x.js')).toThrow(TypeError);
  });

  it('sin Trusted Types devuelve la URL tal cual', async () => {
    vi.stubGlobal('window', {});
    const { trustedScriptUrl } = await import('../src/scripts/trusted-types');
    expect(trustedScriptUrl(TURNSTILE_SCRIPT)).toBe(TURNSTILE_SCRIPT);
  });
});
