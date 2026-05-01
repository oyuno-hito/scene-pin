import { VideoCard } from '../components/VideoCard';
import { useVideoList } from '../hooks/useVideoList';

interface Props {
  onSelectVideo: (id: number) => void;
}

export function VideoListPage({ onSelectVideo }: Props) {
  const { videos, isLoading, isNative, addVideo, removeVideo } = useVideoList();

  const handleAddVideo = async (file?: File) => {
    const id = await addVideo(file);
    if (id) {
      onSelectVideo(id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAddVideo(file);
    }
  };

  return (
    <div className="video-list-page">
      <header className="app-header">
        <h1>ScenePin</h1>
      </header>

      <main className="video-list-main">
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onSelectVideo(video.id!)}
              onDelete={() => removeVideo(video.id!)}
            />
          ))}

          {isNative ? (
            <button
              className="video-card video-card-add"
              onClick={() => handleAddVideo()}
              disabled={isLoading}
            >
              <div className="video-card-thumbnail">
                <div className="video-card-icon">
                  {isLoading ? (
                    <div className="loading-spinner" />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="video-card-info">
                <span className="video-card-name">動画を追加</span>
              </div>
            </button>
          ) : (
            <label className="video-card video-card-add">
              <div className="video-card-thumbnail">
                <div className="video-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>
              <div className="video-card-info">
                <span className="video-card-name">動画を追加</span>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
          )}
        </div>

        {videos.length === 0 && !isLoading && (
          <p className="video-list-empty">
            動画を追加してブックマークを始めましょう
          </p>
        )}
      </main>
    </div>
  );
}
