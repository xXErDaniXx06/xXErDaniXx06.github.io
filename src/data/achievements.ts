// Premios y reconocimientos, del más reciente al más antiguo. Aquí están los datos que
// no dependen del idioma; los textos (organismo, premio, título y descripción) están en
// src/i18n/, en `achievements.items`, con la misma clave.

/** Ámbito del reconocimiento. Su nombre en cada idioma está en `achievements.scopes`. */
export const SCOPE_IDS = [
  'international',
  'national',
  'regional',
  'local',
  'academic',
  'university',
  'institutional',
] as const;

export type ScopeId = (typeof SCOPE_IDS)[number];

interface AchievementFacts {
  id: string;
  /** Año o periodo de la edición. */
  year: string;
  /** Fecha tal como se muestra (día, año o periodo). */
  date: string;
  /** Fecha ISO 8601 para el atributo `datetime`. */
  datetime: string;
  scope: ScopeId;
}

export const ACHIEVEMENTS = [
  { id: 'eoi-entrepreneur-program', year: '2026', date: '19/05/2026', datetime: '2026-05-19', scope: 'national' },
  { id: 'talent-4-cyber', year: '2025', date: '2025', datetime: '2025-01-01', scope: 'national' },
  { id: 'malackaton-2025', year: '2025', date: '2025', datetime: '2025-01-01', scope: 'regional' },
  { id: 'crypto-trading-hackathon', year: '2025', date: '2025', datetime: '2025-01-01', scope: 'regional' },
  { id: 'malaga-space-team', year: '2025', date: '2025', datetime: '2025-01-01', scope: 'institutional' },
  { id: 'init-g', year: '2025', date: '2025', datetime: '2025-01-01', scope: 'national' },
  { id: 'oracle-summer-hit-song', year: '2025', date: '30/11/2024', datetime: '2024-11-30', scope: 'national' },
  { id: 'honors-degree', year: '2024', date: '2024', datetime: '2024-06-01', scope: 'academic' },
  { id: 'catch-a-star', year: '2024', date: '18/05/2024', datetime: '2024-05-18', scope: 'international' },
  { id: 'malackaton-2024', year: '2024', date: '2024', datetime: '2024-04-01', scope: 'regional' },
  { id: 'cambridge-c1', year: '2024', date: '2024', datetime: '2024-03-01', scope: 'international' },
  { id: 'diverciencia', year: '2024', date: '2024', datetime: '2024-02-01', scope: 'regional' },
  { id: 'ciencia-en-accion-astronomy', year: '2023', date: '29/10/2023', datetime: '2023-10-29', scope: 'national' },
  { id: 'open-science-cambre', year: '2023', date: '12/09/2023', datetime: '2023-09-12', scope: 'regional' },
  { id: 'cadiz-programming-champion', year: '2023', date: '2023', datetime: '2023-07-01', scope: 'regional' },
  { id: 'cadiz-research-award', year: '2023', date: '2023', datetime: '2023-06-01', scope: 'regional' },
  { id: 'infomatrix-2023', year: '2023', date: '2023', datetime: '2023-03-01', scope: 'international' },
  { id: 'cansat-esero', year: '2022–2023', date: '2022–2023', datetime: '2022-09-01', scope: 'international' },
  { id: 'servet-balloons', year: '2022–2023', date: '2022–2023', datetime: '2022-09-01', scope: 'national' },
  { id: 'ciencia-en-accion-steam', year: '2022', date: '29/10/2022', datetime: '2022-10-29', scope: 'national' },
  { id: 'infomatrix-2022', year: '2022', date: '2022', datetime: '2022-03-01', scope: 'international' },
  { id: 'infomatrix-2021', year: '2021', date: '19/03/2021', datetime: '2021-03-19', scope: 'international' },
  { id: 'cepsa-foundation', year: '2021', date: '2021', datetime: '2021-06-01', scope: 'regional' },
  { id: 'uca-scholarship', year: '2021', date: '25/06/2021', datetime: '2021-06-25', scope: 'university' },
  { id: 'uex-science-fair', year: '2020', date: '2020', datetime: '2020-06-01', scope: 'regional' },
  { id: 'algeciras-young-researchers', year: '2019–2024', date: '2019–2024', datetime: '2019-01-01', scope: 'local' },
] as const satisfies readonly AchievementFacts[];

export type Achievement = (typeof ACHIEVEMENTS)[number];
export type AchievementId = Achievement['id'];

/** Primer y último año con reconocimientos, p. ej. «2019–2026». */
export function achievementYearRange(): string {
  const years = ACHIEVEMENTS.flatMap((a) => a.year.split('–').map(Number));
  return `${Math.min(...years)}–${Math.max(...years)}`;
}
