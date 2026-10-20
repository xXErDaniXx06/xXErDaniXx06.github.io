// WebMCP: herramientas que la web ofrece a los agentes de IA que actúan en el
// navegador (https://webmachinelearning.github.io/webmcp/). Solo se registran si
// el navegador expone la API; en los demás no hace nada.
// El formulario de contacto se expone además de forma declarativa (toolname).

const LANGS = ['es', 'en', 'fr'];
const PAGES = ['index', 'proyectos', 'habilidades', 'logros', 'contacto'];
const RESOURCES = ['portfolio', 'profile', 'projects', 'skills', 'achievements', 'contact'];

const currentLang = () => (LANGS.includes(document.documentElement.lang) ? document.documentElement.lang : 'es');
const pageUrl = (lang, page) => (page === 'index' ? `/${lang}/` : `/${lang}/${page}`);

// El navegador serializa lo que devuelve cada herramienta: texto o un objeto JSON.
async function fetchResource(path, type) {
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
  enum: PAGES,
  description: 'index (home), proyectos (projects), habilidades (skills), logros (achievements) or contacto (contact).',
};

const TOOLS = [
  {
    name: 'get_page_content',
    description: "Read a page of Daniel Carrasco García's portfolio as Markdown (same content as the web page).",
    inputSchema: { type: 'object', properties: { page: pageProperty, lang: langProperty }, required: ['page'] },
    annotations: { readOnlyHint: true },
    execute: async ({ page, lang = currentLang() }) => fetchResource(`/${lang}/${page}.md`, 'text/markdown'),
  },
  {
    name: 'get_portfolio_data',
    description: 'Get structured JSON about Daniel: profile, projects, skills, achievements, contact details, or everything (portfolio).',
    inputSchema: {
      type: 'object',
      properties: { resource: { type: 'string', enum: RESOURCES, description: 'Which part of the portfolio.' }, lang: langProperty },
      required: ['resource'],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ resource, lang = currentLang() }) => fetchResource(`/api/v1/${lang}/${resource}.json`, 'application/json'),
  },
  {
    name: 'navigate_to_page',
    description: 'Open a page of the portfolio in this tab, optionally in another language.',
    inputSchema: { type: 'object', properties: { page: pageProperty, lang: langProperty }, required: ['page'] },
    execute: async ({ page, lang = currentLang() }) => {
      const target = pageUrl(lang, page);
      setTimeout(() => window.location.assign(target), 0);
      return `Navigating to ${new URL(target, window.location.origin).href}`;
    },
  },
  {
    name: 'get_cv_link',
    description: "Get the URL of Daniel's full CV (PDF).",
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => new URL('/docs/CV_Daniel.pdf', window.location.origin).href,
  },
  {
    name: 'set_accessibility_options',
    description:
      "Change this site's accessibility options for the person browsing: text size, high-contrast mode and color-blindness filter. Omitted options stay as they are.",
    inputSchema: {
      type: 'object',
      properties: {
        text_size: { type: 'string', enum: ['small', 'normal', 'large'] },
        high_contrast: { type: 'boolean' },
        color_filter: { type: 'string', enum: ['none', 'protanopia', 'deuteranopia', 'tritanopia'] },
      },
    },
    execute: async ({ text_size, high_contrast, color_filter }) => {
      // Usa los mismos botones del menú de accesibilidad, para que todo quede guardado igual.
      if (text_size) document.getElementById(`a11y-font-${text_size}`)?.click();
      const contrast = document.getElementById('a11y-contrast');
      if (typeof high_contrast === 'boolean' && contrast && (contrast.getAttribute('aria-checked') === 'true') !== high_contrast) {
        contrast.click();
      }
      if (color_filter) document.querySelector(`.colorblind-btn[data-filter="${color_filter}"]`)?.click();
      return 'Accessibility options updated.';
    },
  },
];

function register() {
  const modelContext = document.modelContext ?? navigator.modelContext;
  if (!modelContext?.registerTool) return;
  const controller = new AbortController();
  window.addEventListener('pagehide', () => controller.abort(), { once: true });
  for (const tool of TOOLS) {
    try {
      Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch((error) =>
        console.warn(`WebMCP: no se pudo registrar ${tool.name}`, error)
      );
    } catch (error) {
      console.warn(`WebMCP: no se pudo registrar ${tool.name}`, error);
    }
  }
}

register();
