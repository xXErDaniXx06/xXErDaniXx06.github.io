// Envío de mensajes de contacto: valida, aplica los límites y entrega el mensaje.
// Lo usan el formulario de la web (POST /api/v1/contact) y la herramienta MCP
// send_contact_message, cada uno con su forma de identificar al remitente.

import {
  normalizeMessage,
  validateMessage,
  type ContactError,
  type ContactMessage,
  type MessageField,
} from '../../src/lib/contact';
import type { MessageLimits } from './message-limits';
import type { MessageSender } from './message-sender';

export interface SenderIdentity {
  /** Clave para los límites por remitente (p. ej. «web:<hash de la IP>» o «mcp:<usuario>»). */
  key: string;
  /** Mensajes por hora permitidos a este remitente. */
  perHour: number;
  /** Texto que se añade al final del mensaje. */
  footer?: string;
}

export type ContactResult = { ok: true } | { ok: false; error: ContactError; field?: MessageField };

export class ContactService {
  constructor(
    /** null si el envío no está configurado (faltan las claves de EmailJS). */
    private readonly sender: MessageSender | null,
    private readonly limits: MessageLimits,
    private readonly log: (message: string, error: unknown) => void = console.error,
  ) {}

  async send(input: Partial<Record<MessageField, unknown>>, from: SenderIdentity): Promise<ContactResult> {
    const invalid = validateMessage(input);
    if (invalid) return { ok: false, error: invalid.error, field: invalid.field };
    if (!this.sender) return { ok: false, error: 'unavailable' };

    const exceeded = await this.limits.check(from.key, from.perHour);
    if (exceeded) return { ok: false, error: exceeded };

    const message = normalizeMessage(input as ContactMessage);
    try {
      await this.sender.send(from.footer ? { ...message, footer: from.footer } : message);
    } catch (error) {
      this.log('No se pudo enviar un mensaje de contacto', error);
      return { ok: false, error: 'send_failed' };
    }
    await this.limits.record(from.key);
    return { ok: true };
  }
}
