import type { APIRoute } from 'astro';
import { plainTextResponse, siteOrigin } from '../agent/endpoint';
import { renderLlmsFullTxt } from '../agent/llms';

export const GET: APIRoute = () => plainTextResponse(renderLlmsFullTxt(siteOrigin()));
