import React from 'react';
import clsx from 'clsx';

type CanvasWidth = 'reading' | 'list' | 'wide';

const WIDTHS: Record<CanvasWidth, string> = {
  reading: 'max-w-4xl',
  list: 'max-w-5xl',
  wide: 'max-w-6xl',
};

interface PageCanvasProps {
  width?: CanvasWidth;
  className?: string;
  children: React.ReactNode;
}

/**
 * Surface de page unifiée du Interface moderne. Remplace les enveloppes
 * `mx-auto max-w-… py-…` répétées dans chaque page par une largeur de
 * canevas cohérente (lecture, liste, large).
 */
export const PageCanvas: React.FC<PageCanvasProps> = ({ width = 'list', className, children }) => (
  <div className={clsx('mx-auto w-full py-4 md:py-8', WIDTHS[width], className)}>{children}</div>
);
