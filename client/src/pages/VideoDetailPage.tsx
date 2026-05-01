import { useEffect, useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { BookmarkList } from '../components/BookmarkList';
import { TagEditor } from '../components/TagEditor';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTags } from '../hooks/useTags';
import { videoApi } from '../api/client';
import type { VideoResponse } from '../api/generated';

interface Props {
  videoId: number;
  onBack: () => void;
}

export function VideoDetailPage({ videoId, onBack }: Props) {
  const [video, setVideo] = useState<VideoResponse | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const player = useVideoPlayer(videoId);
  const { bookmarks, addBookmark, updateMemo, removeBookmark } = useBookmarks(videoId);
  const { tags, allTags, addTag, removeTag } = useTags(videoId);

  useEffect(() => {
    videoApi.get({ id: videoId }).then(v => {
      setVideo(v);
      setEditName(v.name);
    }).catch(() => setVideo(null));
  }, [videoId]);

  const handleAddBookmark = () => {
    addBookmark(player.currentTime * 1000);
  };

  const handleStartEditName = () => {
    if (video) {
      setEditName(video.name);
      setIsEditingName(true);
    }
  };

  const handleSaveName = async () => {
    if (!video || !editName.trim()) return;
    try {
      const updated = await videoApi.update1({
        id: videoId,
        videoUpdateRequest: { name: editName.trim() },
      });
      setVideo(updated);
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update video name:', error);
    }
  };

  const handleCancelEdit = () => {
    if (video) {
      setEditName(video.name);
    }
    setIsEditingName(false);
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
        {video && !isEditingName && (
          <span className="video-title" onClick={handleStartEditName} title="クリックで編集">
            {video.name}
          </span>
        )}
        {isEditingName && (
          <div className="video-title-edit">
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              autoFocus
            />
            <button onClick={handleSaveName}>保存</button>
            <button onClick={handleCancelEdit}>キャンセル</button>
          </div>
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

        <section className="tags-section">
          <h2>タグ</h2>
          <TagEditor
            tags={tags}
            allTags={allTags}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        </section>

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
