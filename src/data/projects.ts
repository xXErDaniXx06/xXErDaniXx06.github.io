import type { Media } from './media';

// Proyectos en el orden en que se muestran. Aquí están los datos que no dependen del
// idioma; los textos (título, organización, descripción, hitos y etiquetas) están en
// src/i18n/, en `projects.items`, con la misma clave.

export type ProjectStatus = 'active' | 'completed';

/** Fecha ISO 8601 con la precisión conocida: `AAAA` o `AAAA-MM-DD`. */
export type IsoDate = `${number}` | `${number}-${number}-${number}`;

/**
 * Periodo de un proyecto: inicio y, si lo hay, fin (`present` si sigue en curso).
 * `long-term` es una aspiración sin fechas.
 */
export type Period = { start: IsoDate; end?: IsoDate | 'present' } | 'long-term';

interface ProjectFacts {
  id: string;
  status: ProjectStatus;
  period: Period;
  media: Media;
}

export const PROJECTS = [
  {
    id: 'ksat',
    status: 'active',
    period: { start: '2025-07-15', end: 'present' },
    media: { type: 'image', file: 'MST_Imagen.jpg' },
  },
  {
    id: 'emprendimiento',
    status: 'completed',
    period: { start: '2026-03-10', end: '2026-05-19' },
    media: { type: 'image', file: 'CursoEmprendimiento_Imagen.jpg' },
  },
  {
    id: 'kursaatelite',
    status: 'completed',
    period: { start: '2022-09-01', end: '2024-06-06' },
    media: { type: 'video', src: '/images/videos/kursaatelite-demo.mp4', poster: 'kursaatelite-poster.jpg' },
  },
  {
    id: 'kursaalmars',
    status: 'completed',
    period: { start: '2023-09-01', end: '2024-06-06' },
    media: { type: 'image', file: 'kursaalmars-team.jpg' },
  },
  {
    id: 'oracle',
    status: 'active',
    period: { start: '2024', end: 'present' },
    media: { type: 'image', file: 'Oracle_Image.jpg' },
  },
  {
    id: 'porunasonrisa',
    status: 'completed',
    period: { start: '2022' },
    media: { type: 'image', file: 'porunasonrisa.jpg' },
  },
  {
    id: 'sensordeco2',
    status: 'completed',
    period: { start: '2021' },
    media: { type: 'image', file: 'sensordeco2.png' },
  },
  {
    id: 'smartdoor',
    status: 'completed',
    period: { start: '2020' },
    media: { type: 'image', file: 'smartdoor.jpg' },
  },
  {
    id: 'dustnet',
    status: 'completed',
    period: { start: '2021' },
    media: { type: 'image', file: 'Dustnet_Image.png' },
  },
  {
    id: 'futuro',
    status: 'active',
    period: 'long-term',
    media: { type: 'image', file: 'FuturosProyectos_Image.jpg' },
  },
] as const satisfies readonly ProjectFacts[];

export type Project = (typeof PROJECTS)[number];
export type ProjectId = Project['id'];

export const PROJECT_IDS: readonly ProjectId[] = PROJECTS.map((p) => p.id);
