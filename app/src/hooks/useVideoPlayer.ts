import { useRef, useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { db } from '../db';

export interface LoopRange {
  a: number;
  b: number;
}

export function useVideoPlayer(videoId: number) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrcRef = useRef<string | null>(null);
  const initialLoadDone = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoSize, setVideoSize] = useState<number>(0);
  const [loop, setLoop] = useState<LoopRange | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNative] = useState(() => Capacitor.isNativePlatform());

  const saveProgress = useCallback(async (time: number, dur?: number) => {
    const updates: { lastTime: number; updatedAt: number; duration?: number } = {
      lastTime: time,
      updatedAt: Date.now(),
    };
    if (dur !== undefined && dur > 0) {
      updates.duration = dur;
    }
    await db.videos.update(videoId, updates);
  }, [videoId]);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    (async () => {
      try {
        const video = await db.videos.get(videoId);
        if (!video) {
          setIsLoading(false);
          return;
        }

        if (isNative) {
          const result = await Filesystem.readFile({
            path: video.filePath,
            directory: Directory.Documents,
          });
          const blob = new Blob(
            [Uint8Array.from(atob(result.data as string), c => c.charCodeAt(0))],
            { type: 'video/mp4' }
          );
          const url = URL.createObjectURL(blob);
          if (videoSrcRef.current) URL.revokeObjectURL(videoSrcRef.current);
          videoSrcRef.current = url;
          setVideoSrc(url);
          setVideoSize(blob.size);
          setCurrentTime(video.lastTime);
          setDuration(video.duration || 0);
        } else {
          setVideoSrc(video.filePath);
          setCurrentTime(video.lastTime);
          setDuration(video.duration || 0);
        }
      } catch (error) {
        console.error('Failed to load video:', error);
        setIsLoading(false);
      }
    })();
  }, [videoId, isNative]);

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
    const v = videoRef.current;
    if (!v || !videoSrc) return;

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
      saveProgress(currentTime, v.duration);
    };
    const onCanPlay = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      saveProgress(v.currentTime, v.duration);
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);

    if (v.readyState >= 1) {
      setIsLoading(false);
      if (v.duration) {
        setDuration(v.duration);
      }
    }

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [loop, videoSrc, saveProgress, currentTime]);

  useEffect(() => {
    return () => {
      if (videoSrcRef.current) {
        URL.revokeObjectURL(videoSrcRef.current);
      }
    };
  }, []);

  return {
    videoRef,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    playbackRate,
    volume,
    videoSrc,
    videoSize,
    loop,
    togglePlay,
    seek,
    changeRate,
    changeVolume,
    setLoopA,
    setLoopB,
    clearLoop,
  };
}
