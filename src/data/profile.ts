// Datos de perfil y de contacto que no dependen del idioma. Los usan las páginas,
// las versiones para agentes (Markdown, API JSON, llms.txt) y el Worker (MCP).

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
} as const;

/** Repositorio con el código de la web. */
export const SOURCE_REPOSITORY = 'https://github.com/xXErDaniXx06/xXErDaniXx06.github.io';

/** Organización a la que pertenece (datos estructurados de la portada). */
export const AFFILIATION = 'Universidad de Málaga';
