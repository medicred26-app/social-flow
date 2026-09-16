'use client';

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
        ) : (
          <>
            <img
              src={videoUrl}
              alt={title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-0.5 fill-white" />
              </div>
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-slate-700">
          {playable ? 'Generated preview' : 'Preview still'} · {aspectRatio}
        </div>
      </div>

      {scenes && scenes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {scenes.slice(0, 4).map((scene, index) => (
            <div
              key={`${scene.heading || 'scene'}-${index}`}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                {scene.heading || `Scene ${index + 1}`}
              </p>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3">
                {scene.line || scene.visual}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
