// Trusted Types: la política de seguridad exige que las URL de scripts pasen por una
// política con nombre. Esta solo admite el script de Cloudflare Turnstile.

import { TURNSTILE_SCRIPT } from '../config/turnstile';

interface TrustedTypePolicy {
  createScriptURL(url: string): string;
}

interface TrustedTypePolicyFactory {
  createPolicy(name: string, rules: { createScriptURL: (url: string) => string }): TrustedTypePolicy;
}

declare global {
  interface Window {
    trustedTypes?: TrustedTypePolicyFactory;
  }
}

/** Nombre de la política (también en la directiva trusted-types de astro.config.mjs). */
export const TRUSTED_TYPES_POLICY = 'portfolio';

let policy: TrustedTypePolicy | undefined;

/** URL de script aceptada por Trusted Types; lanza un error si no es la de Turnstile. */
export function trustedScriptUrl(url: string): string {
  if (!url.startsWith(`${TURNSTILE_SCRIPT}?`) && url !== TURNSTILE_SCRIPT) {
    throw new TypeError(`URL de script no permitida: ${url}`);
  }
  if (!window.trustedTypes) return url;
  policy ??= window.trustedTypes.createPolicy(TRUSTED_TYPES_POLICY, {
    createScriptURL: (value) => {
      if (value.startsWith(TURNSTILE_SCRIPT)) return value;
      throw new TypeError(`URL de script no permitida: ${value}`);
    },
  });
  return policy.createScriptURL(url);
}
