import { useState, useEffect, useCallback } from 'react';
import { tagApi } from '../api/client';
import type { TagResponse } from '../api/generated';

export function useTags(videoId?: number) {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [allTags, setAllTags] = useState<TagResponse[]>([]);

  const refreshVideoTags = useCallback(async () => {
    if (!videoId) {
      setTags([]);
      return;
    }
    try {
      const items = await tagApi.listByVideo({ videoId });
      setTags(items);
    } catch (error) {
      console.error('Failed to fetch video tags:', error);
    }
  }, [videoId]);

  const refreshAllTags = useCallback(async () => {
    try {
      const items = await tagApi.list1();
      setAllTags(items);
    } catch (error) {
      console.error('Failed to fetch all tags:', error);
    }
  }, []);

  useEffect(() => {
    refreshVideoTags();
  }, [refreshVideoTags]);

  useEffect(() => {
    refreshAllTags();
  }, [refreshAllTags]);

  const addTag = useCallback(
    async (name: string) => {
      if (!videoId) return;
      try {
        await tagApi.addTagToVideo({
          videoId,
          tagCreateRequest: { name },
        });
        await refreshVideoTags();
        await refreshAllTags();
      } catch (error) {
        console.error('Failed to add tag:', error);
      }
    },
    [videoId, refreshVideoTags, refreshAllTags],
  );

  const removeTag = useCallback(
    async (tagId: number) => {
      if (!videoId) return;
      try {
        await tagApi.removeTagFromVideo({ videoId, tagId });
        await refreshVideoTags();
      } catch (error) {
        console.error('Failed to remove tag:', error);
      }
    },
    [videoId, refreshVideoTags],
  );

  return { tags, allTags, addTag, removeTag, refreshAllTags };
}
