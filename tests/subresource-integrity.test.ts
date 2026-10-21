import { describe, expect, it } from 'vitest';
import { addScriptSources } from '../scripts/subresource-integrity.mjs';

describe('integridad de los scripts', () => {
  it('añade los hashes a script-src sin duplicarlos ni tocar otras directivas', () => {
    const policy =
      "default-src 'self';img-src 'self' data:; script-src 'self' 'sha256-a=' 'strict-dynamic'; style-src 'self'";
    expect(addScriptSources(policy, ["'sha256-a='", "'sha256-b='"])).toBe(
      "default-src 'self';img-src 'self' data:; script-src 'self' 'sha256-a=' 'strict-dynamic' 'sha256-b='; style-src 'self'",
    );
  });
});
