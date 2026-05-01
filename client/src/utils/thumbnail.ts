export function generateThumbnail(videoSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
      video.src = '';
      video.load();
    };

    const onLoaded = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    const onSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          reject(new Error('Failed to get canvas context'));
          return;
        }

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const scale = Math.max(size / vw, size / vh);
        const sw = size / scale;
        const sh = size / scale;
        const sx = (vw - sw) / 2;
        const sy = (vh - sh) / 2;

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        cleanup();
        resolve(dataUrl);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    const onError = () => {
      cleanup();
      reject(new Error('Failed to load video'));
    };

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', onError);

    video.src = videoSrc;
    video.load();
  });
}
