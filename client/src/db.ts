import Dexie, { type EntityTable } from 'dexie';

export interface WatchProgress {
  videoId: number;
  lastTime: number;
  duration?: number;
  updatedAt: number;
}

const db = new Dexie('ScenePinDB') as Dexie & {
  watchProgress: EntityTable<WatchProgress, 'videoId'>;
};

db.version(5).stores({
  watchProgress: 'videoId',
});

export { db };
