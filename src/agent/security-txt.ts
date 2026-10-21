// security.txt (RFC 9116): a quién avisar de un fallo de seguridad en la web.

import { pageHref } from '../data/pages';
import { CONTACT } from '../data/profile';
import { DEFAULT_LANG, LANGS } from '../i18n';
import { absoluteUrl } from '../lib/text';

export const SECURITY_TXT_PATH = '/.well-known/security.txt';

/** El RFC pide que caduque antes de un año. */
const VALIDITY_DAYS = 360;

/** Contenido de security.txt, con la caducidad contada desde `now`. */
export function renderSecurityTxt(origin: string, now: Date): string {
  const expires = new Date(now.getTime() + VALIDITY_DAYS * 24 * 60 * 60 * 1000);
  return [
    `Contact: mailto:${CONTACT.personalEmail}`,
    `Contact: ${absoluteUrl(origin, pageHref(DEFAULT_LANG, 'contacto'))}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    `Preferred-Languages: ${LANGS.join(', ')}`,
    `Canonical: ${absoluteUrl(origin, SECURITY_TXT_PATH)}`,
    '',
  ].join('\n');
}
