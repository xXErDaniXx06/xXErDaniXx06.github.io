import type { ContactMessage } from '../../src/lib/contact';

/** Mensaje listo para enviar a Daniel. */
export interface OutgoingMessage extends ContactMessage {
  /** Texto que se añade al final del mensaje (p. ej. por qué canal llegó). */
  footer?: string;
}

/** Canal por el que se entrega un mensaje (EmailJS en producción, un doble en las pruebas). */
export interface MessageSender {
  /** Entrega el mensaje; lanza un error si no se pudo. */
  send(message: OutgoingMessage): Promise<void>;
}
