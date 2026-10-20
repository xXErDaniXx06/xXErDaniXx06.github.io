import type { APIRoute, GetStaticPaths } from 'astro';
import { jsonResponse, siteOrigin } from '../../../../agent/site.js';
import { LANGS, getPortfolioData } from '../../../../agent/content.js';

// API JSON de solo lectura, generada en la compilación: /api/v1/{lang}/{resource}.json
// Descrita en /api/v1/openapi.json y anunciada en /.well-known/api-catalog.
const RESOURCES = ['portfolio', 'profile', 'projects', 'skills', 'achievements', 'contact'] as const;

export const getStaticPaths: GetStaticPaths = () =>
  LANGS.flatMap((lang) => RESOURCES.map((resource) => ({ params: { lang, resource } })));

export const GET: APIRoute = ({ params }) => {
  const data = getPortfolioData(params.lang!, siteOrigin());
  const resource = params.resource as (typeof RESOURCES)[number];
  if (resource === 'portfolio') return jsonResponse(data);
  return jsonResponse({ lang: data.lang, name: data.name, [resource]: data[resource] });
};
