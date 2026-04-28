import { VideoPlayer } from './components/VideoPlayer';
import { BookmarkList } from './components/BookmarkList';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useBookmarks } from './hooks/useBookmarks';

export default function App() {
  const player = useVideoPlayer();
  const { bookmarks, addBookmark, updateMemo, removeBookmark } =
    useBookmarks(player.videoName);

  const handleAddBookmark = () => {
    addBookmark(player.currentTime);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ScenePin</h1>
        {player.videoName && (
          <span className="video-title">{player.videoName}</span>
        )}
      </header>

      <main className="app-main">
        <VideoPlayer
          videoRef={player.videoRef}
          videoSrc={player.videoSrc}
          isPlaying={player.isPlaying}
          isLoading={player.isLoading}
          currentTime={player.currentTime}
          duration={player.duration}
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
          onLoadVideo={player.loadVideo}
        />

        {player.videoSrc && (
          <section className="bookmarks-section">
            <h2>ブックマーク</h2>
            <BookmarkList
              bookmarks={bookmarks}
              onSeek={player.seek}
              onUpdateMemo={updateMemo}
              onRemove={removeBookmark}
            />
          </section>
        )}
      </main>
    </div>
  );
}
