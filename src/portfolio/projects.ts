import type { Media } from '../data/media';
import { PROJECTS, type IsoDate, type Period, type ProjectId, type ProjectStatus } from '../data/projects';
import { getDictionary, type Dictionary, type Lang } from '../i18n';

/** Parte de un periodo: el texto que se muestra y, si es una fecha, su valor ISO. */
export interface PeriodPart {
  text: string;
  datetime?: string;
}

export interface PeriodView {
  /** Periodo completo como texto: «15/07/2025 – Actualidad». */
  text: string;
  start?: PeriodPart;
  end?: PeriodPart;
}

export interface LocalizedProject {
  id: ProjectId;
  title: string;
  organization: string;
  status: ProjectStatus;
  statusLabel: string;
  period: PeriodView;
  /** HTML en línea. */
  description: string;
  milestones: readonly string[];
  tags: readonly string[];
  media: Media;
}

/** `2025-07-15` → `15/07/2025`; un año se muestra tal cual. */
export const formatIsoDate = (date: IsoDate): string => date.split('-').reverse().join('/');

export function formatPeriod(period: Period, t: Dictionary): PeriodView {
  if (period === 'long-term') return { text: t.projects.longTerm };
  const start: PeriodPart = { text: formatIsoDate(period.start), datetime: period.start };
  if (!period.end) return { text: start.text, start };
  const end: PeriodPart =
    period.end === 'present' ? { text: t.projects.present } : { text: formatIsoDate(period.end), datetime: period.end };
  return { text: `${start.text} – ${end.text}`, start, end };
}

export function getProjects(lang: Lang): LocalizedProject[] {
  const t = getDictionary(lang);
  return PROJECTS.map((project) => {
    const text = t.projects.items[project.id];
    return {
      id: project.id,
      title: text.title,
      organization: text.organization,
      status: project.status,
      statusLabel: project.status === 'active' ? t.projects.statusActive : t.projects.statusCompleted,
      period: formatPeriod(project.period, t),
      description: text.description,
      milestones: text.milestones,
      tags: text.tags,
      media: project.media,
    };
  });
}
