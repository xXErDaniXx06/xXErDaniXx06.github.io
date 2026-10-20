// Genera la clave Ed25519 de Web Bot Auth y la imprime como JWK en una línea.
// Uso: npm run wba:key   →   copia la salida en el secreto WEB_BOT_AUTH_PRIVATE_KEY
//      (npx wrangler secret put WEB_BOT_AUTH_PRIVATE_KEY, o en el panel de Cloudflare).
const { privateKey } = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
const jwk = await crypto.subtle.exportKey('jwk', privateKey);
console.log(JSON.stringify({ kty: jwk.kty, crv: jwk.crv, x: jwk.x, d: jwk.d }));
