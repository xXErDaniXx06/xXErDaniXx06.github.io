// Datos de contacto y de perfil compartidos por las páginas HTML, las versiones
// para agentes (Markdown, API JSON, llms.txt) y el servidor MCP del Worker.

export const PERSON_NAME = 'Daniel Carrasco García';

export const CONTACT = {
  personalEmail: 'danielcarrascogarcia18@gmail.com',
  umaEmail: 'carrascodani06@uma.es',
  phone: {
    href: 'tel:+34633120603',
    display: '(+34) 633 120 603',
    e164: '+34633120603',
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/daniel-carrasco-garc%C3%ADa-568952286',
    label: 'Daniel Carrasco García',
  },
  github: {
    url: 'https://github.com/xXErDaniXx06',
    label: 'github.com/xXErDaniXx06',
  },
  cvPath: '/docs/CV_Daniel.pdf',
};

// Imagen o vídeo que acompaña a cada proyecto en /{lang}/proyectos
export const PROJECT_MEDIA = {
  ksat: { type: 'image', src: '/images/MST_Imagen.jpg' },
  emprendimiento: { type: 'image', src: '/images/CursoEmprendimiento_Imagen.jpg' },
  kursaatelite: { type: 'video', src: '/images/videos/kursaatelite-demo.mp4' },
  kursaalmars: { type: 'image', src: '/images/kursaalmars-team.jpg' },
  porunasonrisa: { type: 'image', src: '/images/porunasonrisa.jpg' },
  sensordeco2: { type: 'image', src: '/images/sensordeco2.png' },
  smartdoor: { type: 'image', src: '/images/smartdoor.jpg' },
  dustnet: { type: 'image', src: '/images/Dustnet_Image.png' },
  oracle: { type: 'image', src: '/images/Oracle_Image.jpg' },
  futuro: { type: 'image', src: '/images/FuturosProyectos_Image.jpg' },
};

// Fotos de la portada: la normal y la que aparece al pasar el ratón
export const PROFILE_PHOTOS = ['/images/profile2.jpeg', '/images/profile.jpg'];

export const LANGS = ['es', 'en', 'fr'];
export const DEFAULT_LANG = 'es';

// Identificador de cada página y su ruta (sin idioma) en la web.
export const PAGES = [
  { id: 'index', slug: '' },
  { id: 'proyectos', slug: 'proyectos' },
  { id: 'habilidades', slug: 'habilidades' },
  { id: 'logros', slug: 'logros' },
  { id: 'contacto', slug: 'contacto' },
];

// Ruta HTML de una página: /es/ o /es/proyectos
export const pageHref = (lang, slug) => (slug ? `/${lang}/${slug}` : `/${lang}/`);

// Ruta de la versión Markdown: /es/index.md o /es/proyectos.md
export const markdownHref = (lang, slug) => `/${lang}/${slug || 'index'}.md`;
