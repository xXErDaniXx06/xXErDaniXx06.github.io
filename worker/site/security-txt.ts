import { renderSecurityTxt } from '../../src/agent/security-txt';
import { PUBLIC_CORS } from '../http/headers';

/**
 * /.well-known/security.txt (RFC 9116). Se genera en cada petición: así su caducidad nunca
 * vence mientras la web siga publicada, y los datos de contacto son los mismos que los de la web.
 */
export const serveSecurityTxt = (request: Request, origin: string): Response =>
  new Response(request.method === 'HEAD' ? null : renderSecurityTxt(origin, new Date()), {
    headers: {
      ...PUBLIC_CORS,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
