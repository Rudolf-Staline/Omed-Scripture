import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpenText, Cloud, Database, HeartHandshake, Mail, ShieldCheck, Sparkles, Wifi } from 'lucide-react';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { StudyPanel } from '../../components/layout/StudyPanel';
import { createDiagnosticsText, APP_VERSION } from '../../utils/diagnostics';
import { useSettingsStore } from '../../store/useSettingsStore';

const repoBase = 'https://github.com/Rudolf-Staline/Omed-Scripture/blob/main';

const features = [
  { icon: BookOpenText, title: 'Lecture et recherche', text: 'Reader, Bible Picker, recherche, favoris, notes et surlignages pour garder le texte au centre.' },
  { icon: Wifi, title: 'PWA et hors ligne', text: 'Installation possible comme app web et accès hors ligne selon les chapitres et index statiques disponibles.' },
  { icon: Sparkles, title: 'Mémoire et reprise', text: 'Memory, Review Center, Progress Score et routines douces pour reprendre sans pression.' },
  { icon: Cloud, title: 'Synchronisation optionnelle', text: 'Google Drive AppData peut sauvegarder les données si l’utilisateur se connecte et active la sync.' },
];

export const AboutPage: React.FC = () => {
  const { settings, synced } = useSettingsStore();
  const [copied, setCopied] = useState(false);
  const diagnostics = createDiagnosticsText({ theme: settings.theme, syncEnabled: synced });
  const feedbackSubject = encodeURIComponent('Retour bêta Omed Scripture');
  const feedbackBody = encodeURIComponent(`Bonjour,\n\nVoici mon retour sur Omed Scripture :\n\n[Décrivez le bug, l’idée ou le contexte de test]\n\n--- Diagnostic optionnel à coller si vous l’acceptez ---\n${diagnostics}`);

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
    <PageCanvas width="wide" className="space-y-6">
      <PageHero
        kicker="Bêta publique · Omed Scripture"
        title="Lire, étudier et reprendre les Écritures dans une interface calme"
        icon={HeartHandshake}
        intro="Omed Scripture est une application biblique moderne en bêta. Elle rassemble lecture, recherche, annotations, mémorisation, études, plans, prières et outils hors ligne sans ajouter de backend obligatoire."
        actions={(
          <>
            <Link to="/" className="omed-button-primary px-4 py-2 text-sm">Ouvrir l’app</Link>
            <a href={`mailto:?subject=${feedbackSubject}&body=${feedbackBody}`} className="omed-button-secondary px-4 py-2 text-sm">Envoyer un retour</a>
          </>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <StudyPanel key={feature.title} icon={feature.icon} title={feature.title}>
            <p className="text-sm leading-6 text-text-secondary">{feature.text}</p>
          </StudyPanel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StudyPanel icon={ShieldCheck} title="Respect des données">
          <p className="text-sm leading-6 text-text-secondary">Les notes, prières, favoris et réglages restent dans le navigateur, sauf synchronisation Google Drive explicitement activée. Aucun analytics n’est configuré dans le projet.</p>
          <a className="mt-3 inline-flex text-sm font-semibold text-accent-gold" href={`${repoBase}/docs/PRIVACY_NOTES.md`} target="_blank" rel="noreferrer">Lire les notes confidentialité</a>
        </StudyPanel>
        <StudyPanel icon={Database} title="Données bibliques et licences">
          <p className="text-sm leading-6 text-text-secondary">Certaines traductions nécessitent internet ou une source externe selon leur statut de licence. Aucune traduction protégée ne doit être ajoutée sans autorisation.</p>
          <a className="mt-3 inline-flex text-sm font-semibold text-accent-gold" href={`${repoBase}/docs/BIBLE_RIGHTS_AND_LICENSES.md`} target="_blank" rel="noreferrer">Lire les notes licences</a>
        </StudyPanel>
        <StudyPanel icon={Mail} title="Retour bêta sans backend">
          <p className="text-sm leading-6 text-text-secondary">Vous pouvez copier un diagnostic technique non personnel, puis l’ajouter volontairement à un e-mail ou à une issue GitHub.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={copyDiagnostics} className="omed-button-secondary px-4 py-2 text-sm">{copied ? 'Diagnostic copié' : 'Copier diagnostic'}</button>
            <a className="omed-button-secondary px-4 py-2 text-sm" href="https://github.com/Rudolf-Staline/Omed-Scripture/issues/new/choose" target="_blank" rel="noreferrer">GitHub Issues</a>
          </div>
        </StudyPanel>
      </div>

      <section className="omed-panel p-6 text-sm leading-7 text-text-secondary">
        <p className="omed-kicker mb-3">Version {APP_VERSION}</p>
        <h2 className="font-display text-2xl font-semibold text-text-primary">Limites honnêtes de la bêta</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Le comportement offline dépend des packs statiques, des chapitres déjà ouverts et du cache du navigateur.</li>
          <li>La synchronisation Google Drive est optionnelle et n’est pas présentée comme un chiffrement de bout en bout.</li>
          <li>Les contenus bibliques doivent rester conformes aux droits des traductions et aux licences documentées.</li>
          <li>Un humain doit encore valider la QA mobile, PWA installée, offline réel et synchronisation sur compte de test avant diffusion large.</li>
        </ul>
      </section>
    </PageCanvas>
  );
};
