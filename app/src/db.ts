import Dexie, { type EntityTable } from 'dexie';

export interface Bookmark {
  id?: number;
  videoName: string;
  timestamp: number;
  memo: string;
  createdAt: number;
}

export interface LastVideo {
  id: number;
  videoName: string;
  filePath: string;
  lastTime: number;
  updatedAt: number;
}

const db = new Dexie('ScenePinDB') as Dexie & {
  bookmarks: EntityTable<Bookmark, 'id'>;
  lastVideo: EntityTable<LastVideo, 'id'>;
};

db.version(1).stores({
  bookmarks: '++id, videoName, timestamp',
});

db.version(2).stores({
  bookmarks: '++id, videoName, timestamp',
  lastVideo: 'id',
});

export { db };
