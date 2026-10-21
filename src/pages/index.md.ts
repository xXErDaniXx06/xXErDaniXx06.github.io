import type { APIRoute } from 'astro';
import { markdownResponse, siteOrigin } from '../agent/endpoint';
import { renderRootMarkdown } from '../agent/llms';

// Versión Markdown de la raíz (/), que muestra la portada en el idioma por defecto.
export const GET: APIRoute = () => markdownResponse(renderRootMarkdown(siteOrigin()));
