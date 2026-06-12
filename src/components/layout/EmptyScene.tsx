import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { EmptyIllustration } from './EmptyIllustration';

interface EmptySceneProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  to?: string;
  onAction?: () => void;
}

export const EmptyScene: React.FC<EmptySceneProps> = (props) => (
  <div className="rounded-[1.75rem] border border-dashed border-border bg-bg-card/42 p-2">
    <EmptyIllustration {...props} />
  </div>
);
