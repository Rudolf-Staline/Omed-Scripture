import React, { useState } from 'react';
import { Boxes, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCollectionsStore } from '../../store/useCollectionsStore';

export const CollectionsPage: React.FC = () => {
  const { collections, createCollection, updateCollection, deleteCollection, removeItem } = useCollectionsStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const create = () => {
    if (!title.trim()) return;
    createCollection({ title, description });
    setTitle('');
    setDescription('');
    toast.success('Collection créée.');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-gold"><Boxes size={15} /> Collections</p><h1 className="mt-2 text-3xl font-bold text-text-primary">Collections spirituelles</h1><p className="mt-2 max-w-2xl text-text-secondary">Regroupez favoris, notes et prières autour d’un thème. L’ajout rapide est disponible depuis Favoris.</p></header>
      <section className="rounded-[1.7rem] border border-border bg-bg-card p-5"><h2 className="text-lg font-bold text-text-primary">Créer une collection</h2><div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Paix, Courage, Étude de Jean…" className="rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary" /><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description optionnelle" className="rounded-2xl border border-border bg-bg-primary px-4 py-3 text-text-primary" /><button type="button" onClick={create} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent-gold px-5 font-bold text-white"><Plus size={18} /> Créer</button></div></section>
      {collections.length === 0 ? <section className="rounded-[1.7rem] border border-dashed border-border bg-bg-card p-8 text-center text-text-secondary">Aucune collection pour le moment. Créez un espace pour mémoriser les passages importants.</section> : <section className="grid gap-4 md:grid-cols-2">{collections.map((collection) => <article key={collection.id} className="rounded-[1.7rem] border border-border bg-bg-card p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><input value={collection.title} onChange={(event) => updateCollection(collection.id, { title: event.target.value })} className="w-full bg-transparent text-xl font-bold text-text-primary outline-none" /><textarea value={collection.description ?? ''} onChange={(event) => updateCollection(collection.id, { description: event.target.value })} placeholder="Ajouter une description" className="mt-2 w-full resize-none rounded-2xl border border-border bg-bg-primary px-3 py-2 text-sm text-text-secondary outline-none" /></div><button type="button" onClick={() => { if (window.confirm('Supprimer cette collection ?')) deleteCollection(collection.id); }} className="rounded-xl p-2 text-text-muted hover:bg-bg-secondary hover:text-[color:var(--color-danger)]" aria-label="Supprimer"><Trash2 size={17} /></button></div><div className="mt-4 space-y-2">{collection.items.length === 0 ? <p className="rounded-2xl bg-bg-secondary p-3 text-sm text-text-muted">Aucun élément ajouté.</p> : collection.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-bg-secondary p-3 text-sm"><span><strong className="text-text-primary">{item.label}</strong><span className="ml-2 text-text-muted">{item.type}</span></span><button type="button" onClick={() => removeItem(collection.id, item.id)} className="text-text-muted hover:text-[color:var(--color-danger)]" aria-label="Retirer"><X size={15} /></button></div>)}</div></article>)}</section>}
    </div>
  );
};
