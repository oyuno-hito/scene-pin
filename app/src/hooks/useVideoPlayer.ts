import { useRef, useState, useCallback, useEffect } from 'react';

export interface LoopRange {
  a: number;
  b: number;
}

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [loop, setLoop] = useState<LoopRange | null>(null);

  const video = videoRef.current;

  const loadVideo = useCallback((file: File) => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoName(file.name);
    setLoop(null);
  }, [videoSrc]);

  const togglePlay = useCallback(() => {
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, [video]);

  const seek = useCallback((time: number) => {
    if (!video) return;
    video.currentTime = time;
  }, [video]);

  const changeRate = useCallback((rate: number) => {
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, [video]);

  const changeVolume = useCallback((v: number) => {
    if (!video) return;
    video.volume = v;
    setVolume(v);
  }, [video]);

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
    if (!v) return;

    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (loop && v.currentTime >= loop.b) {
        v.currentTime = loop.a;
      }
    };
    const onLoadedMetadata = () => setDuration(v.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [loop]);

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    videoSrc,
    videoName,
    loop,
    loadVideo,
    togglePlay,
    seek,
    changeRate,
    changeVolume,
    setLoopA,
    setLoopB,
    clearLoop,
  };
}
