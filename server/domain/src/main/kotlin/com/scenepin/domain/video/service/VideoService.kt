package com.scenepin.domain.video.service

import com.scenepin.domain.video.model.Video
import com.scenepin.domain.video.repository.VideoRepository
import org.springframework.stereotype.Service

@Service
class VideoService(
    private val videoRepository: VideoRepository
) {
    fun getVideo(id: Long): Video? = videoRepository.findById(id)

    fun getAllVideos(): List<Video> = videoRepository.findAll()

    fun getVideosByTags(tagIds: List<Long>): List<Video> = videoRepository.findByTagIds(tagIds)

    fun createVideo(video: Video): Video = videoRepository.save(video)

    fun updateVideo(id: Long, update: (Video) -> Video): Video? {
        val existing = videoRepository.findById(id) ?: return null
        return videoRepository.save(update(existing))
    }

    fun deleteVideo(id: Long) = videoRepository.delete(id)
}
