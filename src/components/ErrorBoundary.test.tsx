import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const CrashingChild = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  it('renders its children when no error occurs', () => {
    const html = renderToString(<StaticRouter location="/"><ErrorBoundary><p>OK</p></ErrorBoundary></StaticRouter>);
    expect(html).toContain('OK');
  });

  it('renders a safe fallback after a child crash', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const boundary = new ErrorBoundary({ children: <CrashingChild /> });
    boundary.setState = vi.fn((state) => { boundary.state = { ...boundary.state, ...state }; }) as never;
    boundary.componentDidCatch(new Error('boom'), { componentStack: 'stack' });
    boundary.state = ErrorBoundary.getDerivedStateFromError();
    const html = renderToString(<StaticRouter location="/">{boundary.render()}</StaticRouter>);

    expect(html).toContain('Erreur inattendue');
    expect(html).not.toContain('stack');
    spy.mockRestore();
  });
});
