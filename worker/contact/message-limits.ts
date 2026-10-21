// Límites de mensajes para proteger el buzón de Daniel y la cuota de EmailJS: por
// remitente y hora (una IP en la web, una autorización en MCP) y en total por día.
// Los contadores viven en KV, que es eventualmente consistente: son límites aproximados.

export type LimitExceeded = 'hourly_limit' | 'daily_limit';

export interface MessageLimits {
  /** Comprueba los límites de un remitente; null si puede enviar. */
  check(senderKey: string, perHour: number): Promise<LimitExceeded | null>;
  /** Cuenta un mensaje enviado. */
  record(senderKey: string): Promise<void>;
}

/** Mensajes en total al día, entre la web y los agentes. */
export const MESSAGES_PER_DAY = 20;

const HOUR = 3600;
const DAY = 86_400;

export class KvMessageLimits implements MessageLimits {
  constructor(
    private readonly kv: KVNamespace,
    private readonly perDay = MESSAGES_PER_DAY,
    private readonly now: () => Date = () => new Date(),
  ) {}

  #keys(senderKey: string): { hour: string; day: string } {
    const iso = this.now().toISOString();
    return {
      hour: `contact-limit:sender:${senderKey}:${iso.slice(0, 13)}`,
      day: `contact-limit:day:${iso.slice(0, 10)}`,
    };
  }

  async check(senderKey: string, perHour: number): Promise<LimitExceeded | null> {
    const keys = this.#keys(senderKey);
    const [hour, day] = await Promise.all([this.kv.get(keys.hour), this.kv.get(keys.day)]);
    if (Number(hour ?? 0) >= perHour) return 'hourly_limit';
    if (Number(day ?? 0) >= this.perDay) return 'daily_limit';
    return null;
  }

  async record(senderKey: string): Promise<void> {
    const keys = this.#keys(senderKey);
    await Promise.all([this.#increment(keys.hour, 2 * HOUR), this.#increment(keys.day, 2 * DAY)]);
  }

  async #increment(key: string, ttlSeconds: number): Promise<void> {
    const current = Number.parseInt((await this.kv.get(key)) ?? '0', 10) || 0;
    await this.kv.put(key, String(current + 1), { expirationTtl: ttlSeconds });
  }
}
