import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PROFILE_PHOTOS } from '../../data/media';
import { PROJECTS } from '../../data/projects';

// Publica sin cambios las imágenes originales de src/assets/images/ en /images/<fichero>:
// es la URL estable que reciben los agentes (API JSON, Markdown, MCP). Las páginas usan
// versiones optimizadas de las mismas imágenes.
const PUBLISHED: readonly string[] = [
  ...PROFILE_PHOTOS.map((photo) => photo.file),
  ...PROJECTS.flatMap((project) => (project.media.type === 'image' ? [project.media.file] : [])),
];

const CONTENT_TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

export const getStaticPaths = (() => PUBLISHED.map((file) => ({ params: { file } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const file = params.file;
  if (!file || !PUBLISHED.includes(file)) return new Response(null, { status: 404 });
  const body = await readFile(join(process.cwd(), 'src/assets/images', file));
  const extension = file.slice(file.lastIndexOf('.') + 1).toLowerCase();
  return new Response(body, { headers: { 'Content-Type': CONTENT_TYPES[extension] ?? 'application/octet-stream' } });
};
