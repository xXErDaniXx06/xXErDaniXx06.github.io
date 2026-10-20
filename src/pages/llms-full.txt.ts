import type { APIRoute } from 'astro';
import { siteOrigin, textResponse } from '../agent/site.js';
import { renderLlmsFullTxt } from '../agent/content.js';

export const GET: APIRoute = () => textResponse(renderLlmsFullTxt(siteOrigin()), 'text/plain; charset=utf-8');
