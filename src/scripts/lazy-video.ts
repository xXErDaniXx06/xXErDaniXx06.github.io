// Vídeos con data-autoplay: se reproducen (sin sonido) solo mientras están a la vista,
// y nunca si la persona ha pedido reducir el movimiento o los ha pausado ella misma.
// Hasta que se reproducen no se descargan (preload="none").

const videos = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pausedByUser = new WeakSet<HTMLVideoElement>();
const pausedByScript = new WeakSet<HTMLVideoElement>();

function onVisibilityChange(video: HTMLVideoElement, visible: boolean): void {
  if (visible) {
    if (reduceMotion.matches || pausedByUser.has(video)) return;
    video.muted = true;
    video.play().catch(() => {
      // El navegador puede bloquear la reproducción automática: quedan los controles.
    });
  } else if (!video.paused) {
    pausedByScript.add(video);
    video.pause();
  }
}

if (videos.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) onVisibilityChange(entry.target as HTMLVideoElement, entry.isIntersecting);
    },
    { threshold: 0.5 },
  );
  for (const video of videos) {
    video.addEventListener('pause', () => {
      if (pausedByScript.delete(video)) return;
      pausedByUser.add(video);
    });
    video.addEventListener('play', () => pausedByUser.delete(video));
    observer.observe(video);
  }
}
