import type { APIRoute } from 'astro';
import { apiIndex } from '../../../agent/api-index';
import { jsonResponse, siteOrigin } from '../../../agent/endpoint';

// Índice de la API. El Worker lo sirve también en /api/v1/, la URL base de la API.
export const GET: APIRoute = () => jsonResponse(apiIndex(siteOrigin()));
