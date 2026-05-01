CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
    thumbnail_path VARCHAR(1024) NOT NULL,
    duration BIGINT NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_videos_updated_at ON videos(updated_at DESC);
