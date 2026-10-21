import { describe, expect, it } from 'vitest';
import { markdownPathFor, prefersMarkdown } from '../http/negotiation';

const withAccept = (accept: string) => new Request('https://example.test/', { headers: { Accept: accept } });

describe('negociación de Markdown', () => {
  it.each([
    ['text/markdown', true],
    ['text/markdown, text/html;q=0.9', true],
    ['text/html, text/markdown;q=0.5', false],
    ['text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', false],
    ['text/markdown;q=0', false],
    ['', false],
  ])('Accept: %s → %s', (accept, expected) => {
    expect(prefersMarkdown(withAccept(accept))).toBe(expected);
  });

  it.each([
    ['/', '/index.md'],
    ['/index.html', '/index.md'],
    ['/es/', '/es/index.md'],
    ['/en', '/en/index.md'],
    ['/fr/proyectos', '/fr/proyectos.md'],
    ['/es/proyectos/', '/es/proyectos.md'],
    ['/es/proyectos.html', '/es/proyectos.md'],
    ['/de/', null],
    ['/es/proyectos/extra', null],
    ['/api/v1/status', null],
  ])('%s → %s', (path, expected) => {
    expect(markdownPathFor(path)).toBe(expected);
  });
});
