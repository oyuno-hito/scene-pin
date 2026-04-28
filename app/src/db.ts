import Dexie, { type EntityTable } from 'dexie';

export interface Bookmark {
  id?: number;
  videoName: string;
  timestamp: number;
  memo: string;
  createdAt: number;
}

const db = new Dexie('MediaPlayerDB') as Dexie & {
  bookmarks: EntityTable<Bookmark, 'id'>;
};

db.version(1).stores({
  bookmarks: '++id, videoName, timestamp',
});

export { db };
