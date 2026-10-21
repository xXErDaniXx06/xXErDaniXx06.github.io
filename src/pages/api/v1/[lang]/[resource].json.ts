import type { APIRoute, GetStaticPaths } from 'astro';
import { jsonResponse, siteOrigin } from '../../../../agent/endpoint';
import { PORTFOLIO_RESOURCES, type PortfolioResource } from '../../../../agent/api-resources';
import { getPortfolioData } from '../../../../agent/portfolio-data';
import { LANGS, type Lang } from '../../../../i18n';

// API JSON de solo lectura, generada en la compilación: /api/v1/{lang}/{resource}.json
// Descrita en /api/v1/openapi.json y anunciada en /.well-known/api-catalog.
export const getStaticPaths = (() =>
  LANGS.flatMap((lang) =>
    PORTFOLIO_RESOURCES.map((resource) => ({ params: { lang, resource } })),
  )) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const data = getPortfolioData(params.lang as Lang, siteOrigin());
  const resource = params.resource as PortfolioResource;
  if (resource === 'portfolio') return jsonResponse(data);
  return jsonResponse({ lang: data.lang, name: data.name, [resource]: data[resource] });
};
