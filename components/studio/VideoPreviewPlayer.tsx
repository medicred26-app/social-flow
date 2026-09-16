'use client';

import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { isPlayableVideoUrl, StoryboardScene } from '@/lib/video-compose';

export function VideoPreviewPlayer({
  title,
  videoUrl,
  aspectRatio,
  scenes,
}: {
  title: string;
  videoUrl: string;
  aspectRatio: string;
  scenes?: StoryboardScene[];
}) {
  const playable = isPlayableVideoUrl(videoUrl);
  const reel = scenes && scenes.length ? scenes : [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (playable || reel.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % reel.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [playable, reel.length]);

  const scene = reel[active] || reel[0];

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl bg-slate-950 overflow-hidden aspect-[16/9] flex items-center justify-center border border-slate-800 shadow-inner">
        {playable ? (
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain bg-slate-950"
          />
        ) : scene ? (
          <div
            className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500"
            style={{
              background: `linear-gradient(160deg, ${scene.color || '#4f46e5'} 0%, #020617 75%)`,
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
              {scene.heading || 'Scene'}
            </p>
            <p className="mt-2 text-xl md:text-2xl font-extrabold text-white leading-tight max-w-xl">
              {scene.line || scene.visual || title}
            </p>
            <p className="mt-4 text-[11px] text-white/70">{title}</p>
          </div>
        ) : (
          <>
            <img src={videoUrl} alt={title} className="w-full h-full object-cover opacity-85" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-white/20 border border-white/40 text-white flex items-center justify-center">
                <Play className="w-6 h-6 ml-0.5 fill-white" />
              </div>
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-slate-700">
          {playable ? 'Generated preview' : 'Live storyboard preview'} · {aspectRatio}
        </div>
      </div>

      {reel.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {reel.slice(0, 4).map((item, index) => (
            <button
              key={`${item.heading || 'scene'}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`rounded-xl border p-2.5 text-left ${
                index === active
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                {item.heading || `Scene ${index + 1}`}
              </p>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3">
                {item.line || item.visual}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
