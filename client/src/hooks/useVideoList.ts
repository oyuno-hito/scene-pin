import { useState, useEffect, useCallback } from 'react';
import { videoApi, uploadVideo } from '../api/client';
import type { VideoResponse } from '../api/generated';

export function useVideoList() {
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const items = await videoApi.list({});
      setVideos(items);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addVideo = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const video = await uploadVideo(file);
      await refresh();
      setIsLoading(false);
      return video.id;
    } catch (error) {
      console.error('Failed to add video:', error);
      setIsLoading(false);
      return null;
    }
  }, [refresh]);

  const removeVideo = useCallback(async (id: number) => {
    try {
      await videoApi.delete1({ id });
      await refresh();
    } catch (error) {
      console.error('Failed to remove video:', error);
    }
  }, [refresh]);

  return {
    videos,
    isLoading,
    addVideo,
    removeVideo,
    refresh,
  };
}
