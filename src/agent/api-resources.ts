// La API JSON del porfolio: rutas, recursos y descripción. La comparten las páginas, los
// documentos para agentes (OpenAPI, catálogos, Markdown, WebMCP) y el Worker, para que lo
// que se anuncia coincida con lo que responde.

import { PERSON_NAME } from '../data/profile';
import type { Lang } from '../i18n/langs';

const API_BASE = '/api/v1';

/** Rutas de la API. */
export const API_PATHS = {
  /** Índice de la API: enlaces a la descripción, la documentación y cada recurso. */
  root: `${API_BASE}/`,
  openapi: `${API_BASE}/openapi.json`,
  docs: `${API_BASE}/docs.md`,
  status: `${API_BASE}/status`,
  /** Formulario de contacto de la web (POST con un token de Turnstile). */
  contact: `${API_BASE}/contact`,
} as const;

export const API_INFO = {
  title: `${PERSON_NAME} — Portfolio API`,
  version: '1.0.0',
  summary: `JSON API with the content of ${PERSON_NAME}'s portfolio in Spanish, English and French.`,
} as const;

/** Partes del porfolio que se publican por separado en la API JSON. */
export const PORTFOLIO_RESOURCES = ['portfolio', 'profile', 'projects', 'skills', 'achievements', 'contact'] as const;

export type PortfolioResource = (typeof PORTFOLIO_RESOURCES)[number];

/** Plantilla de las rutas de los recursos, para la documentación. */
export const API_RESOURCE_TEMPLATE = `${API_BASE}/{lang}/{resource}.json`;

/** Ruta de un recurso en un idioma o, sin idioma, la plantilla con {lang}. */
export const apiResourcePath = (resource: PortfolioResource, lang: Lang | '{lang}' = '{lang}'): string =>
  `${API_BASE}/${lang}/${resource}.json`;

/** Qué contiene cada recurso y el nombre de su esquema en OpenAPI. */
export const RESOURCE_DOCS: Readonly<
  Record<PortfolioResource, { readonly summary: string; readonly description: string; readonly schema: string }>
> = {
  portfolio: {
    summary: 'Everything',
    description: 'Profile, projects, skills, achievements and contact details in one document.',
    schema: 'Portfolio',
  },
  profile: {
    summary: 'Profile',
    description: 'Name, role, short bio, photos and CV link (home page).',
    schema: 'Profile',
  },
  projects: {
    summary: 'Projects',
    description: 'Missions and projects with organization, period, status, milestones, tags and media.',
    schema: 'Projects',
  },
  skills: {
    summary: 'Skills',
    description: 'Technical stack grouped by category, with a note for each skill.',
    schema: 'Skills',
  },
  achievements: {
    summary: 'Achievements',
    description: 'Awards and recognitions with date, scope, issuer, prize and description.',
    schema: 'Achievements',
  },
  contact: {
    summary: 'Contact',
    description: 'Email addresses, phone, LinkedIn, GitHub, CV and availability.',
    schema: 'Contact',
  },
};

/** Por qué el formulario de contacto no sirve a los agentes y qué deben usar. */
export const CONTACT_FORM_NOTE =
  "Endpoint of the website's contact form. Every request needs a Cloudflare Turnstile token, so it only works from the form at /{lang}/contacto. Agents should use the MCP tool send_contact_message instead (see /auth.md) or write to the email address in /api/v1/{lang}/contact.json.";
