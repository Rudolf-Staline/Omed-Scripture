import React from 'react';
import clsx from 'clsx';

interface TimelineItem {
  id: string | number;
  title: React.ReactNode;
  meta?: React.ReactNode;
  body?: React.ReactNode;
  complete?: boolean;
  active?: boolean;
  action?: React.ReactNode;
}

interface TimelinePathProps {
  items: TimelineItem[];
  className?: string;
}

export const TimelinePath: React.FC<TimelinePathProps> = ({ items, className }) => (
  <ol className={clsx('timeline-path relative space-y-3', className)}>
    {items.map((item, index) => (
      <li key={item.id} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
        <div className="relative flex justify-center">
          {index < items.length - 1 && <span className="absolute top-9 h-[calc(100%+0.75rem)] w-px bg-border" aria-hidden="true" />}
          <span className={clsx('z-10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold', item.complete ? 'border-accent-gold bg-accent-gold text-bg-primary' : item.active ? 'border-accent-gold bg-accent-gold/12 text-accent-gold' : 'border-border bg-bg-card text-text-muted')}>
            {item.complete ? '✓' : index + 1}
          </span>
        </div>
        <article className={clsx('rounded-2xl border p-4', item.active ? 'border-accent-gold/45 bg-accent-gold/8' : 'border-border bg-bg-card/62')}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">{item.title}</h3>
              {item.meta && <div className="mt-1 text-xs font-semibold uppercase tracking-[0.13em] text-text-muted">{item.meta}</div>}
            </div>
            {item.action && <div className="shrink-0">{item.action}</div>}
          </div>
          {item.body && <div className="mt-3 text-sm leading-6 text-text-secondary">{item.body}</div>}
        </article>
      </li>
    ))}
  </ol>
);
