// /mcp (Streamable HTTP, sin estado, respuestas JSON), protegido con OAuth: la librería
// valida el token y llama a este manejador con ctx.props y ctx.auth.

import { insufficientScope, type OAuthResourceContext } from '@cloudflare/workers-oauth-provider';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { MCP_SCOPES } from '../../src/agent/mcp-info';
import type { ContactService } from '../contact/contact-service';
import type { GrantProps } from '../oauth/consent-handler';
import { createMcpServer } from './server';

/** ¿La petición JSON-RPC llama a una herramienta que exige contact:send? */
async function callsContactTool(request: Request): Promise<boolean> {
  if (request.method !== 'POST') return false;
  try {
    const body: unknown = await request.clone().json();
    const messages = Array.isArray(body) ? body : [body];
    return messages.some(
      (m) =>
        (m as { method?: string })?.method === 'tools/call' &&
        (m as { params?: { name?: string } })?.params?.name === 'send_contact_message',
    );
  } catch {
    return false;
  }
}

export interface McpHandlerDependencies {
  origin: string;
  contact: ContactService;
}

export async function handleMcp(
  request: Request,
  ctx: OAuthResourceContext<Partial<GrantProps> | undefined>,
  deps: McpHandlerDependencies,
): Promise<Response> {
  const { auth } = ctx;
  if (!auth.scope.includes(MCP_SCOPES.read)) return insufficientScope(auth, [MCP_SCOPES.read]);
  if ((await callsContactTool(request)) && !auth.scope.includes(MCP_SCOPES.contact)) {
    return insufficientScope(
      auth,
      [MCP_SCOPES.read, MCP_SCOPES.contact],
      'Sending messages requires the contact:send permission.',
    );
  }
  const server = createMcpServer({
    origin: deps.origin,
    contact: deps.contact,
    caller: {
      userId: ctx.props?.userId ?? auth.userId ?? 'unknown',
      clientName: ctx.props?.clientName ?? auth.clientId ?? 'unknown',
    },
  });
  // Sin sessionIdGenerator: servidor sin estado, cada petición es independiente.
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await server.connect(transport);
  return transport.handleRequest(request);
}
