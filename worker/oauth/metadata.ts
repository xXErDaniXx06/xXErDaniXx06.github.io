// Metadatos de descubrimiento OAuth que completan los que genera la librería.

import { MCP_PATH, MCP_SCOPES } from '../../src/agent/mcp-info';
import { PERSON_NAME } from '../../src/data/profile';

export const PROTECTED_RESOURCE_PATH = '/.well-known/oauth-protected-resource';
export const AUTHORIZATION_SERVER_PATH = '/.well-known/oauth-authorization-server';

/**
 * Bloque agent_auth (auth.md, vocabulario v0.1 que validan los escáneres) que se añade a
 * los metadatos RFC 8414. El registro de agentes es el registro dinámico de clientes OAuth
 * (RFC 7591) y el «claim» es la página de autorización, donde una persona aprueba la
 * conexión tras un CAPTCHA. Los agentes son anónimos: no hay cuentas de usuario.
 * El funcionamiento completo se explica en /auth.md.
 */
export function authorizationServerExtras(origin: string) {
  return {
    service_documentation: `${origin}/auth.md`,
    agent_auth: {
      skill: `${origin}/auth.md`,
      register_uri: `${origin}/oauth/register`,
      claim_uri: `${origin}/authorize`,
      identity_types_supported: ['anonymous'],
      anonymous: { credential_types_supported: ['access_token'] },
    },
  };
}

/**
 * Metadatos RFC 9728 del origen (/.well-known/oauth-protected-resource). El único recurso
 * protegido del sitio es el servidor MCP (/mcp), que publica los suyos en
 * /.well-known/oauth-protected-resource/mcp; los tokens que se piden para el origen se
 * emiten para /mcp (ver normalizeResource).
 */
export function originResourceMetadata(origin: string) {
  return {
    resource: origin,
    authorization_servers: [origin],
    scopes_supported: [MCP_SCOPES.read],
    bearer_methods_supported: ['header'],
    resource_name: `${PERSON_NAME} — portfolio`,
    resource_documentation: `${origin}/auth.md`,
  };
}

/** Metadatos RFC 9728 del servidor MCP, para la librería OAuth. */
export function mcpResourceMetadata(origin: string) {
  return {
    resource: `${origin}${MCP_PATH}`,
    authorization_servers: [origin],
    bearer_methods_supported: ['header'],
    resource_name: `${PERSON_NAME} — Portfolio MCP server`,
  };
}

/** Si un cliente pide un token para el origen, se le asigna el del servidor MCP. */
export const normalizeResource = (value: string, origin: string): string =>
  value === origin || value === `${origin}/` ? `${origin}${MCP_PATH}` : value;
