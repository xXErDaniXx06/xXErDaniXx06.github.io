// Identidad del servidor MCP, compartida por el servidor (worker/mcp/), su Server Card
// y el catálogo de IA, para que lo que se anuncia coincida con lo que responde.

export const MCP_SERVER = {
  // Formato de nombre de las Server Cards (SEP-2127): dominio invertido / nombre
  name: 'me.danielcarrascogarcia/portfolio',
  title: 'Daniel Carrasco García — Portfolio',
  version: '1.0.0',
  description:
    "Read-only tools about Daniel Carrasco García's portfolio (profile, projects, skills, achievements, contact details and every page as Markdown, in Spanish, English and French) and a tool to send him a message. OAuth 2.1; no account needed.",
} as const;

export const MCP_PATH = '/mcp';
export const SERVER_CARD_PATH = '/mcp/server-card';
export const LEGACY_SERVER_CARD_PATH = '/.well-known/mcp/server-card.json';

/** Permisos OAuth del servidor MCP. */
export const MCP_SCOPES = {
  read: 'portfolio:read',
  contact: 'contact:send',
  offlineAccess: 'offline_access',
} as const;

/** Herramientas del servidor MCP, en el orden en que se registran. */
export const MCP_TOOLS = [
  'get_profile',
  'list_projects',
  'get_project',
  'list_skills',
  'list_achievements',
  'get_contact_info',
  'get_page_markdown',
  'send_contact_message',
] as const;

/** Límite de mensajes por autorización y hora (herramienta send_contact_message). */
export const MCP_MESSAGES_PER_HOUR = 3;
