import React from 'react';
import { ContentDeck } from './ContentDeck';

interface NotebookLayoutProps {
  hero?: React.ReactNode;
  tools: React.ReactNode;
  children: React.ReactNode;
  toolsLabel?: string;
}

export const NotebookLayout: React.FC<NotebookLayoutProps> = ({ hero, tools, children, toolsLabel = 'Outils du carnet' }) => (
  <ContentDeck variant="notebook" lead={hero} rail={tools} railLabel={toolsLabel}>
    <div className="notebook-paper space-y-4 rounded-[1.75rem] border border-border bg-bg-card/45 p-3 shadow-[0_25px_80px_-65px_var(--color-shadow)] sm:p-5">
      {children}
    </div>
  </ContentDeck>
);
