import type { VideoResponse } from '../api/generated';
import { formatTime } from '../utils/format';

interface Props {
  video: VideoResponse;
  onClick: () => void;
  onDelete: () => void;
}

export function VideoCard({ video, onClick, onDelete }: Props) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('この動画を削除しますか？')) {
      onDelete();
    }
  };

  const durationInSeconds = video.duration / 1000;

  return (
    <div className="video-card" onClick={onClick}>
      <div className="video-card-thumbnail">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt="" className="video-card-thumb-img" />
        ) : (
          <div className="video-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </div>
        )}
        {durationInSeconds > 0 && (
          <span className="video-card-duration">{formatTime(durationInSeconds)}</span>
        )}
      </div>
      <div className="video-card-info">
        <span className="video-card-name" title={video.name}>
          {video.name}
        </span>
      </div>
      <button className="video-card-delete" onClick={handleDelete} title="削除">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
        </svg>
      </button>
    </div>
  );
}
