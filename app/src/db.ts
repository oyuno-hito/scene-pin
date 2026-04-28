import Dexie, { type EntityTable } from 'dexie';

export interface Bookmark {
  id?: number;
  videoId: number;
  timestamp: number;
  memo: string;
  createdAt: number;
}

export interface Video {
  id?: number;
  name: string;
  filePath: string;
  thumbnail?: string;
  lastTime: number;
  duration: number;
  createdAt: number;
  updatedAt: number;
}

const db = new Dexie('ScenePinDB') as Dexie & {
  bookmarks: EntityTable<Bookmark, 'id'>;
  videos: EntityTable<Video, 'id'>;
};

db.version(4).stores({
  bookmarks: '++id, videoId, timestamp',
  videos: '++id, name, updatedAt',
});

export { db };
