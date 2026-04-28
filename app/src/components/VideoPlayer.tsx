import type { RefObject } from 'react';
import type { LoopRange } from '../hooks/useVideoPlayer';
import { formatTime } from '../utils/format';

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  videoSrc: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  videoSize: number;
  playbackRate: number;
  volume: number;
  loop: LoopRange | null;
  isNative: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onChangeRate: (rate: number) => void;
  onChangeVolume: (v: number) => void;
  onSetLoopA: () => void;
  onSetLoopB: () => void;
  onClearLoop: () => void;
  onAddBookmark: () => void;
  onLoadVideo: (file: File) => void;
  onPickVideoNative: () => void;
}

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024; // 100MB

export function VideoPlayer({
  videoRef,
  videoSrc,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  videoSize,
  playbackRate,
  volume,
  loop,
  isNative,
  onTogglePlay,
  onSeek,
  onChangeRate,
  onChangeVolume,
  onSetLoopA,
  onSetLoopB,
  onClearLoop,
  onAddBookmark,
  onLoadVideo,
  onPickVideoNative,
}: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLoadVideo(file);
  };

  const handlePickVideo = () => {
    if (isNative) {
      onPickVideoNative();
    }
  };

  const seekBarPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLargeFile = videoSize > LARGE_FILE_THRESHOLD;
  const fileSizeMB = Math.round(videoSize / 1024 / 1024);

  return (
    <div className="player">
      {!videoSrc ? (
        <div className="file-picker">
          {isNative ? (
            <button className="file-picker-btn" onClick={handlePickVideo}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span>動画ファイルを選択</span>
            </button>
          ) : (
            <label className="file-picker-label">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span>動画ファイルを選択</span>
              <span className="file-picker-hint">大きいファイルは読み込みに時間がかかります</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
          )}
        </div>
      ) : (
        <>
          <div className="video-wrapper">
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              preload="metadata"
              onClick={onTogglePlay}
            />
            {isLoading && (
              <div className="video-loading">
                <div className="loading-spinner" />
              </div>
            )}
          </div>

          {isLargeFile && (
            <div className="large-file-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>
                ファイルサイズが大きいです（{fileSizeMB}MB）。
                読み込みが遅い場合は、動画を圧縮してからお使いください。
              </span>
            </div>
          )}

          <div className="controls">
            <div className="seek-row">
              <span className="time-label">{formatTime(currentTime)}</span>
              <div className="seek-bar-container">
                {loop && duration > 0 && (
                  <div
                    className="loop-range-indicator"
                    style={{
                      left: `${(loop.a / duration) * 100}%`,
                      width: `${((loop.b - loop.a) / duration) * 100}%`,
                    }}
                  />
                )}
                <input
                  type="range"
                  className="seek-bar"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={e => onSeek(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, var(--accent) ${seekBarPercent}%, var(--track) ${seekBarPercent}%)`,
                  }}
                />
              </div>
              <span className="time-label">{formatTime(duration)}</span>
            </div>

            <div className="control-row">
              <button className="ctrl-btn play-btn" onClick={onTogglePlay}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
                )}
              </button>

              <button className="ctrl-btn pin-btn" onClick={onAddBookmark} title="ブックマーク追加">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </button>

              <div className="volume-control">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
                  {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
                </svg>
                <input
                  type="range"
                  className="volume-bar"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={e => onChangeVolume(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="rate-row">
              {RATES.map(r => (
                <button
                  key={r}
                  className={`rate-btn ${r === playbackRate ? 'active' : ''}`}
                  onClick={() => onChangeRate(r)}
                >
                  {r}x
                </button>
              ))}
            </div>

            <div className="loop-row">
              <button className="ctrl-btn loop-btn" onClick={onSetLoopA}>
                A{loop ? ` (${formatTime(loop.a)})` : ''}
              </button>
              <button className="ctrl-btn loop-btn" onClick={onSetLoopB}>
                B{loop ? ` (${formatTime(loop.b)})` : ''}
              </button>
              {loop && (
                <button className="ctrl-btn loop-clear-btn" onClick={onClearLoop}>
                  ループ解除
                </button>
              )}
            </div>
          </div>

          {isNative ? (
            <button className="change-file-btn" onClick={handlePickVideo}>
              別の動画を開く
            </button>
          ) : (
            <label className="change-file-label">
              別の動画を開く
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
          )}
        </>
      )}
    </div>
  );
}
