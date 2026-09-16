export type StoryboardScene = {
  heading?: string;
  line?: string;
  visual?: string;
  color?: string;
  imageUrl?: string;
  voiceover?: string;
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

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (!src) return resolve(null);
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function attachVoiceover(stream: MediaStream, audioUrl?: string) {
  if (!audioUrl || typeof AudioContext === 'undefined') return;
  try {
    const audio = new Audio(audioUrl);
    audio.crossOrigin = 'anonymous';
    await audio.play().catch(() => undefined);
    const context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const dest = context.createMediaStreamDestination();
    source.connect(dest);
    source.connect(context.destination);
    dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
  } catch {
    // Captions still play if the browser blocks mixed audio.
  }
}

export async function composeMotionVideo(options: {
  title: string;
  scenes: StoryboardScene[];
  aspectRatio?: string;
  durationSeconds?: number;
  brandName?: string;
  audioUrl?: string;
}) {
  const scenes = (options.scenes || []).filter((scene) => scene.heading || scene.line || scene.visual);
  const fallback: StoryboardScene[] = scenes.length
    ? scenes
    : [
        { heading: 'HOOK', line: options.title, color: '#4f46e5' },
        { heading: 'STORY', line: 'AI turned your script into a timed reel.', color: '#7c3aed' },
        { heading: 'CTA', line: 'Review, then publish across every channel.', color: '#db2777' },
      ];

  const { width, height } = canvasSize(options.aspectRatio || '9:16');
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create a video canvas in this browser.');

  const images = await Promise.all(fallback.map((scene) => loadImage(scene.imageUrl || '')));
  const stream = canvas.captureStream(30);
  await attachVoiceover(stream, options.audioUrl);
  const mimeType = pickRecorderType();
  if (!mimeType) throw new Error('This browser cannot record a video reel. Try Chrome or Edge.');

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_500_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  const seconds = Math.min(30, Math.max(6, Number(options.durationSeconds) || 12));
  const msPerScene = (seconds * 1000) / fallback.length;
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });
  recorder.start(200);

  for (const [sceneIndex, scene] of fallback.entries()) {
    const color = scene.color || '#4f46e5';
    const still = images[sceneIndex];
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
      if (still) {
        ctx.drawImage(still, 0, 0, width, height);
        ctx.fillStyle = 'rgba(2,6,23,0.45)';
        ctx.fillRect(0, 0, width, height);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.font = `700 ${Math.round(width * 0.045)}px sans-serif`;
      ctx.fillText(scene.heading || 'SCENE', width * 0.08, height * 0.2);

      ctx.font = `800 ${Math.round(width * 0.064)}px sans-serif`;
      const lines = wrapText(ctx, scene.line || scene.visual || options.title, width * 0.84);
      lines.forEach((line, index) => {
        ctx.fillText(line, width * 0.08, height * 0.34 + index * width * 0.085);
      });

      ctx.globalAlpha = 0.75;
      ctx.font = `600 ${Math.round(width * 0.03)}px sans-serif`;
      ctx.fillText(options.brandName || 'SocialFlow AI Reel', width * 0.08, height * 0.9);
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
