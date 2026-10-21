// Entrega de los mensajes con la API REST de EmailJS, con la misma plantilla que usaba
// el formulario de la web. Requiere la opción «Allow EmailJS API for non-browser
// applications» y la clave privada (secreto EMAILJS_PRIVATE_KEY).

import type { HttpClient } from '../http/client';
import type { MessageSender, OutgoingMessage } from './message-sender';

const EMAILJS_SEND = 'https://api.emailjs.com/api/v1.0/email/send';

export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey: string;
}

export class EmailJsSender implements MessageSender {
  constructor(
    private readonly config: EmailJsConfig,
    private readonly http: HttpClient,
  ) {}

  async send(message: OutgoingMessage): Promise<void> {
    const response = await this.http(EMAILJS_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: this.config.serviceId,
        template_id: this.config.templateId,
        user_id: this.config.publicKey,
        accessToken: this.config.privateKey,
        template_params: {
          to_name: 'Daniel',
          from_name: message.name,
          from_email: message.email,
          subject: message.subject,
          message: message.footer ? `${message.message}\n\n—\n${message.footer}` : message.message,
          // La plantilla usa estas en las cabeceras: remitente, Reply-To y asunto
          name: message.name,
          email: message.email,
          title: message.subject,
        },
      }),
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 200);
      throw new Error(`EmailJS respondió ${response.status}: ${detail}`);
    }
  }
}
