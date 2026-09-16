'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';

export type PipelineStage = {
  id: string;
  label: string;
  status?: 'pending' | 'running' | 'done' | string;
};

const DEFAULT_STAGES: PipelineStage[] = [
  { id: 'input', label: 'Script intake' },
  { id: 'plan', label: 'Scene planning' },
  { id: 'assets', label: 'Asset generation' },
  { id: 'assemble', label: 'Video assembly' },
  { id: 'store', label: 'Store & review' },
  { id: 'publish', label: 'Publish packages' },
];

export function PipelineStepper({
  stages,
  current,
}: {
  stages?: PipelineStage[];
  current?: string;
}) {
  const items = stages?.length ? stages : DEFAULT_STAGES;

  return (
    <ol className="grid grid-cols-2 md:grid-cols-6 gap-2">
      {items.map((stage, index) => {
        const status = stage.status || (stage.id === current ? 'running' : 'pending');
        const done = status === 'done';
        const running = status === 'running';
        return (
          <li
            key={stage.id}
            className={`rounded-2xl border px-3 py-2.5 text-left ${
              done
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : running
                  ? 'border-indigo-500/40 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>{index + 1}</span>
              {done ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : null}
              {running ? <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" /> : null}
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100 leading-snug">
              {stage.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
