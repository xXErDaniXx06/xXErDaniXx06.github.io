// Envío de mensajes de contacto desde el servidor MCP, por el mismo canal que el
// formulario de /contacto (EmailJS), con límites para proteger el buzón de Daniel.

import { signedFetch } from './web-bot-auth.js';

const LIMITS = {
  perUserPerHour: 3, // por autorización (cada una exige pasar Turnstile)
  globalPerDay: 20, // entre todos los agentes
};

export const MESSAGE_LIMITS = { name: 100, email: 100, subject: 100, message: 3000 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateMessage({ name, email, subject, message }) {
  const fields = { name, email, subject, message };
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== 'string' || !value.trim()) return `El campo "${key}" es obligatorio.`;
    if (value.length > MESSAGE_LIMITS[key]) return `El campo "${key}" supera ${MESSAGE_LIMITS[key]} caracteres.`;
  }
  if (!EMAIL_RE.test(email.trim())) return 'El email no es válido.';
  return null;
}

async function bump(env, key, ttlSeconds) {
  const current = Number.parseInt((await env.OAUTH_KV.get(key)) || '0', 10);
  await env.OAUTH_KV.put(key, String(current + 1), { expirationTtl: ttlSeconds });
  return current;
}

async function overLimit(env, userId) {
  const now = new Date();
  const hourKey = `contact-limit:user:${userId}:${now.toISOString().slice(0, 13)}`;
  const dayKey = `contact-limit:day:${now.toISOString().slice(0, 10)}`;
  const [userCount, dayCount] = await Promise.all([env.OAUTH_KV.get(hourKey), env.OAUTH_KV.get(dayKey)]);
  if (Number(userCount || 0) >= LIMITS.perUserPerHour) return 'Límite alcanzado: máximo 3 mensajes por hora y autorización.';
  if (Number(dayCount || 0) >= LIMITS.globalPerDay) return 'Límite diario de mensajes alcanzado. Escribe directamente a danielcarrascogarcia18@gmail.com.';
  return async () => {
    await Promise.all([bump(env, hourKey, 2 * 3600), bump(env, dayKey, 2 * 86400)]);
  };
}

/**
 * Envía el mensaje con la API REST de EmailJS (misma plantilla que el formulario web).
 * Devuelve { ok: true } o { ok: false, error }.
 */
export async function sendContactMessage(env, input, sender) {
  const invalid = validateMessage(input);
  if (invalid) return { ok: false, error: invalid };

  if (!env.EMAILJS_PRIVATE_KEY || !env.EMAILJS_SERVICE_ID || !env.EMAILJS_TEMPLATE_ID || !env.EMAILJS_PUBLIC_KEY) {
    return { ok: false, error: 'El envío de mensajes no está configurado en este servidor. Escribe a danielcarrascogarcia18@gmail.com.' };
  }

  const limit = await overLimit(env, sender.userId);
  if (typeof limit === 'string') return { ok: false, error: limit };

  const footer = `\n\n—\nEnviado a través del servidor MCP del porfolio por el cliente "${sender.clientName}".`;
  const response = await signedFetch(env, 'https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      accessToken: env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_name: 'Daniel',
        from_name: input.name.trim(),
        from_email: input.email.trim(),
        subject: input.subject.trim(),
        message: input.message.trim() + footer,
        // La plantilla usa estas en las cabeceras: remitente, Reply-To y asunto
        name: input.name.trim(),
        email: input.email.trim(),
        title: input.subject.trim(),
      },
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    console.error('EmailJS error', response.status, detail);
    return { ok: false, error: 'No se pudo enviar el mensaje. Inténtalo más tarde o escribe a danielcarrascogarcia18@gmail.com.' };
  }
  await limit();
  return { ok: true };
}
