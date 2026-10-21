// Imágenes originales de src/assets/images/, para optimizarlas con astro:assets.
import type { ImageMetadata } from 'astro';

const IMAGES = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpg,jpeg,png}', { eager: true });

/** Metadatos de una imagen de src/assets/images/ por su nombre de fichero. */
export function imageAsset(file: string): ImageMetadata {
  const image = IMAGES[`../assets/images/${file}`];
  if (!image) throw new Error(`No existe la imagen src/assets/images/${file}`);
  return image.default;
}
