import type { APIRoute } from 'astro';
import { siteOrigin, textResponse } from '../agent/site.js';
import { renderLlmsTxt } from '../agent/content.js';

export const GET: APIRoute = () => textResponse(renderLlmsTxt(siteOrigin()), 'text/plain; charset=utf-8');
