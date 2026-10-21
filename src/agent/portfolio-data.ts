// Contenido del porfolio como datos estructurados: la API JSON (/api/v1/{lang}/*.json)
// y las herramientas del servidor MCP devuelven exactamente esto.

import { imagePath, mediaPath, PROFILE_PHOTOS } from '../data/media';
import { pageHref } from '../data/pages';
import { CONTACT, PERSON_NAME } from '../data/profile';
import { getDictionary, type Lang } from '../i18n';
import { absoluteUrl, toMarkdown, toPlainText } from '../lib/text';
import { getAchievements, getAchievementsSummary, getProjects, getSkillCategories } from '../portfolio';

export function getPortfolioData(lang: Lang, origin: string) {
  const t = getDictionary(lang);
  const url = (path: string) => absoluteUrl(origin, path);
  const cvUrl = url(CONTACT.cvPath);
  const achievements = getAchievementsSummary(lang);

  return {
    lang,
    name: PERSON_NAME,
    url: url(pageHref(lang, 'index')),
    profile: {
      name: PERSON_NAME,
      greeting: t.home.greeting,
      availability: t.home.availability,
      role: t.home.role,
      role_tagline: t.home.roleTagline,
      about: t.home.about,
      photos: PROFILE_PHOTOS.map((photo) => url(imagePath(photo.file))),
      cv_url: cvUrl,
      url: url(pageHref(lang, 'index')),
    },
    projects: {
      tag: t.projects.tag,
      title: t.projects.title + t.projects.titleHighlight,
      subtitle: t.projects.subtitle,
      url: url(pageHref(lang, 'proyectos')),
      items: getProjects(lang).map((p) => ({
        id: p.id,
        title: p.title,
        organization: p.organization,
        period: p.period.text,
        status: p.status,
        status_label: p.statusLabel,
        description: toPlainText(p.description),
        description_markdown: toMarkdown(p.description),
        milestones: [...p.milestones],
        tags: [...p.tags],
        media: { type: p.media.type, url: url(mediaPath(p.media)) },
        url: url(`${pageHref(lang, 'proyectos')}#project-${p.id}`),
      })),
    },
    skills: {
      tag: t.skills.tag,
      title: t.skills.title + t.skills.titleHighlight,
      subtitle: t.skills.subtitle,
      url: url(pageHref(lang, 'habilidades')),
      categories: getSkillCategories(lang).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        skills: c.skills.map(({ name, note }) => ({ name, note })),
        url: url(`${pageHref(lang, 'habilidades')}#skills-block-${c.id}`),
      })),
    },
    achievements: {
      tag: achievements.tag,
      title: achievements.title,
      summary: achievements.summary,
      footer: achievements.footer,
      total: achievements.total,
      scopes: achievements.scopes,
      url: url(pageHref(lang, 'logros')),
      items: getAchievements(lang).map((a) => ({
        year: a.year,
        date: a.date,
        datetime: a.datetime,
        scope: a.scopeLabel,
        organization: a.organization,
        prize: a.prize,
        title: a.title,
        description: a.description,
      })),
    },
    contact: {
      tag: t.contact.tag,
      title: t.contact.title,
      heading: t.contact.info.title,
      description: t.contact.info.description,
      personal_email: CONTACT.personalEmail,
      uma_email: CONTACT.umaEmail,
      phone: CONTACT.phone.e164,
      phone_display: CONTACT.phone.display,
      linkedin: CONTACT.linkedin.url,
      github: CONTACT.github.url,
      cv_url: cvUrl,
      meetings: t.contact.info.meetings,
      languages: t.contact.info.languages,
      url: url(pageHref(lang, 'contacto')),
      form: {
        title: t.contact.form.title,
        fields: {
          name: t.contact.form.name,
          email: t.contact.form.email,
          subject: t.contact.form.subject,
          message: t.contact.form.message,
        },
        submit: t.contact.form.submit,
        notice: toPlainText(t.contact.form.notice),
      },
    },
  };
}

export type PortfolioData = ReturnType<typeof getPortfolioData>;
