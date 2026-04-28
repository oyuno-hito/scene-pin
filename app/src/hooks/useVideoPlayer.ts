import { useRef, useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { db } from '../db';

export interface LoopRange {
  a: number;
  b: number;
}

const LAST_VIDEO_ID = 1;

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrcRef = useRef<string | null>(null);
  const initialLoadDone = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [videoSize, setVideoSize] = useState<number>(0);
  const [loop, setLoop] = useState<LoopRange | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNative] = useState(() => Capacitor.isNativePlatform());

  const saveLastVideo = useCallback(async (name: string, path: string, time: number) => {
    await db.lastVideo.put({
      id: LAST_VIDEO_ID,
      videoName: name,
      filePath: path,
      lastTime: time,
      updatedAt: Date.now(),
    });
  }, []);

  const loadVideoFromPath = useCallback(async (filePath: string, name: string, startTime?: number) => {
    setIsLoading(true);
    try {
      if (isNative) {
        const result = await Filesystem.readFile({
          path: filePath,
          directory: Directory.Documents,
        });
        const blob = new Blob([Uint8Array.from(atob(result.data as string), c => c.charCodeAt(0))], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        if (videoSrcRef.current) URL.revokeObjectURL(videoSrcRef.current);
        videoSrcRef.current = url;
        setVideoSrc(url);
        setVideoName(name);
        setVideoSize(blob.size);
        setLoop(null);
        setCurrentTime(startTime ?? 0);
        setDuration(0);
      }
    } catch (error) {
      console.error('Failed to load video from path:', error);
      setIsLoading(false);
    }
  }, [isNative]);

  const pickVideoNative = useCallback(async () => {
    try {
      const result = await FilePicker.pickVideos({ limit: 1 });
      if (result.files.length === 0) return;

      const file = result.files[0];
      setIsLoading(true);

      const fileName = file.name || `video_${Date.now()}.mp4`;
      const storedPath = `videos/${fileName}`;

      if (file.data) {
        await Filesystem.writeFile({
          path: storedPath,
          data: file.data,
          directory: Directory.Documents,
          recursive: true,
        });
      } else if (file.path) {
        const readResult = await Filesystem.readFile({ path: file.path });
        await Filesystem.writeFile({
          path: storedPath,
          data: readResult.data,
          directory: Directory.Documents,
          recursive: true,
        });
      }

      await saveLastVideo(fileName, storedPath, 0);
      
      const readResult = await Filesystem.readFile({
        path: storedPath,
        directory: Directory.Documents,
      });
      const blob = new Blob([Uint8Array.from(atob(readResult.data as string), c => c.charCodeAt(0))], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      if (videoSrcRef.current) URL.revokeObjectURL(videoSrcRef.current);
      videoSrcRef.current = url;
      setVideoSrc(url);
      setVideoName(fileName);
      setVideoSize(blob.size);
      setLoop(null);
      setCurrentTime(0);
      setDuration(0);
    } catch (error) {
      console.error('Failed to pick video:', error);
      setIsLoading(false);
    }
  }, [saveLastVideo]);

  const loadVideo = useCallback((file: File) => {
    if (videoSrcRef.current) URL.revokeObjectURL(videoSrcRef.current);
    const url = URL.createObjectURL(file);
    videoSrcRef.current = url;
    setVideoSrc(url);
    setVideoName(file.name);
    setVideoSize(file.size);
    setLoop(null);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  }, []);

  const changeRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const changeVolume = useCallback((v: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = v;
    setVolume(v);
  }, []);

  const setLoopA = useCallback(() => {
    setLoop(prev =>
      prev ? { ...prev, a: currentTime } : { a: currentTime, b: duration }
    );
  }, [currentTime, duration]);

  const setLoopB = useCallback(() => {
    setLoop(prev =>
      prev ? { ...prev, b: currentTime } : { a: 0, b: currentTime }
    );
  }, [currentTime]);

  const clearLoop = useCallback(() => {
    setLoop(null);
  }, []);

  useEffect(() => {
    if (isNative && !initialLoadDone.current) {
      initialLoadDone.current = true;
      (async () => {
        try {
          const last = await db.lastVideo.get(LAST_VIDEO_ID);
          if (last) {
            await loadVideoFromPath(last.filePath, last.videoName, last.lastTime);
          }
        } catch (error) {
          console.error('Failed to load last video:', error);
        }
      })();
    }
  }, [isNative, loadVideoFromPath]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (loop && v.currentTime >= loop.b) {
        v.currentTime = loop.a;
      }
    };
    const onLoadedMetadata = () => {
      setDuration(v.duration);
      setIsLoading(false);
      if (currentTime > 0 && v.currentTime === 0) {
        v.currentTime = currentTime;
      }
    };
    const onCanPlay = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      if (isNative && videoName) {
        saveLastVideo(videoName, `videos/${videoName}`, v.currentTime);
      }
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [loop, videoSrc, isNative, videoName, saveLastVideo, currentTime]);

  return {
    videoRef,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    playbackRate,
    volume,
    videoSrc,
    videoName,
    videoSize,
    loop,
    isNative,
    loadVideo,
    pickVideoNative,
    togglePlay,
    seek,
    changeRate,
    changeVolume,
    setLoopA,
    setLoopB,
    clearLoop,
  };
}
