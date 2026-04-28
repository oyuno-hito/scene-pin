import { useState } from 'react';
import { VideoListPage } from './pages/VideoListPage';
import { VideoDetailPage } from './pages/VideoDetailPage';

export default function App() {
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);

  return (
    <div className="app">
      {currentVideoId === null ? (
        <VideoListPage onSelectVideo={setCurrentVideoId} />
      ) : (
        <VideoDetailPage
          videoId={currentVideoId}
          onBack={() => setCurrentVideoId(null)}
        />
      )}
    </div>
  );
}
