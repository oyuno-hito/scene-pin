CREATE TABLE bookmarks (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    timestamp BIGINT NOT NULL,
    memo TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_bookmarks_video_id ON bookmarks(video_id);
CREATE INDEX idx_bookmarks_timestamp ON bookmarks(video_id, timestamp);
