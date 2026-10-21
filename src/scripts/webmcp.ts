// WebMCP: herramientas que la web ofrece a los agentes de IA que actúan en el navegador
// (https://webmachinelearning.github.io/webmcp/). Solo se registran si el navegador expone
// la API; en los demás no hace nada. El formulario de contacto se expone además de forma
// declarativa (atributo toolname, ver components/contact/ContactForm.astro).

import { CONTACT } from '../data/profile';
import { isPageId, PAGE_IDS, pageHref, type PageId } from '../data/pages';
import { isLang, LANGS, type Lang } from '../i18n/langs';
import { COLOR_FILTERS, TEXT_SIZES, THEMES, type Preferences } from '../lib/preferences';
import { PORTFOLIO_RESOURCES } from '../agent/api-resources';
import { setPreferences } from './preferences';

interface ToolDefinition<Input> {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Input) => Promise<unknown>;
}

interface ModelContext {
  registerTool: (tool: ToolDefinition<never>, options?: { signal?: AbortSignal }) => unknown;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
  interface Navigator {
    modelContext?: ModelContext;
  }
}

const currentLang = (): Lang => (isLang(document.documentElement.lang) ? document.documentElement.lang : 'es');
const langOf = (value: unknown): Lang => (isLang(value) ? value : currentLang());
const pageOf = (value: unknown): PageId => (isPageId(value) ? value : 'index');

/** El navegador serializa lo que devuelve cada herramienta: texto o un objeto JSON. */
async function fetchResource(path: string, type: 'application/json' | 'text/markdown'): Promise<unknown> {
  const response = await fetch(path, { headers: { Accept: type } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return type === 'application/json' ? response.json() : response.text();
}

const langProperty = {
  type: 'string',
  enum: LANGS,
  description: 'Language: es (Spanish), en (English) or fr (French). Defaults to the language of the current page.',
};
const pageProperty = {
  type: 'string',
  enum: PAGE_IDS,
  description: 'index (home), proyectos (projects), habilidades (skills), logros (achievements) or contacto (contact).',
};

interface PageInput {
  page?: string;
  lang?: string;
}

interface AccessibilityInput {
  text_size?: Preferences['textSize'];
  high_contrast?: boolean;
  color_filter?: Preferences['colorFilter'];
  theme?: Preferences['theme'];
}

const TOOLS = [
  {
    name: 'get_page_content',
    description: "Read a page of Daniel Carrasco García's portfolio as Markdown (same content as the web page).",
    inputSchema: { type: 'object', properties: { page: pageProperty, lang: langProperty }, required: ['page'] },
    annotations: { readOnlyHint: true },
    execute: async ({ page, lang }: PageInput) => fetchResource(`/${langOf(lang)}/${pageOf(page)}.md`, 'text/markdown'),
  },
  {
    name: 'get_portfolio_data',
    description:
      'Get structured JSON about Daniel: profile, projects, skills, achievements, contact details, or everything (portfolio).',
    inputSchema: {
      type: 'object',
      properties: {
        resource: { type: 'string', enum: PORTFOLIO_RESOURCES, description: 'Which part of the portfolio.' },
        lang: langProperty,
      },
      required: ['resource'],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ resource, lang }: { resource?: string; lang?: string }) => {
      const name = PORTFOLIO_RESOURCES.find((r) => r === resource) ?? 'portfolio';
      return fetchResource(`/api/v1/${langOf(lang)}/${name}.json`, 'application/json');
    },
  },
  {
    name: 'navigate_to_page',
    description: 'Open a page of the portfolio in this tab, optionally in another language.',
    inputSchema: { type: 'object', properties: { page: pageProperty, lang: langProperty }, required: ['page'] },
    execute: async ({ page, lang }: PageInput) => {
      const target = pageHref(langOf(lang), pageOf(page));
      setTimeout(() => window.location.assign(target), 0);
      return `Navigating to ${new URL(target, window.location.origin).href}`;
    },
  },
  {
    name: 'get_cv_link',
    description: "Get the URL of Daniel's full CV (PDF).",
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => new URL(CONTACT.cvPath, window.location.origin).href,
  },
  {
    name: 'set_accessibility_options',
    description:
      "Change this site's display options for the person browsing: text size, high-contrast mode, color-blindness correction filter and light or dark theme. Omitted options stay as they are.",
    inputSchema: {
      type: 'object',
      properties: {
        text_size: { type: 'string', enum: TEXT_SIZES },
        high_contrast: { type: 'boolean' },
        color_filter: { type: 'string', enum: COLOR_FILTERS },
        theme: { type: 'string', enum: THEMES, description: 'system follows the operating system setting.' },
      },
    },
    execute: async ({ text_size, high_contrast, color_filter, theme }: AccessibilityInput) => {
      const changes: Partial<Preferences> = {};
      if (text_size && TEXT_SIZES.includes(text_size)) changes.textSize = text_size;
      if (typeof high_contrast === 'boolean') changes.highContrast = high_contrast;
      if (color_filter && COLOR_FILTERS.includes(color_filter)) changes.colorFilter = color_filter;
      if (theme && THEMES.includes(theme)) changes.theme = theme;
      setPreferences(changes);
      return 'Accessibility options updated.';
    },
  },
] satisfies ToolDefinition<never>[];

function register(): void {
  const modelContext = document.modelContext ?? navigator.modelContext;
  if (!modelContext?.registerTool) return;
  const controller = new AbortController();
  window.addEventListener('pagehide', () => controller.abort(), { once: true });
  for (const tool of TOOLS) {
    try {
      Promise.resolve(modelContext.registerTool(tool as ToolDefinition<never>, { signal: controller.signal })).catch(
        (error: unknown) => console.warn(`WebMCP: no se pudo registrar ${tool.name}`, error),
      );
    } catch (error) {
      console.warn(`WebMCP: no se pudo registrar ${tool.name}`, error);
    }
  }
}

register();
