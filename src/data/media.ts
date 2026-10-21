// Imágenes y vídeos de la web.
// Las imágenes originales están en src/assets/images/: las páginas usan versiones
// optimizadas (AVIF/WebP en varios tamaños) y el original se publica sin cambios en
// /images/<fichero>, la URL estable que reciben los agentes (API JSON, Markdown, MCP).
// Los vídeos no se procesan: viven en public/images/videos/.

export interface ImageMedia {
  type: 'image';
  /** Fichero dentro de src/assets/images/. */
  file: string;
}

export interface VideoMedia {
  type: 'video';
  /** Ruta pública del vídeo. */
  src: `/images/videos/${string}`;
  /** Fotograma que se muestra antes de reproducirlo (fichero dentro de src/assets/images/). */
  poster: string;
}

export type Media = ImageMedia | VideoMedia;

/** URL pública estable de una imagen original. */
export const imagePath = (file: string): string => `/images/${file}`;

/** URL pública estable de una imagen o un vídeo. */
export const mediaPath = (media: Media): string => (media.type === 'image' ? imagePath(media.file) : media.src);

/** Fotos de la portada: la principal y la que aparece al pasar el ratón por encima. */
export const PROFILE_PHOTOS = [
  { type: 'image', file: 'profile2.jpeg' },
  { type: 'image', file: 'profile.jpg' },
] as const satisfies readonly ImageMedia[];
