export type CollectionItemType = 'verse' | 'note' | 'prayer' | 'favorite';

export interface CollectionItemRef {
  id: string;
  type: CollectionItemType;
  refId: string;
  label: string;
  createdAt: string;
}

export interface SpiritualCollection {
  id: string;
  title: string;
  description?: string;
  color?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  items: CollectionItemRef[];
}
