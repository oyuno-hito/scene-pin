import { useState, useEffect, useCallback } from 'react';
import { db, type Bookmark } from '../db';

export function useBookmarks(videoId: number) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const refresh = useCallback(async () => {
    if (!videoId) {
      setBookmarks([]);
      return;
    }
    const items = await db.bookmarks
      .where('videoId')
      .equals(videoId)
      .sortBy('timestamp');
    setBookmarks(items);
  }, [videoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBookmark = useCallback(
    async (timestamp: number, memo = '') => {
      await db.bookmarks.add({
        videoId,
        timestamp,
        memo,
        createdAt: Date.now(),
      });
      await refresh();
    },
    [videoId, refresh],
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
