// Punto de entrada único del código del navegador. Va en un solo fichero, sin trozos
// compartidos: así cada página lo carga con su hash e `integrity` bajo la política
// 'strict-dynamic' (las importaciones de un script con hash no heredan la confianza).
// Cada módulo solo actúa si su parte de la página existe.
import './preferences-menu';
import './theme-color';
import './contact-form';
import './lazy-video';
import './webmcp';
