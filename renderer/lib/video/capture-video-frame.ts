export function captureVideoFrame(
  video: HTMLVideoElement,
  format: 'jpeg' | 'png' = 'jpeg',
  quality = 0.72,
): {
  blob?: Blob;
  dataUri?: string;
  format?: 'jpeg' | 'png';
} {
  const canvas = <HTMLCanvasElement>document.createElement('CANVAS');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {};
  }
  ctx.drawImage(video, 0, 0);

  const dataUri = canvas.toDataURL('image/' + format, quality);
  const data = dataUri.split(',')[1];
  const mimeType = dataUri.split(';')[0].slice(5);

  const bytes = window.atob(data);
  const buf = new ArrayBuffer(bytes.length);
  const arr = new Uint8Array(buf);

  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  const blob = new Blob([arr], { type: mimeType });
  return { blob: blob, dataUri: dataUri, format: format };
}
