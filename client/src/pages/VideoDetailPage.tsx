import { useEffect, useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { BookmarkList } from '../components/BookmarkList';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { useBookmarks } from '../hooks/useBookmarks';
import { db, type Video } from '../db';

interface Props {
  videoId: number;
  onBack: () => void;
}

export function VideoDetailPage({ videoId, onBack }: Props) {
  const [video, setVideo] = useState<Video | null>(null);
  const player = useVideoPlayer(videoId);
  const { bookmarks, addBookmark, updateMemo, removeBookmark } = useBookmarks(videoId);

  useEffect(() => {
    db.videos.get(videoId).then(v => setVideo(v ?? null));
  }, [videoId]);

  const handleAddBookmark = () => {
    addBookmark(player.currentTime);
  };

  return (
    <div className="video-detail-page">
      <header className="app-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1>ScenePin</h1>
        {video && <span className="video-title">{video.name}</span>}
      </header>

      <main className="app-main">
        <VideoPlayer
          videoRef={player.videoRef}
          videoSrc={player.videoSrc}
          isPlaying={player.isPlaying}
          isLoading={player.isLoading}
          currentTime={player.currentTime}
          duration={player.duration}
          videoSize={player.videoSize}
          playbackRate={player.playbackRate}
          volume={player.volume}
          loop={player.loop}
          onTogglePlay={player.togglePlay}
          onSeek={player.seek}
          onChangeRate={player.changeRate}
          onChangeVolume={player.changeVolume}
          onSetLoopA={player.setLoopA}
          onSetLoopB={player.setLoopB}
          onClearLoop={player.clearLoop}
          onAddBookmark={handleAddBookmark}
        />

        <section className="bookmarks-section">
          <h2>ブックマーク</h2>
          <BookmarkList
            bookmarks={bookmarks}
            onSeek={player.seek}
            onUpdateMemo={updateMemo}
            onRemove={removeBookmark}
          />
        </section>
      </main>
    </div>
  );
}
