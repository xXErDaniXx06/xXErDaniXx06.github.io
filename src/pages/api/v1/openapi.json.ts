import type { APIRoute } from 'astro';
import { jsonResponse, siteOrigin } from '../../../agent/site.js';
import { LANGS } from '../../../agent/content.js';
import { PERSON_NAME } from '../../../data/profile.js';

// OpenAPI 3.1 de la API JSON de solo lectura del porfolio.
const str = { type: 'string' };
const strList = { type: 'array', items: str };

const schemas = {
  Profile: {
    type: 'object',
    properties: {
      name: str, greeting: str, availability: str, role: str, role_tagline: str, about: str,
      photos: { type: 'array', items: { type: 'string', format: 'uri' } },
      cv_url: { type: 'string', format: 'uri' }, url: { type: 'string', format: 'uri' },
    },
  },
  Project: {
    type: 'object',
    properties: {
      id: str, title: str, organization: str, period: str,
      status: { type: 'string', enum: ['active', 'completed'] }, status_label: str,
      description: str, description_markdown: str, milestones: strList, tags: strList,
      media: {
        type: ['object', 'null'],
        properties: { type: { type: 'string', enum: ['image', 'video'] }, url: { type: 'string', format: 'uri' } },
      },
      url: { type: 'string', format: 'uri' },
    },
  },
  Projects: {
    type: 'object',
    properties: { tag: str, title: str, subtitle: str, url: { type: 'string', format: 'uri' }, items: { type: 'array', items: { $ref: '#/components/schemas/Project' } } },
  },
  Skills: {
    type: 'object',
    properties: {
      tag: str, title: str, subtitle: str, url: { type: 'string', format: 'uri' },
      categories: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: str, title: str, description: str, url: { type: 'string', format: 'uri' },
            skills: { type: 'array', items: { type: 'object', properties: { name: str, note: str } } },
          },
        },
      },
    },
  },
  Achievement: {
    type: 'object',
    properties: { year: str, date: str, datetime: { type: 'string', format: 'date' }, scope: str, organization: str, prize: str, title: str, description: str },
  },
  Achievements: {
    type: 'object',
    properties: {
      tag: str, title: str, summary: str, footer: str, total: { type: 'integer' }, scopes: strList,
      url: { type: 'string', format: 'uri' }, items: { type: 'array', items: { $ref: '#/components/schemas/Achievement' } },
    },
  },
  Contact: {
    type: 'object',
    properties: {
      tag: str, title: str, heading: str, description: str,
      personal_email: { type: 'string', format: 'email' }, uma_email: { type: 'string', format: 'email' },
      phone: str, phone_display: str, linkedin: { type: 'string', format: 'uri' }, github: { type: 'string', format: 'uri' },
      cv_url: { type: 'string', format: 'uri' }, meetings: str, languages: str, url: { type: 'string', format: 'uri' },
      form: { type: 'object' },
    },
  },
  Portfolio: {
    type: 'object',
    properties: {
      lang: str, name: str, url: { type: 'string', format: 'uri' },
      profile: { $ref: '#/components/schemas/Profile' },
      projects: { $ref: '#/components/schemas/Projects' },
      skills: { $ref: '#/components/schemas/Skills' },
      achievements: { $ref: '#/components/schemas/Achievements' },
      contact: { $ref: '#/components/schemas/Contact' },
    },
  },
};

const RESOURCE_DOCS = {
  portfolio: ['Everything', 'Profile, projects, skills, achievements and contact details in one document.', 'Portfolio'],
  profile: ['Profile', 'Name, role, short bio, photos and CV link (home page).', 'Profile'],
  projects: ['Projects', 'Missions and projects with organization, period, status, milestones, tags and media.', 'Projects'],
  skills: ['Skills', 'Technical stack grouped by category, with a note for each skill.', 'Skills'],
  achievements: ['Achievements', 'Awards and recognitions with date, scope, issuer and description.', 'Achievements'],
  contact: ['Contact', 'Email addresses, phone, LinkedIn, GitHub, CV and availability.', 'Contact'],
} as const;

export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const langParam = {
    name: 'lang', in: 'path', required: true,
    description: 'Language of the content: es (Spanish, default site language), en (English) or fr (French).',
    schema: { type: 'string', enum: LANGS },
  };
  const paths: Record<string, unknown> = {};
  for (const [resource, [summary, description, schema]] of Object.entries(RESOURCE_DOCS)) {
    const wrapped =
      resource === 'portfolio'
        ? { $ref: `#/components/schemas/${schema}` }
        : { type: 'object', properties: { lang: str, name: str, [resource]: { $ref: `#/components/schemas/${schema}` } } };
    paths[`/api/v1/{lang}/${resource}.json`] = {
      get: {
        operationId: `get${schema}`,
        summary,
        description,
        parameters: [langParam],
        responses: { '200': { description: summary, content: { 'application/json': { schema: wrapped } } } },
      },
    };
  }
  paths['/api/v1/status'] = {
    get: {
      operationId: 'getStatus',
      summary: 'Service status',
      description: 'Health check of the site, its JSON API and its MCP server.',
      responses: {
        '200': {
          description: 'The service is up.',
          content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['ok'] }, time: { type: 'string', format: 'date-time' } } } } },
        },
      },
    },
  };

  return jsonResponse({
    openapi: '3.1.0',
    info: {
      title: `${PERSON_NAME} — Portfolio API`,
      version: '1.0.0',
      summary: `Read-only JSON API with the content of ${PERSON_NAME}'s portfolio in Spanish, English and French.`,
      description:
        'Public, unauthenticated, read-only. The same content is published as HTML, as Markdown (Accept: text/markdown or the .md URLs) and through the MCP server described at /.well-known/mcp/server-card.json.',
      contact: { name: PERSON_NAME, url: `${origin}/es/contacto` },
    },
    servers: [{ url: origin }],
    externalDocs: { description: 'API and MCP documentation for agents', url: `${origin}/api/v1/docs.md` },
    paths,
    components: { schemas },
  });
};
