import type { AchievementId, ScopeId } from '../data/achievements';
import type { PageId } from '../data/pages';
import type { ProjectId } from '../data/projects';
import type { SkillCategoryId } from '../data/skills';
import type { ColorFilter, TextSize, Theme } from '../lib/preferences';

// Estructura de los textos de cada idioma. Las listas (proyectos, logros, habilidades)
// van indexadas por el id de src/data/, así que el compilador avisa si a un idioma le
// falta un elemento.
//
// Los textos pueden llevar HTML en línea sencillo (<strong>, <em> y <a href>) solo
// donde el comentario lo indica: se convierte a texto plano o a Markdown para los agentes.

export interface ProjectText {
  title: string;
  organization: string;
  /** HTML en línea. */
  description: string;
  milestones: string[];
  tags: string[];
}

export interface AchievementText {
  organization: string;
  prize: string;
  title: string;
  description: string;
}

export interface SkillText {
  name: string;
  note: string;
}

export interface SkillCategoryText {
  title: string;
  description: string;
  skills: SkillText[];
}

export interface Dictionary {
  /** Nombre del idioma escrito en ese idioma (selector de idioma, enlaces alternativos). */
  languageName: string;

  /** Título y descripción (meta) de cada página. */
  pages: Record<PageId, { title: string; description: string }>;

  common: {
    skipToContent: string;
    /** Aviso para lectores de pantalla en los enlaces que abren otra pestaña. */
    opensInNewTab: string;
  };

  nav: {
    /** Nombre de cada página en la navegación. */
    pages: Record<PageId, string>;
    mainLabel: string;
    /** Nombre del menú de navegación en móvil (distinto del principal). */
    mobileLabel: string;
    openMenu: string;
    closeMenu: string;
    cv: string;
    downloadCv: string;
    languageLabel: string;
  };

  home: {
    availability: string;
    greeting: string;
    role: string;
    roleTagline: string;
    about: string;
    photoAlt: string;
    ctaProjects: string;
    ctaCv: string;
    /**
     * Textos de versiones anteriores de la portada que hoy no se muestran. Se conservan
     * para poder recuperarlos; no se publican en ninguna parte.
     */
    unpublished: {
      subtitle: string;
      subtitleHighlight: string;
      /** HTML en línea. */
      description: string;
      location: { title: string; city: string; country: string };
      /** `description` es HTML en línea. */
      volunteering: { title: string; description: string; badge: string };
      focus: { title: string; items: string[] };
      ctaBox: { title: string; description: string; button: string; ariaLabel: string };
    };
  };

  projects: {
    tag: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    statusActive: string;
    statusCompleted: string;
    /** Fin de un periodo que sigue en curso («Actualidad»). */
    present: string;
    /** Periodo de un proyecto sin fechas («Enfoque a largo plazo»). */
    longTerm: string;
    milestones: string;
    tags: string;
    items: Record<ProjectId, ProjectText>;
  };

  skills: {
    tag: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    categories: Record<SkillCategoryId, SkillCategoryText>;
  };

  achievements: {
    /** Se completa con el periodo de los reconocimientos: «Reconocimientos · 2019–2026». */
    tag: string;
    title: string;
    /** Va detrás del número de reconocimientos. */
    subtitle: string;
    /** Va detrás del número de reconocimientos y antes del periodo. */
    footer: string;
    scopes: Record<ScopeId, string>;
    items: Record<AchievementId, AchievementText>;
  };

  contact: {
    tag: string;
    title: string;
    info: {
      title: string;
      description: string;
      channels: string;
      personalEmail: string;
      umaEmail: string;
      phone: string;
      downloadCv: string;
      meetings: string;
      languages: string;
    };
    form: {
      title: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      required: string;
      placeholderName: string;
      placeholderEmail: string;
      placeholderSubject: string;
      placeholderMessage: string;
      submit: string;
      sending: string;
      /** Turnstile espera a que la persona marque su casilla. */
      verify: string;
      /** HTML en línea. */
      notice: string;
      success: string;
      errors: {
        required: string;
        invalidEmail: string;
        tooLong: string;
        rateLimit: string;
        hourlyLimit: string;
        dailyLimit: string;
        verification: string;
        /** No se pudo cargar Turnstile (p. ej. lo bloquea una extensión). */
        blocked: string;
        sending: string;
      };
    };
  };

  preferences: {
    open: string;
    title: string;
    close: string;
    theme: string;
    themes: Record<Theme, string>;
    textSize: string;
    textSizes: Record<TextSize, string>;
    contrast: string;
    colorFilter: string;
    colorFilters: Record<ColorFilter, string>;
    reset: string;
  };

  footer: {
    contact: string;
    sections: string;
    agents: string;
    agentsDescription: string;
    source: string;
  };

  notFound: {
    title: string;
    description: string;
    backHome: string;
  };

  /** Etiquetas de las versiones Markdown, donde el diseño no puede transmitir la estructura. */
  markdown: {
    organization: string;
    status: string;
    period: string;
    milestones: string;
    tags: string;
    video: string;
    date: string;
    scope: string;
    issuer: string;
    award: string;
    navigation: string;
    otherLanguages: string;
    htmlVersion: string;
    formFields: string;
    agentsTitle: string;
    agentsContact: string;
    agentResources: string;
  };

  /** Página de autorización OAuth del Worker. `{client}`, `{domain}` y `{host}` se sustituyen. */
  consent: {
    title: string;
    heading: string;
    verified: string;
    unverified: string;
    redirect: string;
    loopback: string;
    permissions: string;
    scopes: { read: string; contact: string; offlineAccess: string };
    anonymous: string;
    allow: string;
    deny: string;
    captchaFailed: string;
    notConfigured: string;
    expired: string;
    invalidClient: string;
  };
}
