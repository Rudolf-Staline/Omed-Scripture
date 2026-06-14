import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpenText, Cloud, Database, HeartHandshake, Mail, ShieldCheck, Sparkles, Wifi, Layers, Palette, LayoutTemplate } from 'lucide-react';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { StudyPanel } from '../../components/layout/StudyPanel';
import { createDiagnosticsText, APP_VERSION } from '../../utils/diagnostics';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Button, Grid, Inline, Badge, Callout, Card, Stack } from '../../ui';

const repoBase = 'https://github.com/Rudolf-Staline/Omed-Scripture/blob/main';

const features = [
  { icon: BookOpenText, title: 'Lecture et recherche', text: 'Reader, Bible Picker, recherche, favoris, notes et surlignages pour garder le texte au centre.' },
  { icon: Wifi, title: 'PWA et hors ligne', text: 'Installation possible comme app web et accès hors ligne selon les chapitres et index statiques disponibles.' },
  { icon: Sparkles, title: 'Mémoire et reprise', text: 'Memory, Review Center, Progress Score et routines douces pour reprendre sans pression.' },
  { icon: Cloud, title: 'Synchronisation optionnelle', text: "Google Drive AppData peut sauvegarder les données si l'utilisateur se connecte et active la sync." },
];

export const AboutPage: React.FC = () => {
  const { settings, synced } = useSettingsStore();
  const [copied, setCopied] = useState(false);
  const diagnostics = createDiagnosticsText({ theme: settings.theme, syncEnabled: synced });
  const feedbackSubject = encodeURIComponent('Retour bêta Omed Scripture');
  const feedbackBody = encodeURIComponent(`Bonjour,\n\nVoici mon retour sur Omed Scripture :\n\n[Décrivez le bug, l'idée ou le contexte de test]\n\n--- Diagnostic optionnel à coller si vous l'acceptez ---\n${diagnostics}`);
  const mailtoHref = `mailto:?subject=${feedbackSubject}&body=${feedbackBody}`;

  const copyDiagnostics = async () => {
    try {
      await navigator.clipboard.writeText(diagnostics);
      setCopied(true);
      toast.success('Diagnostic copié sans notes, prières, favoris ni compte utilisateur.');
    } catch {
      toast.error('Copie impossible dans ce navigateur.');
    }
  };

  return (
    <PageCanvas width="wide" className="space-y-8">
      <PageHero
        kicker="Bêta publique · Omed Scripture"
        title="Lire, étudier et reprendre les Écritures dans une interface calme"
        icon={HeartHandshake}
        intro="Omed Scripture est une application biblique moderne en bêta. Elle rassemble lecture, recherche, annotations, mémorisation, études, plans, prières et outils hors ligne sans ajouter de backend obligatoire."
        actions={(
          <>
            <Link to="/" className="omed-button-primary px-6 py-2.5 text-sm font-semibold rounded-2xl transition-transform hover:scale-105">
              Ouvrir l'app
            </Link>
            <Button
              variant="soft"
              tone="neutral"
              onClick={() => window.open(mailtoHref)}
              iconLeft={<Mail size={16} />}
            >
              Envoyer un retour
            </Button>
          </>
        )}
      />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-text-primary">Fonctionnalités clés</h2>
        </div>
        <Grid columns={4} gap="md">
          {features.map((feature) => (
            <StudyPanel key={feature.title} icon={feature.icon} title={feature.title}>
              <p className="text-sm leading-6 text-text-secondary">{feature.text}</p>
            </StudyPanel>
          ))}
        </Grid>
      </section>

      {/* SECTION HAUTEMENT VISIBLE BASEKIT */}
      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-semibold text-text-primary">Interface propulsée par BaseKit</h2>
          <Badge tone="primary" variant="soft">BaseKit v1</Badge>
          <Badge tone="success" variant="soft">Migration progressive</Badge>
        </div>
        <Grid columns={3} gap="lg">
          <Card variant="outlined" padding="lg" radius="lg" className="border-accent-gold/20 bg-accent-gold/5">
            <Stack gap="sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold/20 text-accent-gold">
                <LayoutTemplate size={24} />
              </div>
              <h3 className="font-semibold text-text-primary">Composants cohérents</h3>
              <p className="text-sm leading-6 text-text-secondary">
                L'interface utilise progressivement l'architecture UI de BaseKit pour offrir des composants (cartes, boutons, badges) stables et accessibles.
              </p>
            </Stack>
          </Card>
          <Card variant="outlined" padding="lg" radius="lg">
            <Stack gap="sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-secondary text-accent-brown">
                <Palette size={24} />
              </div>
              <h3 className="font-semibold text-text-primary">Thèmes préservés</h3>
              <p className="text-sm leading-6 text-text-secondary">
                BaseKit s'intègre parfaitement aux thèmes littéraires et spirituels d'Omed Scripture, conservant la lisibilité et l'atmosphère calme.
              </p>
            </Stack>
          </Card>
          <Card variant="outlined" padding="lg" radius="lg">
            <Stack gap="sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-secondary text-text-muted">
                <Layers size={24} />
              </div>
              <h3 className="font-semibold text-text-primary">BaseKit comme couche UI</h3>
              <p className="text-sm leading-6 text-text-secondary">
                Séparation stricte entre la logique métier biblique et la présentation visuelle, facilitant les futures évolutions.
              </p>
            </Stack>
          </Card>
        </Grid>
      </section>

      <Grid columns={3} gap="md">
        <StudyPanel icon={ShieldCheck} title="Respect des données">
          <p className="text-sm leading-6 text-text-secondary">Les notes, prières, favoris et réglages restent dans le navigateur, sauf synchronisation Google Drive explicitement activée.</p>
          <a className="mt-3 inline-flex text-sm font-semibold text-accent-gold hover:underline" href={`${repoBase}/docs/PRIVACY_NOTES.md`} target="_blank" rel="noreferrer">Lire les notes confidentialité</a>
        </StudyPanel>
        <StudyPanel icon={Database} title="Données bibliques et licences">
          <p className="text-sm leading-6 text-text-secondary">Certaines traductions nécessitent internet ou une source externe selon leur statut de licence. Aucune traduction protégée sans autorisation.</p>
          <a className="mt-3 inline-flex text-sm font-semibold text-accent-gold hover:underline" href={`${repoBase}/docs/BIBLE_RIGHTS_AND_LICENSES.md`} target="_blank" rel="noreferrer">Lire les notes licences</a>
        </StudyPanel>
        <StudyPanel icon={Mail} title="Retour bêta sans backend">
          <p className="text-sm leading-6 text-text-secondary">Vous pouvez copier un diagnostic technique non personnel, puis l'ajouter volontairement à un e-mail ou à une issue GitHub.</p>
          <Inline gap="sm" wrap className="mt-4">
            <Button variant="solid" tone="neutral" onClick={copyDiagnostics}>
              {copied ? 'Diagnostic copié' : 'Copier diagnostic'}
            </Button>
            <a
              className="omed-button-secondary px-4 py-2 text-sm"
              href="https://github.com/Rudolf-Staline/Omed-Scripture/issues/new/choose"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Issues
            </a>
          </Inline>
        </StudyPanel>
      </Grid>

      <Callout tone="warning" title="Limites honnêtes de la bêta" icon={<ShieldCheck size={20} />}>
        <div className="mb-3">
          <Badge tone="neutral" variant="soft">Version {APP_VERSION}</Badge>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-text-secondary">
          <li>Le comportement offline dépend des packs statiques, des chapitres déjà ouverts et du cache du navigateur.</li>
          <li>La synchronisation Google Drive est optionnelle et n'est pas présentée comme un chiffrement de bout en bout.</li>
          <li>Les contenus bibliques doivent rester conformes aux droits des traductions et aux licences documentées.</li>
          <li>Un humain doit encore valider la QA mobile, PWA installée, offline réel et synchronisation sur compte de test avant diffusion large.</li>
        </ul>
      </Callout>

    </PageCanvas>
  );
};
