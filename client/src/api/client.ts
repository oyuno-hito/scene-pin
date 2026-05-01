import {
  Configuration,
  VideoControllerApi,
  VideoUploadControllerApi,
  BookmarkControllerApi,
  TagControllerApi,
} from './generated';
import type { VideoResponse } from './generated';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const configuration = new Configuration({
  basePath: API_BASE_URL,
});

export const videoApi = new VideoControllerApi(configuration);
export const videoUploadApi = new VideoUploadControllerApi(configuration);
export const bookmarkApi = new BookmarkControllerApi(configuration);
export const tagApi = new TagControllerApi(configuration);

export async function uploadVideo(file: File): Promise<VideoResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/videos/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  return response.json();
}

export function getVideoFileUrl(videoId: number): string {
  return `${API_BASE_URL}/api/videos/${videoId}/file`;
}

export { API_BASE_URL };
