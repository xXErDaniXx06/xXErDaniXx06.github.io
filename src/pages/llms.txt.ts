import type { APIRoute } from 'astro';
import { plainTextResponse, siteOrigin } from '../agent/endpoint';
import { renderLlmsTxt } from '../agent/llms';

export const GET: APIRoute = () => plainTextResponse(renderLlmsTxt(siteOrigin()));
