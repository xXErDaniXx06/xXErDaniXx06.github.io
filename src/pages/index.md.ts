import type { APIRoute } from 'astro';
import { siteOrigin, textResponse } from '../agent/site.js';
import { renderRootMarkdown } from '../agent/content.js';

// Versión Markdown de la raíz (/), que en HTML redirige a /es/.
export const GET: APIRoute = () => textResponse(renderRootMarkdown(siteOrigin()), 'text/markdown; charset=utf-8');
