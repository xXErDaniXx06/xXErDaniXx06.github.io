// Envío del formulario de contacto (components/contact/ContactForm.astro) a la API del
// Worker, con una comprobación de Cloudflare Turnstile que se carga cuando la persona
// empieza a rellenarlo, para no cargar nada de terceros al abrir la página.

import { TURNSTILE_SCRIPT } from '../config/turnstile';
import { MESSAGE_FIELDS, validateMessage, type ContactError, type ContactMessage } from '../lib/contact';
import { trustedScriptUrl } from './trusted-types';

interface Messages {
  submit: string;
  sending: string;
  success: string;
  errors: Record<
    'required' | 'invalidEmail' | 'tooLong' | 'rateLimit' | 'hourlyLimit' | 'dailyLimit' | 'verification' | 'sending',
    string
  >;
}

interface TurnstileOptions {
  sitekey: string;
  action: string;
  execution: 'execute';
  appearance: 'interaction-only';
  theme: 'auto';
  language: string;
  callback: (token: string) => void;
  'error-callback': () => void;
}

interface Turnstile {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
  interface SubmitEvent {
    /** WebMCP: el envío lo ha iniciado un agente. */
    agentInvoked?: boolean;
    /** WebMCP: devuelve al agente el resultado del envío. */
    respondWith?: (result: Promise<string>) => void;
  }
}

const ERROR_MESSAGES: Record<ContactError, keyof Messages['errors']> = {
  required: 'required',
  invalid_email: 'invalidEmail',
  too_long: 'tooLong',
  rate_limited: 'rateLimit',
  hourly_limit: 'hourlyLimit',
  daily_limit: 'dailyLimit',
  verification_failed: 'verification',
  unavailable: 'sending',
  send_failed: 'sending',
};

class ContactFormError extends Error {}

/** Carga Turnstile una sola vez y devuelve tokens nuevos bajo demanda. */
class TurnstileChallenge {
  #widgetId: string | undefined;
  #loading: Promise<Turnstile> | undefined;
  #pending: { resolve: (token: string) => void; reject: (error: Error) => void } | undefined;

  constructor(
    private readonly container: HTMLElement,
    private readonly siteKey: string,
    private readonly language: string,
  ) {}

  /** Empieza a cargar el script de Turnstile (sin esperar). */
  warmUp(): void {
    this.#load().catch(() => {
      // Se volverá a intentar al enviar.
    });
  }

  async token(): Promise<string> {
    const turnstile = await this.#load();
    if (this.#widgetId === undefined) {
      this.#widgetId = turnstile.render(this.container, {
        sitekey: this.siteKey,
        action: 'contact',
        execution: 'execute',
        appearance: 'interaction-only',
        theme: 'auto',
        language: this.language,
        callback: (token) => this.#pending?.resolve(token),
        'error-callback': () => this.#pending?.reject(new Error('turnstile')),
      });
    } else {
      turnstile.reset(this.#widgetId);
    }
    const token = new Promise<string>((resolve, reject) => {
      this.#pending = { resolve, reject };
      setTimeout(() => reject(new Error('turnstile timeout')), 60_000);
    });
    turnstile.execute(this.#widgetId);
    return token;
  }

  #load(): Promise<Turnstile> {
    this.#loading ??= new Promise<Turnstile>((resolve, reject) => {
      if (window.turnstile) return resolve(window.turnstile);
      const script = document.createElement('script');
      // Con Trusted Types la URL tiene que pasar por la política (src/scripts/trusted-types.ts)
      script.src = trustedScriptUrl(`${TURNSTILE_SCRIPT}?render=explicit`);
      script.async = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
      script.onerror = () => {
        this.#loading = undefined;
        reject(new Error('turnstile'));
      };
      document.head.append(script);
    });
    return this.#loading;
  }
}

function setUp(form: HTMLFormElement): void {
  const messages = JSON.parse(form.dataset.messages ?? '{}') as Messages;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const container = form.querySelector<HTMLElement>('[data-turnstile]');
  if (!status || !button || !label || !container) return;
  const challenge = new TurnstileChallenge(container, form.dataset.sitekey ?? '', form.dataset.lang ?? 'es');

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;

  const showStatus = (text: string, kind: 'success' | 'error') => {
    status.textContent = text;
    status.className = `rounded-md px-4 py-3 text-sm font-medium ${
      kind === 'success' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
    }`;
  };

  const setSending = (sending: boolean) => {
    button.disabled = sending;
    label.textContent = sending ? messages.sending : messages.submit;
  };

  const values = (): ContactMessage =>
    Object.fromEntries(MESSAGE_FIELDS.map((name) => [name, field(name).value])) as ContactMessage;

  async function send(): Promise<string> {
    for (const name of MESSAGE_FIELDS) field(name).removeAttribute('aria-invalid');
    const message = values();
    const invalid = validateMessage(message);
    if (invalid) {
      const input = field(invalid.field);
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      throw new ContactFormError(messages.errors[ERROR_MESSAGES[invalid.error]]);
    }

    setSending(true);
    try {
      let token: string;
      try {
        token = await challenge.token();
      } catch {
        throw new ContactFormError(messages.errors.verification);
      }
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...message, lang: form.dataset.lang, token }),
      }).catch(() => undefined);
      const result = (await response?.json().catch(() => undefined)) as
        { ok?: boolean; error?: ContactError } | undefined;
      if (!response?.ok || !result?.ok) {
        throw new ContactFormError(messages.errors[ERROR_MESSAGES[result?.error ?? 'send_failed']]);
      }
      form.reset();
      return messages.success;
    } finally {
      setSending(false);
    }
  }

  form.addEventListener('focusin', () => challenge.warmUp(), { once: true });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = send().then(
      (text) => {
        showStatus(text, 'success');
        return text;
      },
      (error: unknown) => {
        const text = error instanceof ContactFormError ? error.message : messages.errors.sending;
        showStatus(text, 'error');
        throw new Error(text);
      },
    );
    // WebMCP declarativo: si lo ha enviado un agente, recibe el resultado.
    if (event.agentInvoked && typeof event.respondWith === 'function') event.respondWith(result);
    else result.catch(() => undefined);
  });
}

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) setUp(form);
