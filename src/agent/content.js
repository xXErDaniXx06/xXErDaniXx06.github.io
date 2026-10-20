// Versiones del porfolio para agentes de IA: Markdown de cada página, llms.txt,
// llms-full.txt y datos estructurados (API JSON y servidor MCP).
// Todo sale de src/utils/i18n.js y src/data/profile.js, igual que las páginas
// HTML, así que cualquier cambio de contenido se refleja en ambos sitios.

import { getTranslations } from '../utils/i18n.js';
import {
  CONTACT,
  PERSON_NAME,
  LANGS,
  PAGES,
  PROJECT_MEDIA,
  PROFILE_PHOTOS,
  pageHref,
  markdownHref,
} from '../data/profile.js';

export { LANGS, PAGES };

const LANG_NAMES = { es: 'Español', en: 'English', fr: 'Français' };

// Etiquetas estructurales que en el HTML se transmiten con el diseño
// (iconos, colores, columnas) y en Markdown necesitan palabras.
const LABELS = {
  es: {
    organization: 'Organización',
    status: 'Estado',
    period: 'Periodo',
    milestones: 'Hitos',
    tags: 'Etiquetas',
    image: 'Imagen',
    video: 'Vídeo',
    date: 'Fecha',
    scope: 'Ámbito',
    issuer: 'Organismo',
    award: 'Premio',
    photo: 'Foto',
    navigation: 'Navegación',
    otherLanguages: 'Otros idiomas',
    htmlVersion: 'Versión HTML de esta página',
    formFields: 'Campos del formulario (todos obligatorios)',
    agentsTitle: 'Para agentes de IA',
    agentsContact:
      'Un agente puede enviar este formulario con la herramienta WebMCP `send_contact_message` de esta página, o usar la herramienta del mismo nombre del servidor MCP del porfolio (requiere autorización OAuth; ver /auth.md). Confirma siempre el contenido con la persona antes de enviar.',
    agentResources: 'Recursos para agentes',
  },
  en: {
    organization: 'Organization',
    status: 'Status',
    period: 'Period',
    milestones: 'Milestones',
    tags: 'Tags',
    image: 'Image',
    video: 'Video',
    date: 'Date',
    scope: 'Scope',
    issuer: 'Awarded by',
    award: 'Award',
    photo: 'Photo',
    navigation: 'Navigation',
    otherLanguages: 'Other languages',
    htmlVersion: 'HTML version of this page',
    formFields: 'Form fields (all required)',
    agentsTitle: 'For AI agents',
    agentsContact:
      "An agent can submit this form with this page's WebMCP tool `send_contact_message`, or use the tool of the same name on the portfolio's MCP server (requires OAuth authorization; see /auth.md). Always confirm the content with the person before sending.",
    agentResources: 'Agent resources',
  },
  fr: {
    organization: 'Organisation',
    status: 'Statut',
    period: 'Période',
    milestones: 'Étapes clés',
    tags: 'Étiquettes',
    image: 'Image',
    video: 'Vidéo',
    date: 'Date',
    scope: 'Portée',
    issuer: 'Décerné par',
    award: 'Prix',
    photo: 'Photo',
    navigation: 'Navigation',
    otherLanguages: 'Autres langues',
    htmlVersion: 'Version HTML de cette page',
    formFields: 'Champs du formulaire (tous obligatoires)',
    agentsTitle: 'Pour les agents IA',
    agentsContact:
      "Un agent peut envoyer ce formulaire avec l'outil WebMCP `send_contact_message` de cette page, ou utiliser l'outil du même nom du serveur MCP du portfolio (autorisation OAuth requise ; voir /auth.md). Confirmez toujours le contenu avec la personne avant l'envoi.",
    agentResources: 'Ressources pour agents',
  },
};

// ── Utilidades de texto ──────────────────────────────────────────────────

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const decodeEntities = (s) => s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m]);

/** Quita las etiquetas HTML de los textos de i18n (que llevan <strong>, <em> o <a>). */
export const toPlainText = (html) => decodeEntities(String(html).replace(/<[^>]+>/g, ''));

/** Convierte el HTML en línea de i18n a Markdown. */
export const toMarkdown = (html) =>
  decodeEntities(
    String(html)
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '**$1**')
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/g, '*$1*')
      .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
      .replace(/<[^>]+>/g, '')
  );

/** Estimación de tokens para la cabecera x-markdown-tokens (≈4 caracteres por token). */
export const estimateTokens = (text) => Math.ceil(text.length / 4);

const abs = (origin, path) => new URL(path, origin).href;

// ── Datos estructurados (API JSON y MCP) ─────────────────────────────────

/** Información del porfolio en un idioma, como datos estructurados. */
export function getPortfolioData(lang, origin) {
  const t = getTranslations(lang);
  const cvUrl = abs(origin, CONTACT.cvPath);

  return {
    lang,
    name: PERSON_NAME,
    url: abs(origin, pageHref(lang, '')),
    profile: {
      name: PERSON_NAME,
      greeting: t.index.hero.greeting,
      availability: t.index.hero.badge,
      role: t.index.hero.role,
      role_tagline: t.index.hero.role_tagline,
      about: t.index.hero.about,
      photos: PROFILE_PHOTOS.map((p) => abs(origin, p)),
      cv_url: cvUrl,
      url: abs(origin, pageHref(lang, '')),
    },
    projects: {
      tag: t.projects.tag,
      title: t.projects.title + t.projects.title_highlight,
      subtitle: t.projects.subtitle,
      url: abs(origin, pageHref(lang, 'proyectos')),
      items: t.projects.list.map((p) => {
        const media = PROJECT_MEDIA[p.id];
        return {
          id: p.id,
          title: p.title,
          organization: p.org,
          period: p.time,
          status: p.active ? 'active' : 'completed',
          status_label: p.active ? t.projects.status_active : t.projects.status_completed,
          description: toPlainText(p.description),
          description_markdown: toMarkdown(p.description),
          milestones: [...p.milestones],
          tags: [...p.tags],
          media: media ? { type: media.type, url: abs(origin, media.src) } : null,
          url: abs(origin, `${pageHref(lang, 'proyectos')}#project-${p.id}`),
        };
      }),
    },
    skills: {
      tag: t.skills.tag,
      title: t.skills.title + t.skills.title_highlight,
      subtitle: t.skills.subtitle,
      url: abs(origin, pageHref(lang, 'habilidades')),
      categories: t.skills.categories.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        skills: c.skills.map((s) => ({ name: s.name, note: s.note })),
        url: abs(origin, `${pageHref(lang, 'habilidades')}#skills-block-${c.id}`),
      })),
    },
    achievements: {
      tag: t.achievements.tag,
      title: t.achievements.title,
      summary: `${t.achievements.list.length} ${t.achievements.subtitle}`,
      footer: `${t.achievements.list.length} ${t.achievements.footer_text}`,
      total: t.achievements.list.length,
      scopes: Object.keys(t.achievements.scopes),
      url: abs(origin, pageHref(lang, 'logros')),
      items: t.achievements.list.map((a) => ({
        year: a.year,
        date: a.date,
        datetime: a.datetime,
        scope: a.scope,
        organization: a.org,
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
      url: abs(origin, pageHref(lang, 'contacto')),
      form: {
        title: t.contact.form.title,
        fields: {
          name: t.contact.form.name,
          email: t.contact.form.email,
          subject: t.contact.form.subject,
          message: t.contact.form.message,
        },
        submit: t.contact.form.submit,
        notice: toPlainText(t.contact.form.recaptcha_notice),
      },
    },
  };
}

// ── Markdown por página ──────────────────────────────────────────────────

const pageTitle = (t, pageId) =>
  ({
    index: t.index.meta_title,
    proyectos: t.projects.meta_title,
    habilidades: t.skills.meta_title,
    logros: t.achievements.meta_title,
    contacto: t.contact.meta_title,
  })[pageId];

const pageLabel = (t, pageId) =>
  ({
    index: t.nav.inicio,
    proyectos: t.nav.proyectos,
    habilidades: t.nav.habilidades,
    logros: t.nav.logros,
    contacto: t.nav.contacto,
  })[pageId];

/** Descripción breve de cada página (para llms.txt y los índices). */
export const pageDescription = (lang, pageId) => {
  const t = getTranslations(lang);
  return {
    index: t.index.meta_description,
    proyectos: t.projects.meta_description,
    habilidades: t.skills.meta_description,
    logros: t.achievements.meta_description,
    contacto: t.contact.info.description,
  }[pageId];
};

function renderBody(lang, pageId, origin) {
  const t = getTranslations(lang);
  const L = LABELS[lang];
  const d = getPortfolioData(lang, origin);
  const out = [];

  if (pageId === 'index') {
    const h = t.index.hero;
    out.push(`# ${h.greeting} ${PERSON_NAME}`, '');
    out.push(`> ${h.badge}`, '');
    out.push(`**${h.role}** | ${h.role_tagline}`, '');
    out.push(h.about, '');
    out.push(`- [${h.cta_projects}](${abs(origin, markdownHref(lang, 'proyectos'))})`);
    out.push(`- [${h.cta_cv}](${d.profile.cv_url})`, '');
    out.push(`![${h.photo_alt}](${d.profile.photos[0]})`);
  }

  if (pageId === 'proyectos') {
    const p = t.projects;
    out.push(`# ${p.title}${p.title_highlight}`, '');
    out.push(`*${p.tag}*`, '');
    out.push(p.subtitle);
    for (const item of d.projects.items) {
      out.push('', `## ${item.title}`, '');
      out.push(`- **${L.organization}:** ${item.organization}`);
      out.push(`- **${L.status}:** ${item.status_label}`);
      out.push(`- **${L.period}:** ${item.period}`, '');
      out.push(item.description_markdown, '');
      out.push(`**${L.milestones}:**`, '');
      for (const m of item.milestones) out.push(`- ${m}`);
      out.push('', `**${L.tags}:** ${item.tags.join(', ')}`);
      if (item.media) {
        out.push('');
        out.push(
          item.media.type === 'video'
            ? `[${L.video}: ${item.title}](${item.media.url})`
            : `![${item.title}](${item.media.url})`
        );
      }
    }
  }

  if (pageId === 'habilidades') {
    const s = t.skills;
    out.push(`# ${s.title}${s.title_highlight}`, '');
    out.push(`*${s.tag}*`, '');
    out.push(s.subtitle);
    for (const cat of d.skills.categories) {
      out.push('', `## ${cat.title}`, '', cat.description, '');
      for (const skill of cat.skills) out.push(`- **${skill.name}:** ${skill.note}`);
    }
  }

  if (pageId === 'logros') {
    const a = t.achievements;
    out.push(`# ${a.title}`, '');
    out.push(`*${a.tag}*`, '');
    out.push(d.achievements.summary);
    for (const item of d.achievements.items) {
      out.push('', `## ${item.title}`, '');
      out.push(`- **${L.date}:** ${item.date}`);
      out.push(`- **${L.scope}:** ${item.scope}`);
      out.push(`- **${L.issuer}:** ${item.organization}`);
      out.push(`- **${L.award}:** ${item.prize}`, '');
      out.push(item.description);
    }
    out.push('', '---', '', d.achievements.footer);
  }

  if (pageId === 'contacto') {
    const c = t.contact;
    const i = c.info;
    const f = c.form;
    out.push(`# ${c.title}`, '');
    out.push(`*${c.tag}*`, '');
    out.push(`## ${i.title}`, '', i.description, '');
    out.push(`- **${i.personal_email}:** [${CONTACT.personalEmail}](mailto:${CONTACT.personalEmail})`);
    out.push(`- **${i.uma_email}:** [${CONTACT.umaEmail}](mailto:${CONTACT.umaEmail})`);
    out.push(`- **${i.phone}:** [${CONTACT.phone.display}](${CONTACT.phone.href})`);
    out.push(`- **LinkedIn:** [${CONTACT.linkedin.label}](${CONTACT.linkedin.url})`);
    out.push(`- **GitHub:** [${CONTACT.github.label}](${CONTACT.github.url})`, '');
    out.push(`[${i.download_cv}](${d.contact.cv_url})`, '');
    out.push(i.meetings, '', i.languages, '');
    out.push(`## ${f.title}`, '');
    out.push(`${L.formFields}:`, '');
    out.push(`- **${f.name}:** ${f.placeholder_name}`);
    out.push(`- **${f.email}:** ${f.placeholder_email}`);
    out.push(`- **${f.subject}:** ${f.placeholder_subject}`);
    out.push(`- **${f.message}:** ${f.placeholder_message}`, '');
    out.push(`→ ${f.submit}`, '');
    out.push(toMarkdown(f.recaptcha_notice), '');
    out.push(`### ${L.agentsTitle}`, '', L.agentsContact);
  }

  return out;
}

function renderFooter(lang, pageId, origin) {
  const t = getTranslations(lang);
  const L = LABELS[lang];
  const page = PAGES.find((p) => p.id === pageId);
  const out = ['', '---', '', `## ${L.navigation}`, ''];
  for (const p of PAGES) {
    out.push(`- [${pageLabel(t, p.id)}](${abs(origin, markdownHref(lang, p.slug))})`);
  }
  out.push(`- [${t.nav.cv}](${abs(origin, CONTACT.cvPath)})`, '');
  out.push(`${L.otherLanguages}:`);
  for (const other of LANGS.filter((l) => l !== lang)) {
    out.push(`- [${LANG_NAMES[other]}](${abs(origin, markdownHref(other, page.slug))})`);
  }
  out.push('', `${L.htmlVersion}: ${abs(origin, pageHref(lang, page.slug))}`);
  return out;
}

/** Markdown completo de una página, con metadatos en YAML. */
export function renderPageMarkdown(lang, pageId, origin) {
  const t = getTranslations(lang);
  const page = PAGES.find((p) => p.id === pageId);
  if (!page || !LANGS.includes(lang)) throw new Error(`Página desconocida: ${lang}/${pageId}`);
  const front = [
    '---',
    `title: ${JSON.stringify(pageTitle(t, pageId))}`,
    `description: ${JSON.stringify(pageDescription(lang, pageId))}`,
    `lang: ${lang}`,
    `url: ${abs(origin, pageHref(lang, page.slug))}`,
    '---',
    '',
  ];
  return [...front, ...renderBody(lang, pageId, origin), ...renderFooter(lang, pageId, origin)].join('\n') + '\n';
}

// ── Índices para agentes ─────────────────────────────────────────────────

export const AGENT_RESOURCES = [
  { path: '/.well-known/mcp/server-card.json', name: 'MCP server', note: 'Remote MCP server (Streamable HTTP, OAuth 2.1) with read tools for this portfolio and a tool to send Daniel a message.' },
  { path: '/api/v1/openapi.json', name: 'Portfolio JSON API', note: 'OpenAPI 3.1 description of the read-only JSON API (profile, projects, skills, achievements, contact) in es, en and fr.' },
  { path: '/.well-known/agent-skills/index.json', name: 'Agent skills', note: 'Agent Skills discovery index with instructions for using this portfolio.' },
  { path: '/.well-known/ai-catalog.json', name: 'AI catalog', note: 'ARD catalog of every agent-facing resource on this site.' },
  { path: '/.well-known/api-catalog', name: 'API catalog', note: 'RFC 9727 API catalog (application/linkset+json).' },
  { path: '/auth.md', name: 'auth.md', note: 'How agents obtain OAuth access to the MCP server.' },
  { path: '/sitemap.xml', name: 'Sitemap', note: 'Every HTML page with its language alternates.' },
];

const SUMMARY =
  'Personal portfolio of Daniel Carrasco García, a Computer Engineering student at the University of Málaga (UMA) working across software, hardware (PCB design, embedded systems, RF and LoRa links) and aerospace technology (CubeSat, CanSat, stratospheric balloons). The site is available in Spanish (default), English and French.';

/** /llms.txt según llmstxt.org */
export function renderLlmsTxt(origin) {
  const out = [`# ${PERSON_NAME}`, '', `> ${SUMMARY}`, ''];
  out.push(
    'Every HTML page has a Markdown version: request it with `Accept: text/markdown` or use the `.md` URLs below. The same content is available as JSON and through an MCP server.',
    ''
  );
  for (const lang of LANGS) {
    const t = getTranslations(lang);
    out.push(`## ${LANG_NAMES[lang]}`, '');
    for (const p of PAGES) {
      out.push(`- [${pageLabel(t, p.id)}](${abs(origin, markdownHref(lang, p.slug))}): ${pageDescription(lang, p.id)}`);
    }
    out.push('');
  }
  out.push(`## ${LABELS.en.agentResources}`, '');
  for (const r of AGENT_RESOURCES) out.push(`- [${r.name}](${abs(origin, r.path)}): ${r.note}`);
  out.push('', '## Optional', '');
  out.push(`- [Full content](${abs(origin, '/llms-full.txt')}): every page in all three languages in one file.`);
  out.push(`- [CV (PDF)](${abs(origin, CONTACT.cvPath)}): Daniel's full résumé.`);
  return out.join('\n') + '\n';
}

/** /llms-full.txt: todas las páginas en los tres idiomas. */
export function renderLlmsFullTxt(origin) {
  const parts = [`# ${PERSON_NAME} — full portfolio content`, '', `> ${SUMMARY}`, ''];
  for (const lang of LANGS) {
    for (const p of PAGES) {
      parts.push('', `<!-- ${abs(origin, pageHref(lang, p.slug))} -->`, '');
      parts.push(...renderBody(lang, p.id, origin));
      parts.push('');
    }
  }
  return parts.join('\n') + '\n';
}

/**
 * Markdown de la raíz (/). La raíz muestra la portada en español, así que su
 * versión Markdown es la de /es/ más un índice de recursos para agentes.
 */
export function renderRootMarkdown(origin) {
  const t = getTranslations('es');
  const front = [
    '---',
    `title: ${JSON.stringify(t.index.meta_title)}`,
    `description: ${JSON.stringify(SUMMARY)}`,
    'lang: es',
    `url: ${abs(origin, '/')}`,
    `canonical: ${abs(origin, pageHref('es', ''))}`,
    '---',
    '',
  ];
  const resources = ['', `## ${LABELS.es.agentResources} · ${LABELS.en.agentResources}`, ''];
  for (const r of AGENT_RESOURCES) resources.push(`- [${r.name}](${abs(origin, r.path)}): ${r.note}`);
  resources.push(`- [llms.txt](${abs(origin, '/llms.txt')}): index of every page in es, en and fr.`);
  return [...front, ...renderBody('es', 'index', origin), ...resources, ...renderFooter('es', 'index', origin)].join('\n') + '\n';
}
