// Índice de la API (/api/v1/), la URL base que anuncian el catálogo de APIs y auth.md:
// enlaza la descripción OpenAPI, la documentación, el estado y cada recurso en cada idioma.

import { LANGS } from '../i18n';
import { absoluteUrl } from '../lib/text';
import {
  API_INFO,
  API_PATHS,
  apiResourcePath,
  CONTACT_FORM_NOTE,
  PORTFOLIO_RESOURCES,
  RESOURCE_DOCS,
} from './api-resources';
import { MCP_PATH } from './mcp-info';

export function apiIndex(origin: string) {
  const url = (path: string): string => absoluteUrl(origin, path);
  return {
    name: API_INFO.title,
    description: API_INFO.summary,
    version: API_INFO.version,
    openapi: url(API_PATHS.openapi),
    documentation: url(API_PATHS.docs),
    status: url(API_PATHS.status),
    languages: LANGS,
    resources: PORTFOLIO_RESOURCES.map((resource) => ({
      name: resource,
      description: RESOURCE_DOCS[resource].description,
      urls: Object.fromEntries(LANGS.map((lang) => [lang, url(apiResourcePath(resource, lang))])),
    })),
    contact_form: { method: 'POST', url: url(API_PATHS.contact), description: CONTACT_FORM_NOTE },
    mcp_server: url(MCP_PATH),
  };
}
