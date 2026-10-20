// Metadatos de descubrimiento OAuth que completan los que genera la librería.

import { SCOPES } from './mcp.js';

/**
 * Bloque agent_auth (auth.md, vocabulario v0.1 que validan los escáneres) que se añade
 * a los metadatos RFC 8414. El registro de agentes es el registro dinámico de clientes
 * OAuth (RFC 7591) y el "claim" es la página de autorización, donde una persona aprueba
 * la conexión tras un CAPTCHA. Los agentes son anónimos: no hay cuentas de usuario.
 * El funcionamiento completo se explica en /auth.md.
 */
export function augmentAuthorizationServerMetadata(origin) {
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
export function originResourceMetadata(origin) {
  return {
    resource: origin,
    authorization_servers: [origin],
    scopes_supported: [SCOPES.read],
    bearer_methods_supported: ['header'],
    resource_name: 'Daniel Carrasco García — portfolio',
    resource_documentation: `${origin}/auth.md`,
  };
}

/** Si un cliente pide un token para el origen, se le asigna el del servidor MCP. */
export function normalizeResource(value, origin) {
  return value === origin || value === `${origin}/` ? `${origin}/mcp` : value;
}
