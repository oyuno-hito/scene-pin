import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { db, type Video } from '../db';
import { generateThumbnail } from '../utils/thumbnail';

export function useVideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNative] = useState(() => Capacitor.isNativePlatform());

  const refresh = useCallback(async () => {
    const items = await db.videos.toArray();
    items.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    setVideos(items);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addVideo = useCallback(async (file?: File) => {
    setIsLoading(true);
    try {
      if (isNative) {
        const result = await FilePicker.pickVideos({ limit: 1 });
        if (result.files.length === 0) {
          setIsLoading(false);
          return null;
        }

        const pickedFile = result.files[0];
        const fileName = pickedFile.name || `video_${Date.now()}.mp4`;
        const storedPath = `videos/${Date.now()}_${fileName}`;

        if (pickedFile.data) {
          await Filesystem.writeFile({
            path: storedPath,
            data: pickedFile.data,
            directory: Directory.Documents,
            recursive: true,
          });
        } else if (pickedFile.path) {
          const readResult = await Filesystem.readFile({ path: pickedFile.path });
          await Filesystem.writeFile({
            path: storedPath,
            data: readResult.data,
            directory: Directory.Documents,
            recursive: true,
          });
        }

        const readResult2 = await Filesystem.readFile({
          path: storedPath,
          directory: Directory.Documents,
        });
        const blob = new Blob(
          [Uint8Array.from(atob(readResult2.data as string), c => c.charCodeAt(0))],
          { type: 'video/mp4' }
        );
        const tempUrl = URL.createObjectURL(blob);

        let thumbnail: string | undefined;
        try {
          thumbnail = await generateThumbnail(tempUrl);
        } catch (err) {
          console.error('Failed to generate thumbnail:', err);
        }
        URL.revokeObjectURL(tempUrl);

        const id = await db.videos.add({
          name: fileName,
          filePath: storedPath,
          thumbnail,
          lastTime: 0,
          duration: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        await refresh();
        setIsLoading(false);
        return id;
      } else if (file) {
        const fileUrl = URL.createObjectURL(file);

        let thumbnail: string | undefined;
        try {
          thumbnail = await generateThumbnail(fileUrl);
        } catch (err) {
          console.error('Failed to generate thumbnail:', err);
        }

        const id = await db.videos.add({
          name: file.name,
          filePath: fileUrl,
          thumbnail,
          lastTime: 0,
          duration: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        await refresh();
        setIsLoading(false);
        return id;
      }
    } catch (error) {
      console.error('Failed to add video:', error);
    }
    setIsLoading(false);
    return null;
  }, [isNative, refresh]);

  const removeVideo = useCallback(async (id: number) => {
    const video = await db.videos.get(id);
    if (video && isNative) {
      try {
        await Filesystem.deleteFile({
          path: video.filePath,
          directory: Directory.Documents,
        });
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
    await db.videos.delete(id);
    await db.bookmarks.where('videoId').equals(id).delete();
    await refresh();
  }, [isNative, refresh]);

  const updateLastTime = useCallback(async (id: number, lastTime: number, duration?: number) => {
    const updates: Partial<Video> = { lastTime, updatedAt: Date.now() };
    if (duration !== undefined) {
      updates.duration = duration;
    }
    await db.videos.update(id, updates);
  }, []);

  return {
    videos,
    isLoading,
    isNative,
    addVideo,
    removeVideo,
    updateLastTime,
    refresh,
  };
}
