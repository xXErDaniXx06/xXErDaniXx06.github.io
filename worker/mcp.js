// Servidor MCP (Streamable HTTP, sin estado) en /mcp, protegido con OAuth.
// Herramientas de solo lectura sobre el contenido del porfolio y una para
// enviar un mensaje a Daniel, que exige además el permiso contact:send.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/cfworker-provider.js';
import { insufficientScope } from '@cloudflare/workers-oauth-provider';
import { z } from 'zod';
import { getPortfolioData, renderPageMarkdown, LANGS, PAGES } from '../src/agent/content.js';
import { getTranslations } from '../src/utils/i18n.js';
import { markdownHref } from '../src/data/profile.js';
import { MCP_SERVER } from '../src/agent/mcp-info.js';
import { sendContactMessage, MESSAGE_LIMITS } from './contact.js';

// La misma identidad que anuncian la Server Card y el catálogo de IA
export const MCP_SERVER_INFO = { name: MCP_SERVER.name, title: MCP_SERVER.title, version: MCP_SERVER.version };

export const SCOPES = {
  read: 'portfolio:read',
  contact: 'contact:send',
};

const INSTRUCTIONS =
  "Portfolio of Daniel Carrasco García, Computer Engineering student at the University of Málaga (software, embedded hardware, RF/LoRa and aerospace projects). Use the read tools to answer questions about his profile, projects, skills, achievements and contact details in Spanish (es), English (en) or French (fr). Only call send_contact_message after the user has explicitly approved the exact name, email, subject and message.";

const PROJECT_IDS = getTranslations('es').projects.list.map((p) => p.id);
const SKILL_CATEGORIES = getTranslations('es').skills.categories.map((c) => c.id);
const PAGE_IDS = PAGES.map((p) => p.id);

const lang = z.enum(LANGS).default('es').describe('Language of the content: es (Spanish, default), en (English) or fr (French).');

const asText = (data) => ({ content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }] });
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

function buildServer(env, ctx) {
  const origin = env.SITE_ORIGIN;
  const data = (l) => getPortfolioData(l, origin);
  const server = new McpServer(MCP_SERVER_INFO, {
    instructions: INSTRUCTIONS,
    jsonSchemaValidator: new CfWorkerJsonSchemaValidator(),
  });

  server.registerTool(
    'get_profile',
    {
      title: 'Get profile',
      description: "Daniel's name, role, short bio, availability, photos and CV link (the portfolio home page).",
      inputSchema: { lang },
      annotations: readOnly,
    },
    async (args) => asText(data(args.lang).profile)
  );

  server.registerTool(
    'list_projects',
    {
      title: 'List projects',
      description: 'Missions and projects with organization, period, status and tags. Use get_project for milestones and full description.',
      inputSchema: {
        lang,
        status: z.enum(['active', 'completed']).optional().describe('Only active or only completed projects.'),
      },
      annotations: readOnly,
    },
    async (args) => {
      const items = data(args.lang).projects.items
        .filter((p) => !args.status || p.status === args.status)
        .map(({ id, title, organization, period, status, status_label, tags, url }) => ({ id, title, organization, period, status, status_label, tags, url }));
      return asText(items);
    }
  );

  server.registerTool(
    'get_project',
    {
      title: 'Get project',
      description: 'Full details of one project: description, milestones, tags and image or video.',
      inputSchema: { id: z.enum(PROJECT_IDS).describe('Project id, as returned by list_projects.'), lang },
      annotations: readOnly,
    },
    async (args) => asText(data(args.lang).projects.items.find((p) => p.id === args.id))
  );

  server.registerTool(
    'list_skills',
    {
      title: 'List skills',
      description: 'Technical skills grouped by category (programming; communications, RF and embedded; tools; languages), each with a short note.',
      inputSchema: {
        lang,
        category: z.enum(SKILL_CATEGORIES).optional().describe('Only one category.'),
      },
      annotations: readOnly,
    },
    async (args) => asText(data(args.lang).skills.categories.filter((c) => !args.category || c.id === args.category))
  );

  server.registerTool(
    'list_achievements',
    {
      title: 'List achievements',
      description: 'Awards and recognitions (2019–2026) with date, scope, awarding body, prize and description.',
      inputSchema: {
        lang,
        year: z.string().optional().describe('Only achievements whose year contains this value, e.g. "2024".'),
        scope: z.string().optional().describe('Only one scope as written in the chosen language, e.g. "Internacional", "International".'),
      },
      annotations: readOnly,
    },
    async (args) => {
      const a = data(args.lang).achievements;
      const items = a.items.filter(
        (item) => (!args.year || item.year.includes(args.year)) && (!args.scope || item.scope.toLowerCase() === args.scope.toLowerCase())
      );
      return asText({ summary: a.summary, scopes: a.scopes, items });
    }
  );

  server.registerTool(
    'get_contact_info',
    {
      title: 'Get contact information',
      description: "Daniel's email addresses, phone, LinkedIn, GitHub, CV link, meeting hours and spoken languages.",
      inputSchema: { lang },
      annotations: readOnly,
    },
    async (args) => {
      const { form, ...contact } = data(args.lang).contact;
      return asText(contact);
    }
  );

  server.registerTool(
    'get_page_markdown',
    {
      title: 'Get page as Markdown',
      description: 'A whole portfolio page as Markdown, exactly as shown on the website.',
      inputSchema: {
        page: z.enum(PAGE_IDS).describe('index (home), proyectos (projects), habilidades (skills), logros (achievements) or contacto (contact).'),
        lang,
      },
      annotations: readOnly,
    },
    async (args) => asText(renderPageMarkdown(args.lang, args.page, origin))
  );

  server.registerTool(
    'send_contact_message',
    {
      title: 'Send a message to Daniel',
      description:
        'Sends an email to Daniel Carrasco García through the portfolio contact form. Requires the contact:send permission. Confirm the exact content with the user first. Limited to 3 messages per hour.',
      inputSchema: {
        name: z.string().min(1).max(MESSAGE_LIMITS.name).describe('Full name of the sender.'),
        email: z.email().max(MESSAGE_LIMITS.email).describe('Email address where Daniel can reply.'),
        subject: z.string().min(1).max(MESSAGE_LIMITS.subject).describe('Subject of the message.'),
        message: z.string().min(1).max(MESSAGE_LIMITS.message).describe('Body of the message.'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (args) => {
      const result = await sendContactMessage(env, args, {
        userId: ctx.props?.userId ?? ctx.auth.userId ?? 'unknown',
        clientName: ctx.props?.clientName ?? ctx.auth.clientId ?? 'unknown',
      });
      return result.ok
        ? asText('Message sent. Daniel will reply to the email address provided.')
        : { ...asText(result.error), isError: true };
    }
  );

  for (const l of LANGS) {
    const t = getTranslations(l);
    for (const page of PAGES) {
      const uri = `${origin}${markdownHref(l, page.slug)}`;
      server.registerResource(
        `${l}-${page.id}`,
        uri,
        { title: `${page.slug ? t.nav[page.id] : t.nav.inicio} (${l})`, mimeType: 'text/markdown' },
        async () => ({ contents: [{ uri, mimeType: 'text/markdown', text: renderPageMarkdown(l, page.id, origin) }] })
      );
    }
  }

  return server;
}

/** ¿La petición JSON-RPC llama a una herramienta que exige contact:send? */
async function needsContactScope(request) {
  if (request.method !== 'POST') return false;
  try {
    const body = await request.clone().json();
    const messages = Array.isArray(body) ? body : [body];
    return messages.some((m) => m?.method === 'tools/call' && m?.params?.name === 'send_contact_message');
  } catch {
    return false;
  }
}

/** Manejador protegido de /mcp (recibe ctx.props y ctx.auth de la librería OAuth). */
export const mcpHandler = {
  async fetch(request, env, ctx) {
    if (!ctx.auth.scope.includes(SCOPES.read)) return insufficientScope(ctx.auth, [SCOPES.read]);
    if ((await needsContactScope(request)) && !ctx.auth.scope.includes(SCOPES.contact)) {
      return insufficientScope(ctx.auth, [SCOPES.read, SCOPES.contact], 'Sending messages requires the contact:send permission.');
    }
    const server = buildServer(env, ctx);
    const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    await server.connect(transport);
    return transport.handleRequest(request);
  },
};
