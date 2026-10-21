// Servidor MCP del porfolio: herramientas de solo lectura sobre su contenido y una para
// enviar un mensaje a Daniel, más cada página en Markdown como recurso.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/cfworker-provider.js';
import { z } from 'zod';
import { renderPageMarkdown } from '../../src/agent/markdown';
import { MCP_MESSAGES_PER_HOUR, MCP_SERVER } from '../../src/agent/mcp-info';
import { getPortfolioData } from '../../src/agent/portfolio-data';
import { PAGE_IDS, markdownHref } from '../../src/data/pages';
import { CONTACT } from '../../src/data/profile';
import { PROJECT_IDS } from '../../src/data/projects';
import { SKILL_CATEGORY_IDS } from '../../src/data/skills';
import { getDictionary, LANGS } from '../../src/i18n';
import { MESSAGE_LIMITS, type ContactError } from '../../src/lib/contact';
import type { ContactService } from '../contact/contact-service';

const INSTRUCTIONS =
  'Portfolio of Daniel Carrasco García, Computer Engineering student at the University of Málaga (software, embedded hardware, RF/LoRa and aerospace projects). Use the read tools to answer questions about his profile, projects, skills, achievements and contact details in Spanish (es), English (en) or French (fr). Only call send_contact_message after the user has explicitly approved the exact name, email, subject and message.';

/** Respuesta de send_contact_message cuando no se envía (en inglés, para el agente). */
const CONTACT_ERRORS: Record<ContactError, string> = {
  required: 'Every field is required: name, email, subject and message.',
  invalid_email: 'The email address is not valid.',
  too_long: 'One of the fields is too long.',
  rate_limited: 'Too many messages. Try again in a minute.',
  hourly_limit: `Limit reached: at most ${MCP_MESSAGES_PER_HOUR} messages per hour per authorization.`,
  daily_limit: `Daily message limit reached. Write directly to ${CONTACT.personalEmail}.`,
  verification_failed: 'The message could not be verified.',
  unavailable: `Sending messages is not configured on this server. Write to ${CONTACT.personalEmail}.`,
  send_failed: `The message could not be sent. Try again later or write to ${CONTACT.personalEmail}.`,
};

const asText = (data: unknown) => ({
  content: [{ type: 'text' as const, text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }],
});
const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

export interface McpServerDependencies {
  origin: string;
  contact: ContactService;
  /** Quién usa el servidor (de la autorización OAuth). */
  caller: { userId: string; clientName: string };
}

export function createMcpServer({ origin, contact, caller }: McpServerDependencies): McpServer {
  const data = (lang: (typeof LANGS)[number]) => getPortfolioData(lang, origin);
  const lang = z
    .enum(LANGS)
    .default('es')
    .describe('Language of the content: es (Spanish, default), en (English) or fr (French).');
  const server = new McpServer(
    { name: MCP_SERVER.name, title: MCP_SERVER.title, version: MCP_SERVER.version },
    { instructions: INSTRUCTIONS, jsonSchemaValidator: new CfWorkerJsonSchemaValidator() },
  );

  server.registerTool(
    'get_profile',
    {
      title: 'Get profile',
      description: "Daniel's name, role, short bio, availability, photos and CV link (the portfolio home page).",
      inputSchema: { lang },
      annotations: READ_ONLY,
    },
    async (args) => asText(data(args.lang).profile),
  );

  server.registerTool(
    'list_projects',
    {
      title: 'List projects',
      description:
        'Missions and projects with organization, period, status and tags. Use get_project for milestones and full description.',
      inputSchema: {
        lang,
        status: z.enum(['active', 'completed']).optional().describe('Only active or only completed projects.'),
      },
      annotations: READ_ONLY,
    },
    async (args) =>
      asText(
        data(args.lang)
          .projects.items.filter((p) => !args.status || p.status === args.status)
          .map(({ id, title, organization, period, status, status_label, tags, url }) => ({
            id,
            title,
            organization,
            period,
            status,
            status_label,
            tags,
            url,
          })),
      ),
  );

  server.registerTool(
    'get_project',
    {
      title: 'Get project',
      description: 'Full details of one project: description, milestones, tags and image or video.',
      inputSchema: {
        id: z.enum(PROJECT_IDS as [string, ...string[]]).describe('Project id, as returned by list_projects.'),
        lang,
      },
      annotations: READ_ONLY,
    },
    async (args) => asText(data(args.lang).projects.items.find((p) => p.id === args.id)),
  );

  server.registerTool(
    'list_skills',
    {
      title: 'List skills',
      description:
        'Technical skills grouped by category (programming; communications, RF and embedded; tools; languages), each with a short note.',
      inputSchema: { lang, category: z.enum(SKILL_CATEGORY_IDS).optional().describe('Only one category.') },
      annotations: READ_ONLY,
    },
    async (args) => asText(data(args.lang).skills.categories.filter((c) => !args.category || c.id === args.category)),
  );

  server.registerTool(
    'list_achievements',
    {
      title: 'List achievements',
      description: 'Awards and recognitions (2019–2026) with date, scope, awarding body, prize and description.',
      inputSchema: {
        lang,
        year: z.string().optional().describe('Only achievements whose year contains this value, e.g. "2024".'),
        scope: z
          .string()
          .optional()
          .describe('Only one scope as written in the chosen language, e.g. "Internacional", "International".'),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const achievements = data(args.lang).achievements;
      const items = achievements.items.filter(
        (item) =>
          (!args.year || item.year.includes(args.year)) &&
          (!args.scope || item.scope.toLowerCase() === args.scope.toLowerCase()),
      );
      return asText({ summary: achievements.summary, scopes: achievements.scopes, items });
    },
  );

  server.registerTool(
    'get_contact_info',
    {
      title: 'Get contact information',
      description: "Daniel's email addresses, phone, LinkedIn, GitHub, CV link, meeting hours and spoken languages.",
      inputSchema: { lang },
      annotations: READ_ONLY,
    },
    async (args) => {
      const { form: _form, ...info } = data(args.lang).contact;
      return asText(info);
    },
  );

  server.registerTool(
    'get_page_markdown',
    {
      title: 'Get page as Markdown',
      description: 'A whole portfolio page as Markdown, exactly as shown on the website.',
      inputSchema: {
        page: z
          .enum(PAGE_IDS)
          .describe(
            'index (home), proyectos (projects), habilidades (skills), logros (achievements) or contacto (contact).',
          ),
        lang,
      },
      annotations: READ_ONLY,
    },
    async (args) => asText(renderPageMarkdown(args.lang, args.page, origin)),
  );

  server.registerTool(
    'send_contact_message',
    {
      title: 'Send a message to Daniel',
      description: `Sends an email to Daniel Carrasco García through the portfolio contact form. Requires the contact:send permission. Confirm the exact content with the user first. Limited to ${MCP_MESSAGES_PER_HOUR} messages per hour.`,
      inputSchema: {
        name: z.string().min(1).max(MESSAGE_LIMITS.name).describe('Full name of the sender.'),
        email: z.email().max(MESSAGE_LIMITS.email).describe('Email address where Daniel can reply.'),
        subject: z.string().min(1).max(MESSAGE_LIMITS.subject).describe('Subject of the message.'),
        message: z.string().min(1).max(MESSAGE_LIMITS.message).describe('Body of the message.'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (args) => {
      const result = await contact.send(args, {
        key: `mcp:${caller.userId}`,
        perHour: MCP_MESSAGES_PER_HOUR,
        footer: `Enviado a través del servidor MCP del porfolio por el cliente "${caller.clientName}".`,
      });
      return result.ok
        ? asText('Message sent. Daniel will reply to the email address provided.')
        : { ...asText(CONTACT_ERRORS[result.error]), isError: true };
    },
  );

  for (const l of LANGS) {
    const t = getDictionary(l);
    for (const page of PAGE_IDS) {
      const uri = `${origin}${markdownHref(l, page)}`;
      server.registerResource(
        `${l}-${page}`,
        uri,
        { title: `${t.nav.pages[page]} (${l})`, mimeType: 'text/markdown' },
        async () => ({ contents: [{ uri, mimeType: 'text/markdown', text: renderPageMarkdown(l, page, origin) }] }),
      );
    }
  }

  return server;
}
