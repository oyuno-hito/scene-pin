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
  const [videoSize, setVideoSize] = useState<number>(0);
  const [loop, setLoop] = useState<LoopRange | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadVideo = useCallback((file: File) => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoName(file.name);
    setVideoSize(file.size);
    setLoop(null);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
  }, [videoSrc]);

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
    if (!v) return;

    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (loop && v.currentTime >= loop.b) {
        v.currentTime = loop.a;
      }
    };
    const onLoadedMetadata = () => setDuration(v.duration);
    const onCanPlay = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

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
  }, [loop, videoSrc]);

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
