import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Check, Sparkles } from 'lucide-react';
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { DailyGoalMinutes, OnboardingGoal, PreferredTopicId } from '../../types/onboarding';

const goals: Array<{ id: OnboardingGoal; label: string; helper: string }> = [
  { id: 'daily_reading', label: 'Lire chaque jour', helper: 'Construire une habitude simple.' },
  { id: 'study', label: 'Étudier', helper: 'Creuser un passage avec attention.' },
  { id: 'prayer', label: 'Prier', helper: 'Relier lecture et prière.' },
  { id: 'plan', label: 'Suivre un plan', helper: 'Avancer avec un parcours.' },
  { id: 'notes', label: 'Prendre des notes', helper: 'Garder ce qui résonne.' },
];

const topics: Array<{ id: PreferredTopicId; label: string }> = ['foi', 'paix', 'sagesse', 'courage', 'priere', 'famille', 'pardon', 'esperance'].map((id) => ({
  id: id as PreferredTopicId,
  label: ({ foi: 'Foi', paix: 'Paix', sagesse: 'Sagesse', courage: 'Courage', priere: 'Prière', famille: 'Famille', pardon: 'Pardon', esperance: 'Espérance' } as Record<PreferredTopicId, string>)[id as PreferredTopicId],
}));
const dailyGoals: DailyGoalMinutes[] = [5, 10, 15, 'free'];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences, complete, skip } = useOnboardingStore();
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const [step, setStep] = useState(0);
  const selectedTopics = preferences.topics;

  const finish = () => {
    updateSettings({ defaultTranslation: preferences.preferredTranslation });
    complete();
    navigate('/', { replace: true });
  };

  const toggleTopic = (topic: PreferredTopicId) => {
    const next = selectedTopics.includes(topic) ? selectedTopics.filter((item) => item !== topic) : [...selectedTopics, topic];
    updatePreferences({ topics: next.length > 0 ? next : [topic] });
  };

  const steps = [
    <section key="welcome" className="space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-gold/15 text-accent-gold"><Sparkles size={30} /></div>
      <h1 className="text-3xl font-bold text-text-primary">Bienvenue dans Omed Scripture</h1>
      <p className="mx-auto max-w-xl text-text-secondary">Quelques choix locaux suffisent pour préparer Today, Discover et vos objectifs. Aucun compte n’est obligatoire.</p>
    </section>,
    <section key="translation" className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">Votre lecture par défaut</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {FEATURED_TRANSLATIONS.slice(0, 6).map((translation) => <button key={translation.id} type="button" onClick={() => updatePreferences({ preferredTranslation: translation.id })} className={`rounded-3xl border p-4 text-left ${preferences.preferredTranslation === translation.id ? 'border-accent-gold bg-accent-gold/10' : 'border-border bg-bg-card'}`}><span className="font-bold text-text-primary">{translation.short}</span><span className="block text-sm text-text-secondary">{translation.name}</span></button>)}
      </div>
    </section>,
    <section key="goal" className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">Votre objectif principal</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {goals.map((goal) => <button key={goal.id} type="button" onClick={() => updatePreferences({ primaryGoal: goal.id })} className={`rounded-3xl border p-4 text-left ${preferences.primaryGoal === goal.id ? 'border-accent-gold bg-accent-gold/10' : 'border-border bg-bg-card'}`}><span className="font-bold text-text-primary">{goal.label}</span><span className="block text-sm text-text-secondary">{goal.helper}</span></button>)}
      </div>
    </section>,
    <section key="topics" className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">Centres d’intérêt</h2>
      <div className="flex flex-wrap gap-2">{topics.map((topic) => <button key={topic.id} type="button" onClick={() => toggleTopic(topic.id)} className={`rounded-full border px-4 py-2 font-semibold ${selectedTopics.includes(topic.id) ? 'border-accent-gold bg-accent-gold text-white' : 'border-border bg-bg-card text-text-secondary'}`}>{topic.label}</button>)}</div>
    </section>,
    <section key="routine" className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary">Objectif quotidien</h2>
      <div className="grid gap-3 sm:grid-cols-4">{dailyGoals.map((goal) => <button key={String(goal)} type="button" onClick={() => updatePreferences({ dailyGoalMinutes: goal })} className={`rounded-3xl border p-4 font-bold ${preferences.dailyGoalMinutes === goal ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border bg-bg-card text-text-primary'}`}>{goal === 'free' ? 'Libre' : `${goal} min`}</button>)}</div>
      <label className="block rounded-3xl border border-border bg-bg-card p-4"><span className="flex items-center gap-2 font-bold text-text-primary"><Bell size={18} /> Heure préférée</span><input type="time" value={preferences.preferredReminderTime ?? '08:00'} onChange={(event) => updatePreferences({ preferredReminderTime: event.target.value })} className="mt-3 w-full rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary" /><span className="mt-2 block text-sm text-text-muted">Préférence locale affichée dans l’app ; les notifications de fond ne sont pas promises.</span></label>
    </section>,
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center px-4 py-8">
      <div className="w-full rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3"><span className="rounded-full bg-bg-secondary px-3 py-1 text-sm font-bold text-text-secondary">Étape {step + 1}/{steps.length}</span><button type="button" onClick={() => { skip(); navigate('/', { replace: true }); }} className="text-sm font-bold text-text-muted hover:text-text-primary">Passer</button></div>
        {steps[step]}
        <div className="mt-8 flex justify-between gap-3"><button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="min-h-11 rounded-2xl border border-border px-4 font-semibold text-text-secondary disabled:opacity-40">Retour</button>{step === steps.length - 1 ? <button type="button" onClick={finish} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-5 font-bold text-white"><Check size={18} /> Terminer</button> : <button type="button" onClick={() => setStep((value) => value + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-5 font-bold text-white">Continuer <ArrowRight size={18} /></button>}</div>
      </div>
    </div>
  );
};
