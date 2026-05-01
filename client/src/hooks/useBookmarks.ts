import { useState, useEffect, useCallback } from 'react';
import { bookmarkApi } from '../api/client';
import type { BookmarkResponse } from '../api/generated';

export function useBookmarks(videoId: number) {
  const [bookmarks, setBookmarks] = useState<BookmarkResponse[]>([]);

  const refresh = useCallback(async () => {
    if (!videoId) {
      setBookmarks([]);
      return;
    }
    try {
      const items = await bookmarkApi.listByVideo1({ videoId });
      setBookmarks(items);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
  }, [videoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBookmark = useCallback(
    async (timestamp: number, memo = '') => {
      try {
        await bookmarkApi.create({
          videoId,
          bookmarkCreateRequest: { timestamp, memo },
        });
        await refresh();
      } catch (error) {
        console.error('Failed to add bookmark:', error);
      }
    },
    [videoId, refresh],
  );

  const updateMemo = useCallback(
    async (id: number, memo: string) => {
      try {
        await bookmarkApi.update({
          videoId,
          id,
          bookmarkUpdateRequest: { memo },
        });
        await refresh();
      } catch (error) {
        console.error('Failed to update bookmark:', error);
      }
    },
    [videoId, refresh],
  );

  const removeBookmark = useCallback(
    async (id: number) => {
      try {
        await bookmarkApi._delete({ videoId, id });
        await refresh();
      } catch (error) {
        console.error('Failed to remove bookmark:', error);
      }
    },
    [videoId, refresh],
  );

  return { bookmarks, addBookmark, updateMemo, removeBookmark };
}
