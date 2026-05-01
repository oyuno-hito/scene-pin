package com.scenepin.api.feature.video.controller

import com.scenepin.api.feature.video.request.VideoUpdateRequest
import com.scenepin.api.feature.video.response.VideoResponse
import com.scenepin.api.feature.video.response.toResponse
import com.scenepin.domain.video.service.VideoService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/videos")
class VideoController(
    private val videoService: VideoService
) {

    @GetMapping
    fun list(
        @RequestParam(required = false) tags: List<Long>?
    ): List<VideoResponse> {
        val videos = if (tags.isNullOrEmpty()) {
            videoService.getAllVideos()
        } else {
            videoService.getVideosByTags(tags)
        }
        return videos.map { it.toResponse() }
    }

    @GetMapping("/{id}")
    fun get(@PathVariable id: Long): VideoResponse {
        return videoService.getVideo(id)?.toResponse()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Video not found")
    }

    @PatchMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: VideoUpdateRequest
    ): VideoResponse {
        val updated = videoService.updateVideo(id) { video ->
            video.copy(name = request.name)
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Video not found")

        return updated.toResponse()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        videoService.deleteVideo(id)
    }
}
