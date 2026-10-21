import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getPortfolioData } from '../src/agent/portfolio-data';
import { achievementYearRange, ACHIEVEMENTS } from '../src/data/achievements';
import { PROFILE_PHOTOS } from '../src/data/media';
import { PROJECTS } from '../src/data/projects';
import { getDictionary, LANGS } from '../src/i18n';
import { formatIsoDate, formatPeriod, getAchievementsSummary, getProjects } from '../src/portfolio';

const ORIGIN = 'https://example.test';

describe('periodos', () => {
  const t = getDictionary('es');

  it('formatea fechas ISO como en la web', () => {
    expect(formatIsoDate('2025-07-15')).toBe('15/07/2025');
    expect(formatIsoDate('2024')).toBe('2024');
  });

  it('periodo en curso, cerrado, de un año y sin fechas', () => {
    expect(formatPeriod({ start: '2025-07-15', end: 'present' }, t)).toEqual({
      text: '15/07/2025 – Actualidad',
      start: { text: '15/07/2025', datetime: '2025-07-15' },
      end: { text: 'Actualidad' },
    });
    expect(formatPeriod({ start: '2026-03-10', end: '2026-05-19' }, t).text).toBe('10/03/2026 – 19/05/2026');
    expect(formatPeriod({ start: '2022' }, t)).toEqual({ text: '2022', start: { text: '2022', datetime: '2022' } });
    expect(formatPeriod('long-term', t)).toEqual({ text: 'Enfoque a Largo Plazo' });
  });
});

describe('contenido del porfolio', () => {
  it('mantiene el orden y los datos de los proyectos', () => {
    for (const lang of LANGS) {
      const projects = getProjects(lang);
      expect(projects.map((p) => p.id)).toEqual(PROJECTS.map((p) => p.id));
      expect(projects.every((p) => p.milestones.length > 0 && p.tags.length > 0)).toBe(true);
    }
  });

  it('el periodo de los reconocimientos sale de los datos', () => {
    expect(achievementYearRange()).toBe('2019–2026');
    expect(getAchievementsSummary('es')).toMatchObject({
      tag: 'Reconocimientos · 2019–2026',
      total: ACHIEVEMENTS.length,
      summary: `${ACHIEVEMENTS.length} reconocimientos en más de 6 años: competiciones internacionales, hackathons, investigación aeroespacial e inteligencia artificial.`,
    });
  });

  it('todas las imágenes y vídeos existen', () => {
    for (const photo of PROFILE_PHOTOS) expect(existsSync(`src/assets/images/${photo.file}`)).toBe(true);
    for (const { media } of PROJECTS) {
      if (media.type === 'image') expect(existsSync(`src/assets/images/${media.file}`)).toBe(true);
      else {
        expect(existsSync(`public${media.src}`)).toBe(true);
        expect(existsSync(`src/assets/images/${media.poster}`)).toBe(true);
      }
    }
  });

  it('la API JSON enlaza cada elemento con su página y su imagen estable', () => {
    const data = getPortfolioData('en', ORIGIN);
    expect(data.url).toBe(`${ORIGIN}/en/`);
    expect(data.profile.photos).toEqual([`${ORIGIN}/images/profile2.jpeg`, `${ORIGIN}/images/profile.jpg`]);
    expect(data.projects.items[0]).toMatchObject({
      id: 'ksat',
      status: 'active',
      period: '15/07/2025 – Present',
      media: { type: 'image', url: `${ORIGIN}/images/MST_Imagen.jpg` },
      url: `${ORIGIN}/en/proyectos#project-ksat`,
    });
    expect(data.projects.items.find((p) => p.id === 'kursaatelite')?.media).toEqual({
      type: 'video',
      url: `${ORIGIN}/images/videos/kursaatelite-demo.mp4`,
    });
    expect(data.achievements.items).toHaveLength(ACHIEVEMENTS.length);
    expect(data.skills.categories.map((c) => c.url)).toContain(`${ORIGIN}/en/habilidades#skills-block-languages`);
    expect(data.contact.form.notice).not.toMatch(/<[^>]+>/);
  });
});
