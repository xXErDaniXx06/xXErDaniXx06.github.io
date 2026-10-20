import type { APIRoute } from 'astro';
import { siteOrigin, textResponse } from '../agent/site.js';

// Política de rastreo (RFC 9309) con reglas explícitas para bots de IA y
// preferencias de uso del contenido (Content Signals, contentsignals.org).
// Se mantiene la política que la web tenía sin robots.txt: todo el contenido
// público es accesible. Para excluir el entrenamiento de modelos basta con
// cambiar SIGNALS a ai-train=no y las reglas de TRAINING_BOTS a Disallow: /.
const SIGNALS = 'search=yes, ai-input=yes, ai-train=yes';

// Rutas que no son contenido: autorización OAuth y servidor MCP.
const PRIVATE_PATHS = ['/authorize', '/oauth/', '/mcp'];

const SEARCH_BOTS = ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'];
const USER_BOTS = ['ChatGPT-User', 'Claude-User', 'Perplexity-User'];
const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider', 'Amazonbot'];

const group = (comment: string, agents: string[]) =>
  [
    `# ${comment}`,
    ...agents.map((a) => `User-agent: ${a}`),
    `Content-Signal: ${SIGNALS}`,
    'Allow: /',
    // La Server Card del servidor MCP es pública (la regla más específica gana)
    'Allow: /mcp/server-card',
    ...PRIVATE_PATHS.map((p) => `Disallow: ${p}`),
    '',
  ].join('\n');

export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const body = [
    `# robots.txt — ${new URL(origin).host}`,
    '# Content Signals: search = indexado en buscadores, ai-input = uso en respuestas',
    '# de IA (RAG, grounding), ai-train = entrenamiento de modelos.',
    '',
    group('Todos los rastreadores', ['*']),
    group('Buscadores de IA: alimentan las respuestas de los asistentes', SEARCH_BOTS),
    group('Peticiones hechas por un asistente en nombre de una persona', USER_BOTS),
    group('Rastreadores de entrenamiento de modelos', TRAINING_BOTS),
    `Sitemap: ${origin}/sitemap.xml`,
    `Agentmap: ${origin}/.well-known/ai-catalog.json`,
    '',
  ].join('\n');
  return textResponse(body, 'text/plain; charset=utf-8');
};
