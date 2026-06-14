import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Button,
  Card,
  EmptyState,
  Spinner,
  Badge,
  Alert,
  TextInput,
  Stack,
} from '../index';
import { EmptyState as OmedEmptyState } from '../../components/EmptyState';

/**
 * Tests d'intégration BaseKit : ils sécurisent le pont (résolution des
 * paquets vendorisés, façade `src/ui`, rendu sans crash) sans viser une
 * couverture exhaustive. Le rendu se fait via `react-dom/server`, donc aucune
 * dépendance de test supplémentaire (jsdom, testing-library) n'est requise.
 */
describe('Façade BaseKit (src/ui)', () => {
  it('réexporte des composants définis', () => {
    for (const Component of [Button, Card, EmptyState, Spinner, Badge, Alert, TextInput, Stack]) {
      expect(Component).toBeDefined();
    }
  });

  it('rend un Button BaseKit sans planter', () => {
    const html = renderToStaticMarkup(<Button>Ouvrir</Button>);
    expect(html).toContain('Ouvrir');
    expect(html).toContain('<button');
  });

  it('rend un EmptyState BaseKit avec titre et description', () => {
    const html = renderToStaticMarkup(<EmptyState title="Vide" description="Rien ici" />);
    expect(html).toContain('Vide');
    expect(html).toContain('Rien ici');
  });

  it('rend un formulaire simple (Stack + TextInput + Button)', () => {
    const html = renderToStaticMarkup(
      <Stack>
        <TextInput placeholder="Référence" />
        <Button type="submit">Valider</Button>
      </Stack>,
    );
    expect(html).toContain('<input');
    expect(html).toContain('Valider');
  });
});

describe('EmptyState Omed migré sur BaseKit', () => {
  it('conserve son API (title / message) et rend le contenu', () => {
    const html = renderToStaticMarkup(
      <OmedEmptyState title="Aucun passage trouvé" message="Essayez un autre thème." />,
    );
    expect(html).toContain('Aucun passage trouvé');
    expect(html).toContain('Essayez un autre thème.');
  });

  it('affiche une action lorsque actionLabel + onAction sont fournis', () => {
    const html = renderToStaticMarkup(
      <OmedEmptyState title="Vide" message="…" actionLabel="Réinitialiser" onAction={() => {}} />,
    );
    expect(html).toContain('Réinitialiser');
  });
});
