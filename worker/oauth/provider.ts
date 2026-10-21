// Servidor de autorización OAuth 2.1 (@cloudflare/workers-oauth-provider) que protege /mcp:
// metadatos, registro de clientes (DCR y CIMD), /authorize y /oauth/token.

import { OAuthProvider, type OAuthResourceContext } from '@cloudflare/workers-oauth-provider';
import { MCP_PATH, MCP_SCOPES } from '../../src/agent/mcp-info';
import { handleMcp } from '../mcp/handler';
import { createServices } from '../services';
import { handleSite } from '../site/router';
import { handleAuthorize, type GrantProps } from './consent-handler';
import { mcpResourceMetadata } from './metadata';

export const AUTHORIZE_PATH = '/authorize';
export const TOKEN_PATH = '/oauth/token';
export const REGISTER_PATH = '/oauth/register';

const providers = new Map<string, OAuthProvider<Env>>();

function createProvider(origin: string): OAuthProvider<Env> {
  return new OAuthProvider<Env>({
    apiRoute: MCP_PATH,
    apiHandler: {
      fetch(request, env, ctx) {
        const services = createServices(env);
        return handleMcp(request, ctx as unknown as OAuthResourceContext<Partial<GrantProps> | undefined>, {
          origin: services.origin,
          contact: services.contact,
        });
      },
    },
    defaultHandler: {
      fetch(request, env) {
        const services = createServices(env);
        if (new URL(request.url).pathname === AUTHORIZE_PATH) {
          return handleAuthorize(request, {
            oauth: env.OAUTH_PROVIDER,
            turnstile: services.turnstile,
            siteKey: services.turnstileSiteKey,
          });
        }
        return handleSite(request, services);
      },
    },
    authorizeEndpoint: AUTHORIZE_PATH,
    tokenEndpoint: TOKEN_PATH,
    clientRegistrationEndpoint: REGISTER_PATH,
    clientIdMetadataDocumentEnabled: true,
    scopesSupported: [MCP_SCOPES.read, MCP_SCOPES.contact, MCP_SCOPES.offlineAccess],
    requiredScopes: [MCP_SCOPES.read],
    resourceMetadata: mcpResourceMetadata(origin),
  });
}

/** La librería necesita el origen al construirse: una instancia por origen (en producción, una). */
export function getOAuthProvider(origin: string): OAuthProvider<Env> {
  let provider = providers.get(origin);
  if (!provider) {
    provider = createProvider(origin);
    providers.set(origin, provider);
  }
  return provider;
}
