// Identidad del servidor MCP, compartida por el servidor (worker/mcp.js), su Server Card
// y el catálogo de IA, para que lo que se anuncia coincida con lo que responde.

export const MCP_SERVER = {
  // Formato de nombre de las Server Cards (SEP-2127): dominio invertido / nombre
  name: 'me.danielcarrascogarcia/portfolio',
  title: 'Daniel Carrasco García — Portfolio',
  version: '1.0.0',
  description:
    "Read-only tools about Daniel Carrasco García's portfolio (profile, projects, skills, achievements, contact details and every page as Markdown, in Spanish, English and French) and a tool to send him a message. OAuth 2.1; no account needed.",
};

export const MCP_PATH = '/mcp';
export const SERVER_CARD_PATH = '/mcp/server-card';
export const LEGACY_SERVER_CARD_PATH = '/.well-known/mcp/server-card.json';
