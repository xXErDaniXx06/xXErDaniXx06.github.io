// Rutas estáticas de las páginas que existen en cada idioma (src/pages/[lang]/).
import { LANGS } from '../i18n';

export const langPaths = () => LANGS.map((lang) => ({ params: { lang }, props: { lang } }));
