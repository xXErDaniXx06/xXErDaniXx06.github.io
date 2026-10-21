// Versión Markdown de cada página (/es/proyectos.md…), con el mismo contenido que la
// página HTML. El Worker la sirve también en la URL HTML cuando llega Accept: text/markdown.

import { markdownHref, PAGE_IDS, pageHref, type PageId } from '../data/pages';
import { CONTACT, PERSON_NAME } from '../data/profile';
import { getDictionary, LANGS, type Dictionary, type Lang } from '../i18n';
import { absoluteUrl, toMarkdown } from '../lib/text';
import { getPortfolioData, type PortfolioData } from './portfolio-data';

interface RenderContext {
  lang: Lang;
  origin: string;
  t: Dictionary;
  data: PortfolioData;
}

type PageRenderer = (ctx: RenderContext) => string[];

const renderHome: PageRenderer = ({ lang, origin, t, data }) => {
  const h = t.home;
  return [
    `# ${h.greeting} ${PERSON_NAME}`,
    '',
    `> ${h.availability}`,
    '',
    `**${h.role}** | ${h.roleTagline}`,
    '',
    h.about,
    '',
    `- [${h.ctaProjects}](${absoluteUrl(origin, markdownHref(lang, 'proyectos'))})`,
    `- [${h.ctaCv}](${data.profile.cv_url})`,
    '',
    `![${h.photoAlt}](${data.profile.photos[0]})`,
  ];
};

const renderProjects: PageRenderer = ({ t, data }) => {
  const L = t.markdown;
  const out = [`# ${data.projects.title}`, '', `*${data.projects.tag}*`, '', data.projects.subtitle];
  for (const item of data.projects.items) {
    out.push('', `## ${item.title}`, '');
    out.push(`- **${L.organization}:** ${item.organization}`);
    out.push(`- **${L.status}:** ${item.status_label}`);
    out.push(`- **${L.period}:** ${item.period}`, '');
    out.push(item.description_markdown, '');
    out.push(`**${L.milestones}:**`, '');
    for (const milestone of item.milestones) out.push(`- ${milestone}`);
    out.push('', `**${L.tags}:** ${item.tags.join(', ')}`, '');
    out.push(
      item.media.type === 'video'
        ? `[${L.video}: ${item.title}](${item.media.url})`
        : `![${item.title}](${item.media.url})`,
    );
  }
  return out;
};

const renderSkills: PageRenderer = ({ data }) => {
  const out = [`# ${data.skills.title}`, '', `*${data.skills.tag}*`, '', data.skills.subtitle];
  for (const category of data.skills.categories) {
    out.push('', `## ${category.title}`, '', category.description, '');
    for (const skill of category.skills) out.push(`- **${skill.name}:** ${skill.note}`);
  }
  return out;
};

const renderAchievements: PageRenderer = ({ t, data }) => {
  const L = t.markdown;
  const a = data.achievements;
  const out = [`# ${a.title}`, '', `*${a.tag}*`, '', a.summary];
  for (const item of a.items) {
    out.push('', `## ${item.title}`, '');
    out.push(`- **${L.date}:** ${item.date}`);
    out.push(`- **${L.scope}:** ${item.scope}`);
    out.push(`- **${L.issuer}:** ${item.organization}`);
    out.push(`- **${L.award}:** ${item.prize}`, '');
    out.push(item.description);
  }
  out.push('', '---', '', a.footer);
  return out;
};

const renderContact: PageRenderer = ({ t, data }) => {
  const L = t.markdown;
  const { info, form } = t.contact;
  return [
    `# ${t.contact.title}`,
    '',
    `*${t.contact.tag}*`,
    '',
    `## ${info.title}`,
    '',
    info.description,
    '',
    `- **${info.personalEmail}:** [${CONTACT.personalEmail}](mailto:${CONTACT.personalEmail})`,
    `- **${info.umaEmail}:** [${CONTACT.umaEmail}](mailto:${CONTACT.umaEmail})`,
    `- **${info.phone}:** [${CONTACT.phone.display}](${CONTACT.phone.href})`,
    `- **LinkedIn:** [${CONTACT.linkedin.label}](${CONTACT.linkedin.url})`,
    `- **GitHub:** [${CONTACT.github.label}](${CONTACT.github.url})`,
    '',
    `[${info.downloadCv}](${data.contact.cv_url})`,
    '',
    info.meetings,
    '',
    info.languages,
    '',
    `## ${form.title}`,
    '',
    `${L.formFields}:`,
    '',
    `- **${form.name}:** ${form.placeholderName}`,
    `- **${form.email}:** ${form.placeholderEmail}`,
    `- **${form.subject}:** ${form.placeholderSubject}`,
    `- **${form.message}:** ${form.placeholderMessage}`,
    '',
    `→ ${form.submit}`,
    '',
    toMarkdown(form.notice),
    '',
    `### ${L.agentsTitle}`,
    '',
    L.agentsContact,
  ];
};

const PAGE_RENDERERS: Record<PageId, PageRenderer> = {
  index: renderHome,
  proyectos: renderProjects,
  habilidades: renderSkills,
  logros: renderAchievements,
  contacto: renderContact,
};

/** Cuerpo Markdown de una página, sin metadatos ni navegación. */
export function renderPageBody(lang: Lang, page: PageId, origin: string): string[] {
  const ctx: RenderContext = { lang, origin, t: getDictionary(lang), data: getPortfolioData(lang, origin) };
  return PAGE_RENDERERS[page](ctx);
}

/** Navegación al final de cada página: las demás páginas, el CV y los otros idiomas. */
export function renderPageFooter(lang: Lang, page: PageId, origin: string): string[] {
  const t = getDictionary(lang);
  const L = t.markdown;
  const out = ['', '---', '', `## ${L.navigation}`, ''];
  for (const id of PAGE_IDS) out.push(`- [${t.nav.pages[id]}](${absoluteUrl(origin, markdownHref(lang, id))})`);
  out.push(`- [${t.nav.cv}](${absoluteUrl(origin, CONTACT.cvPath)})`, '');
  out.push(`${L.otherLanguages}:`);
  for (const other of LANGS.filter((l) => l !== lang)) {
    out.push(`- [${getDictionary(other).languageName}](${absoluteUrl(origin, markdownHref(other, page))})`);
  }
  out.push('', `${L.htmlVersion}: ${absoluteUrl(origin, pageHref(lang, page))}`);
  return out;
}

/** Markdown completo de una página, con metadatos YAML. */
export function renderPageMarkdown(lang: Lang, page: PageId, origin: string): string {
  const meta = getDictionary(lang).pages[page];
  const front = [
    '---',
    `title: ${JSON.stringify(meta.title)}`,
    `description: ${JSON.stringify(meta.description)}`,
    `lang: ${lang}`,
    `url: ${absoluteUrl(origin, pageHref(lang, page))}`,
    '---',
    '',
  ];
  return [...front, ...renderPageBody(lang, page, origin), ...renderPageFooter(lang, page, origin)].join('\n') + '\n';
}
