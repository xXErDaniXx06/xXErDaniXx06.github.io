// Escanea la web con isitagentready.com y comprueba que sigue en el máximo:
// puntuación 100 y nivel 5 (Agent-Native). Sale con código 1 si no lo está.
// Uso: npm run score [-- https://otra-url]
const url = process.argv[2] || 'https://danielcarrascogarcia.me';

// Igual que la página del escáner: commerce no puntúa, y las comprobaciones
// neutrales o solo informativas no cuentan para el total.
const NOT_SCORED = new Set(['a2aAgentCard', 'ap2', 'personalAgentProtocol']);

const response = await fetch('https://isitagentready.com/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url }),
});
if (!response.ok) {
  console.error(`El escáner respondió ${response.status}`);
  process.exit(1);
}
const result = await response.json();

let passed = 0;
let total = 0;
const failing = [];
for (const [category, checks] of Object.entries(result.checks)) {
  if (category === 'commerce') continue;
  for (const [name, check] of Object.entries(checks)) {
    if (NOT_SCORED.has(name) || check.status === 'neutral') continue;
    total += 1;
    if (check.status === 'pass') passed += 1;
    else failing.push(`  - ${name} (${check.status}): ${check.message}`);
  }
}

const score = total ? Math.round((passed / total) * 100) : 0;
console.log(`${url}: ${score}/100 (${passed}/${total}) · nivel ${result.level} ${result.levelName}`);
if (failing.length) console.log(`No superadas:\n${failing.join('\n')}`);
process.exit(score === 100 && result.level === 5 ? 0 : 1);
