// Integración de Astro: añade `integrity` (SRI) a los scripts que Astro publica en /_astro/
// y su hash a la política de seguridad de contenidos de cada página. Con 'strict-dynamic',
// el navegador solo ejecuta un script externo si su hash está en la política y el elemento
// lo declara en `integrity`; los módulos que importa y los scripts que cree heredan la confianza.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = /<script\b([^>]*?)\ssrc="(\/_astro\/[^"]+\.js)"([^>]*)>/g;
const CSP_META = /(<meta http-equiv="content-security-policy" content=")([^"]*)(")/;

/** Añade fuentes a la directiva script-src de una política. */
export function addScriptSources(policy, sources) {
  return policy.replace(/(^|;)\s*script-src([^;]*)/, (directive, start, values) => {
    const current = values.trim().split(/\s+/);
    const missing = sources.filter((source) => !current.includes(source));
    return `${start} script-src ${[...current, ...missing].join(' ')}`;
  });
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

/** @returns {import('astro').AstroIntegration} */
export default function subresourceIntegrity() {
  return {
    name: 'subresource-integrity',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const hashes = new Map();
        const integrityOf = async (src) => {
          if (!hashes.has(src)) {
            const content = await readFile(join(root, src));
            hashes.set(src, `sha256-${createHash('sha256').update(content).digest('base64')}`);
          }
          return hashes.get(src);
        };
        let pages = 0;
        for await (const file of htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          const sources = [...html.matchAll(SCRIPT)].map((match) => match[2]);
          if (sources.length === 0) continue;
          const integrity = new Map(await Promise.all(sources.map(async (src) => [src, await integrityOf(src)])));
          const updated = html
            .replace(SCRIPT, (tag, before, src, after) =>
              tag.includes('integrity=')
                ? tag
                : `<script${before} src="${src}" integrity="${integrity.get(src)}"${after}>`,
            )
            .replace(
              CSP_META,
              (_, start, policy, end) =>
                `${start}${addScriptSources(
                  policy,
                  [...integrity.values()].map((hash) => `'${hash}'`),
                )}${end}`,
            );
          await writeFile(file, updated);
          pages++;
        }
        logger.info(`integrity añadido a los scripts de ${pages} páginas`);
      },
    },
  };
}
