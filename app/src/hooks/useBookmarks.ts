import { useState, useEffect, useCallback } from 'react';
import { db, type Bookmark } from '../db';

export function useBookmarks(videoName: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const refresh = useCallback(async () => {
    if (!videoName) {
      setBookmarks([]);
      return;
    }
    const items = await db.bookmarks
      .where('videoName')
      .equals(videoName)
      .sortBy('timestamp');
    setBookmarks(items);
  }, [videoName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBookmark = useCallback(
    async (timestamp: number, memo = '') => {
      await db.bookmarks.add({
        videoName,
        timestamp,
        memo,
        createdAt: Date.now(),
      });
      await refresh();
    },
    [videoName, refresh],
  );

  const updateMemo = useCallback(
    async (id: number, memo: string) => {
      await db.bookmarks.update(id, { memo });
      await refresh();
    },
    [refresh],
  );

  const removeBookmark = useCallback(
    async (id: number) => {
      await db.bookmarks.delete(id);
      await refresh();
    },
    [refresh],
  );

  return { bookmarks, addBookmark, updateMemo, removeBookmark };
}
