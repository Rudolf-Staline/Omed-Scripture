import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import { BookOpenText, Cloud, LockKeyhole, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());

        login(
          {
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          },
          tokenResponse.access_token,
          tokenResponse.expires_in
        );
        navigate('/');
      } catch (error) {
        console.error('Failed to fetch user info', error);
        toast.error('Connexion Google impossible. Veuillez réessayer.');
      }
    },
    scope: 'https://www.googleapis.com/auth/drive.appdata',
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-primary px-4 py-8 text-text-primary sm:px-6 md:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--color-accent)_15%,transparent),transparent_28rem),radial-gradient(circle_at_86%_80%,color-mix(in_srgb,var(--color-copper)_12%,transparent),transparent_24rem)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent opacity-70" />

      <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-bg-secondary/70 shadow-[var(--shadow-panel)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between overflow-hidden p-8 md:p-12 lg:p-14">
          <div className="absolute inset-y-8 left-8 w-px bg-gradient-to-b from-transparent via-accent-gold/40 to-transparent" />
          <div className="relative pl-7">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-gold/25 bg-accent-gold/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
              <BookOpenText size={14} strokeWidth={1.5} />
              Omed Scripture
            </div>
            <h1 className="max-w-2xl font-display text-4xl leading-[1.05] tracking-tight text-text-primary md:text-6xl">
              Entrer dans un lieu calme pour habiter le texte.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-text-secondary md:text-lg">
              Lecture, notes, favoris et synchronisation restent au service d’une chose : une attention profonde aux Écritures, sans bruit visuel.
            </p>
          </div>

          <div className="relative mt-12 grid gap-3 pl-7 sm:grid-cols-3">
            {[
              { icon: LockKeyhole, label: 'Données privées' },
              { icon: Cloud, label: 'Sync discrète' },
              { icon: Sparkles, label: 'Lecture premium' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-bg-card/45 p-4 text-sm text-text-secondary">
                <item.icon className="mb-3 text-accent-gold" size={18} strokeWidth={1.5} />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center border-t border-border bg-bg-card/45 p-6 md:p-10 lg:border-l lg:border-t-0">
          <div className="w-full rounded-[1.5rem] border border-border bg-bg-primary/70 p-6 shadow-[var(--shadow-soft)] md:p-8">
            <p className="omed-kicker mb-3">Connexion</p>
            <h2 className="font-display text-3xl text-text-primary">Retrouver votre bibliothèque.</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">Connectez-vous pour synchroniser vos passages sauvegardés, notes et préférences via Google Drive AppData.</p>

            <button
              type="button"
              onClick={() => handleLogin()}
              className="mt-8 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-bg-card px-6 py-3 text-sm font-semibold text-text-primary hover:border-accent-gold/40 hover:bg-bg-secondary/70"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-[#4285F4]">G</span>
              Continuer avec Google
            </button>

            <p className="mt-5 border-t border-border pt-5 text-xs leading-6 text-text-muted">
              Omed utilise uniquement l’espace privé AppData de votre compte Google pour la synchronisation. Aucun visuel externe n’est chargé sur cet écran.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
