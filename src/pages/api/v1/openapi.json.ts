import type { APIRoute } from 'astro';
import {
  API_INFO,
  API_PATHS,
  apiResourcePath,
  CONTACT_FORM_NOTE,
  PORTFOLIO_RESOURCES,
  RESOURCE_DOCS,
} from '../../../agent/api-resources';
import { jsonResponse, siteOrigin } from '../../../agent/endpoint';
import { LEGACY_SERVER_CARD_PATH } from '../../../agent/mcp-info';
import { pageHref } from '../../../data/pages';
import { PERSON_NAME } from '../../../data/profile';
import { DEFAULT_LANG, LANGS } from '../../../i18n';
import { MESSAGE_LIMITS } from '../../../lib/contact';
import { absoluteUrl } from '../../../lib/text';

// OpenAPI 3.1 de la API JSON de solo lectura del porfolio.
const str = { type: 'string' };
const strList = { type: 'array', items: str };

const schemas = {
  Profile: {
    type: 'object',
    properties: {
      name: str,
      greeting: str,
      availability: str,
      role: str,
      role_tagline: str,
      about: str,
      photos: { type: 'array', items: { type: 'string', format: 'uri' } },
      cv_url: { type: 'string', format: 'uri' },
      url: { type: 'string', format: 'uri' },
    },
  },
  Project: {
    type: 'object',
    properties: {
      id: str,
      title: str,
      organization: str,
      period: str,
      status: { type: 'string', enum: ['active', 'completed'] },
      status_label: str,
      description: str,
      description_markdown: str,
      milestones: strList,
      tags: strList,
      media: {
        type: ['object', 'null'],
        properties: { type: { type: 'string', enum: ['image', 'video'] }, url: { type: 'string', format: 'uri' } },
      },
      url: { type: 'string', format: 'uri' },
    },
  },
  Projects: {
    type: 'object',
    properties: {
      tag: str,
      title: str,
      subtitle: str,
      url: { type: 'string', format: 'uri' },
      items: { type: 'array', items: { $ref: '#/components/schemas/Project' } },
    },
  },
  Skills: {
    type: 'object',
    properties: {
      tag: str,
      title: str,
      subtitle: str,
      url: { type: 'string', format: 'uri' },
      categories: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: str,
            title: str,
            description: str,
            url: { type: 'string', format: 'uri' },
            skills: { type: 'array', items: { type: 'object', properties: { name: str, note: str } } },
          },
        },
      },
    },
  },
  Achievement: {
    type: 'object',
    properties: {
      year: str,
      date: str,
      datetime: { type: 'string', format: 'date' },
      scope: str,
      organization: str,
      prize: str,
      title: str,
      description: str,
    },
  },
  Achievements: {
    type: 'object',
    properties: {
      tag: str,
      title: str,
      summary: str,
      footer: str,
      total: { type: 'integer' },
      scopes: strList,
      url: { type: 'string', format: 'uri' },
      items: { type: 'array', items: { $ref: '#/components/schemas/Achievement' } },
    },
  },
  Contact: {
    type: 'object',
    properties: {
      tag: str,
      title: str,
      heading: str,
      description: str,
      personal_email: { type: 'string', format: 'email' },
      uma_email: { type: 'string', format: 'email' },
      phone: str,
      phone_display: str,
      linkedin: { type: 'string', format: 'uri' },
      github: { type: 'string', format: 'uri' },
      cv_url: { type: 'string', format: 'uri' },
      meetings: str,
      languages: str,
      url: { type: 'string', format: 'uri' },
      form: { type: 'object' },
    },
  },
  Portfolio: {
    type: 'object',
    properties: {
      lang: str,
      name: str,
      url: { type: 'string', format: 'uri' },
      profile: { $ref: '#/components/schemas/Profile' },
      projects: { $ref: '#/components/schemas/Projects' },
      skills: { $ref: '#/components/schemas/Skills' },
      achievements: { $ref: '#/components/schemas/Achievements' },
      contact: { $ref: '#/components/schemas/Contact' },
    },
  },
};

export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const langParam = {
    name: 'lang',
    in: 'path',
    required: true,
    description: 'Language of the content: es (Spanish, default site language), en (English) or fr (French).',
    schema: { type: 'string', enum: LANGS },
  };
  const paths: Record<string, unknown> = {};
  for (const resource of PORTFOLIO_RESOURCES) {
    const { summary, description, schema } = RESOURCE_DOCS[resource];
    const wrapped =
      resource === 'portfolio'
        ? { $ref: `#/components/schemas/${schema}` }
        : {
            type: 'object',
            properties: { lang: str, name: str, [resource]: { $ref: `#/components/schemas/${schema}` } },
          };
    paths[apiResourcePath(resource)] = {
      get: {
        operationId: `get${schema}`,
        summary,
        description,
        parameters: [langParam],
        responses: { '200': { description: summary, content: { 'application/json': { schema: wrapped } } } },
      },
    };
  }
  paths[API_PATHS.status] = {
    get: {
      operationId: 'getStatus',
      summary: 'Service status',
      description: 'Health check of the site, its JSON API and its MCP server.',
      responses: {
        '200': {
          description: 'The service is up.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { status: { type: 'string', enum: ['ok'] }, time: { type: 'string', format: 'date-time' } },
              },
            },
          },
        },
      },
    },
  };

  const error = (description: string, codes: string[]) => ({
    description,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: { ok: { const: false }, error: { type: 'string', enum: codes }, field: str },
        },
      },
    },
  });
  paths[API_PATHS.contact] = {
    post: {
      operationId: 'sendContactMessage',
      summary: 'Contact form',
      description: CONTACT_FORM_NOTE,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'subject', 'message', 'token'],
              properties: {
                name: { type: 'string', maxLength: MESSAGE_LIMITS.name },
                email: { type: 'string', format: 'email', maxLength: MESSAGE_LIMITS.email },
                subject: { type: 'string', maxLength: MESSAGE_LIMITS.subject },
                message: { type: 'string', maxLength: MESSAGE_LIMITS.message },
                token: { type: 'string', description: 'Cloudflare Turnstile token from the contact form.' },
                lang: { type: 'string', enum: LANGS },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'The message was sent.',
          content: { 'application/json': { schema: { type: 'object', properties: { ok: { const: true } } } } },
        },
        '400': error('A field is missing, too long or not valid.', [
          'required',
          'too_long',
          'invalid_email',
          'bad_request',
        ]),
        '403': error('Turnstile verification failed or the request came from another site.', [
          'verification_failed',
          'forbidden',
        ]),
        '429': error('Too many messages (one per minute and five per hour per address, twenty per day in total).', [
          'rate_limited',
          'hourly_limit',
          'daily_limit',
        ]),
        '502': error('The message could not be delivered.', ['send_failed']),
        '503': error('Sending messages is not available.', ['unavailable']),
      },
    },
  };

  return jsonResponse({
    openapi: '3.1.0',
    info: {
      ...API_INFO,
      description: `The content endpoints are public, unauthenticated and read-only. The same content is published as HTML, as Markdown (Accept: text/markdown or the .md URLs) and through the MCP server described at ${LEGACY_SERVER_CARD_PATH}. POST ${API_PATHS.contact} is the endpoint of the website contact form and requires a Turnstile token.`,
      contact: { name: PERSON_NAME, url: absoluteUrl(origin, pageHref(DEFAULT_LANG, 'contacto')) },
    },
    servers: [{ url: origin }],
    externalDocs: { description: 'API and MCP documentation for agents', url: absoluteUrl(origin, API_PATHS.docs) },
    paths,
    components: { schemas },
  });
};
