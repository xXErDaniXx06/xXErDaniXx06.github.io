// Reglas de los mensajes de contacto, compartidas por el formulario de la web, la API
// (POST /api/v1/contact) y la herramienta MCP send_contact_message.

export const MESSAGE_LIMITS = { name: 100, email: 100, subject: 100, message: 3000 } as const;

export type MessageField = keyof typeof MESSAGE_LIMITS;

export type ContactMessage = Record<MessageField, string>;

export const MESSAGE_FIELDS = Object.keys(MESSAGE_LIMITS) as MessageField[];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Errores que puede devolver el envío de un mensaje. */
export type ContactError =
  | 'required'
  | 'invalid_email'
  | 'too_long'
  | 'rate_limited'
  | 'hourly_limit'
  | 'daily_limit'
  | 'verification_failed'
  | 'unavailable'
  | 'send_failed';

export interface ValidationFailure {
  error: Extract<ContactError, 'required' | 'invalid_email' | 'too_long'>;
  field: MessageField;
}

/** Comprueba un mensaje; null si es válido. */
export function validateMessage(input: Partial<Record<MessageField, unknown>>): ValidationFailure | null {
  for (const field of MESSAGE_FIELDS) {
    const value = input[field];
    if (typeof value !== 'string' || !value.trim()) return { error: 'required', field };
    if (value.length > MESSAGE_LIMITS[field]) return { error: 'too_long', field };
  }
  if (!EMAIL_PATTERN.test(String(input.email).trim())) return { error: 'invalid_email', field: 'email' };
  return null;
}

/** El mensaje con los espacios sobrantes recortados. */
export const normalizeMessage = (input: ContactMessage): ContactMessage => ({
  name: input.name.trim(),
  email: input.email.trim(),
  subject: input.subject.trim(),
  message: input.message.trim(),
});
