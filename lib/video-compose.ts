export type StoryboardScene = {
  heading?: string;
  line?: string;
  visual?: string;
  color?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function canvasSize(aspectRatio: string) {
  if (aspectRatio === '16:9') return { width: 1280, height: 720 };
  if (aspectRatio === '1:1') return { width: 720, height: 720 };
  return { width: 720, height: 1280 };
}

function pickRecorderType() {
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  return types.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || '';
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 5);
}

export async function composeMotionVideo(options: {
  title: string;
  scenes: StoryboardScene[];
  aspectRatio?: string;
  durationSeconds?: number;
}) {
  const scenes = (options.scenes || []).filter((scene) => scene.heading || scene.line || scene.visual);
  const fallback: StoryboardScene[] = scenes.length
    ? scenes
    : [
        { heading: 'HOOK', line: options.title, color: '#4f46e5' },
        { heading: 'STORY', line: 'AI turned your prompt into a motion reel.', color: '#7c3aed' },
        { heading: 'CTA', line: 'Post this clip across every channel.', color: '#db2777' },
      ];

  const { width, height } = canvasSize(options.aspectRatio || '9:16');
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create a video canvas in this browser.');

  const stream = canvas.captureStream(30);
  const mimeType = pickRecorderType();
  if (!mimeType) throw new Error('This browser cannot record a video reel. Try Chrome or Edge.');

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_500_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  const seconds = Math.min(12, Math.max(4, Number(options.durationSeconds) || 8));
  const msPerScene = (seconds * 1000) / fallback.length;
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });
  recorder.start(200);

  for (const scene of fallback) {
    const color = scene.color || '#4f46e5';
    const frames = Math.max(18, Math.round(msPerScene / 32));
    for (let i = 0; i < frames; i += 1) {
      const progress = i / frames;
      const zoom = 1 + progress * 0.08;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.font = `700 ${Math.round(width * 0.045)}px sans-serif`;
      ctx.fillText(scene.heading || 'SCENE', width * 0.08, height * 0.22);

      ctx.font = `800 ${Math.round(width * 0.07)}px sans-serif`;
      const lines = wrapText(ctx, scene.line || scene.visual || options.title, width * 0.84);
      lines.forEach((line, index) => {
        ctx.fillText(line, width * 0.08, height * 0.38 + index * width * 0.09);
      });

      ctx.globalAlpha = 0.7;
      ctx.font = `600 ${Math.round(width * 0.032)}px sans-serif`;
      ctx.fillText('SocialFlow AI Reel', width * 0.08, height * 0.9);
      ctx.globalAlpha = 1;
      await sleep(32);
    }
  }

  recorder.stop();
  await stopped;

  const blob = new Blob(chunks, { type: mimeType });
  if (!blob.size) throw new Error('The motion reel was empty. Try generating again.');
  return URL.createObjectURL(blob);
}

export function isPlayableVideoUrl(url?: string) {
  if (!url) return false;
  return (
    url.startsWith('blob:') ||
    url.startsWith('data:video') ||
    /\/api\/ai\/media\//.test(url) ||
    /\.(mp4|webm|mov)(\?|$)/i.test(url)
  );
}
