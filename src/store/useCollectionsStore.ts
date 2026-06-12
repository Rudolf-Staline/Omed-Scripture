import { create } from 'zustand';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import type { CollectionItemRef, CollectionItemType, SpiritualCollection } from '../types/collections';

const MAX_COLLECTIONS = 80;
const COLORS = ['gold', 'sage', 'brown', 'rose', 'blue'];
const TYPES: CollectionItemType[] = ['verse', 'note', 'prayer', 'favorite'];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isIsoString = (value: unknown): value is string => typeof value === 'string' && !Number.isNaN(Date.parse(value));

const sanitizeItem = (value: unknown): CollectionItemRef | null => {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || typeof value.refId !== 'string' || typeof value.label !== 'string') return null;
  if (!TYPES.includes(value.type as CollectionItemType)) return null;
  return { id: value.id, type: value.type as CollectionItemType, refId: value.refId, label: value.label, createdAt: isIsoString(value.createdAt) ? value.createdAt : new Date().toISOString() };
};

export const sanitizeCollections = (value: unknown): SpiritualCollection[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((entry): SpiritualCollection[] => {
    if (!isRecord(entry) || typeof entry.id !== 'string' || typeof entry.title !== 'string' || !entry.title.trim() || seen.has(entry.id)) return [];
    seen.add(entry.id);
    const now = new Date().toISOString();
    const items = Array.isArray(entry.items) ? entry.items.map(sanitizeItem).filter((item): item is CollectionItemRef => Boolean(item)) : [];
    const tags = Array.isArray(entry.tags) ? entry.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 12) : [];
    return [{
      id: entry.id,
      title: entry.title.trim().slice(0, 80),
      description: typeof entry.description === 'string' ? entry.description.slice(0, 240) : undefined,
      color: typeof entry.color === 'string' && COLORS.includes(entry.color) ? entry.color : 'gold',
      tags,
      createdAt: isIsoString(entry.createdAt) ? entry.createdAt : now,
      updatedAt: isIsoString(entry.updatedAt) ? entry.updatedAt : now,
      items,
    }];
  }).slice(0, MAX_COLLECTIONS);
};

const getStorage = (): Storage | undefined => typeof localStorage === 'undefined' ? undefined : localStorage;

const readInitial = (storage: Storage | undefined = getStorage()): SpiritualCollection[] => {
  if (!storage) return [];
  try {
    const stored = storage.getItem(OMED_STORAGE_KEYS.collections);
    return stored ? sanitizeCollections(JSON.parse(stored)) : [];
  } catch (error) {
    console.error('Failed to read collections', error);
    return [];
  }
};

const persist = (collections: SpiritualCollection[], storage: Storage | undefined = getStorage()) => {
  if (!storage) return;
  try { storage.setItem(OMED_STORAGE_KEYS.collections, JSON.stringify(collections)); } catch (error) { console.error('Failed to persist collections', error); }
};

interface CollectionsState {
  collections: SpiritualCollection[];
  createCollection: (input: { title: string; description?: string; color?: string; tags?: string[] }) => string;
  updateCollection: (id: string, patch: Partial<Pick<SpiritualCollection, 'title' | 'description' | 'color' | 'tags'>>) => void;
  deleteCollection: (id: string) => void;
  addItem: (collectionId: string, item: Omit<CollectionItemRef, 'id' | 'createdAt'>) => void;
  removeItem: (collectionId: string, itemId: string) => void;
  loadCollections: (value: unknown) => void;
}

const makeId = () => `collection_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useCollectionsStore = create<CollectionsState>((set) => ({
  collections: readInitial(),
  createCollection: (input) => {
    const id = makeId();
    set((state) => {
      const now = new Date().toISOString();
      const next = sanitizeCollections([{ id, title: input.title || 'Nouvelle collection', description: input.description, color: input.color, tags: input.tags, createdAt: now, updatedAt: now, items: [] }, ...state.collections]);
      persist(next);
      return { collections: next };
    });
    return id;
  },
  updateCollection: (id, patch) => set((state) => {
    const next = sanitizeCollections(state.collections.map((collection) => collection.id === id ? { ...collection, ...patch, updatedAt: new Date().toISOString() } : collection));
    persist(next);
    return { collections: next };
  }),
  deleteCollection: (id) => set((state) => {
    const next = state.collections.filter((collection) => collection.id !== id);
    persist(next);
    return { collections: next };
  }),
  addItem: (collectionId, item) => set((state) => {
    const next = state.collections.map((collection) => {
      if (collection.id !== collectionId || collection.items.some((existing) => existing.type === item.type && existing.refId === item.refId)) return collection;
      return { ...collection, updatedAt: new Date().toISOString(), items: [{ ...item, id: makeId(), createdAt: new Date().toISOString() }, ...collection.items] };
    });
    persist(next);
    return { collections: next };
  }),
  removeItem: (collectionId, itemId) => set((state) => {
    const next = state.collections.map((collection) => collection.id === collectionId ? { ...collection, updatedAt: new Date().toISOString(), items: collection.items.filter((item) => item.id !== itemId) } : collection);
    persist(next);
    return { collections: next };
  }),
  loadCollections: (value) => {
    const collections = sanitizeCollections(value);
    persist(collections);
    set({ collections });
  },
}));
