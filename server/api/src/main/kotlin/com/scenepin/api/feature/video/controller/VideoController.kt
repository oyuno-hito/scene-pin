package com.scenepin.api.feature.video.controller

import com.scenepin.api.feature.video.request.VideoUpdateRequest
import com.scenepin.api.feature.video.response.VideoResponse
import com.scenepin.api.feature.video.response.toResponse
import com.scenepin.domain.video.service.VideoService
import com.scenepin.infra.storage.StorageProperties
import com.scenepin.infra.storage.VideoStorageService
import jakarta.validation.Valid
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/videos")
class VideoController(
    private val videoService: VideoService,
    private val videoStorageService: VideoStorageService,
    private val storageProperties: StorageProperties
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
        return videos.map { it.toResponse(storageProperties.baseUrl) }
    }

    @GetMapping("/{id}")
    fun get(@PathVariable id: Long): VideoResponse {
        return videoService.getVideo(id)?.toResponse(storageProperties.baseUrl)
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

        return updated.toResponse(storageProperties.baseUrl)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        val video = videoService.getVideo(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Video not found")

        videoStorageService.deleteVideo(video.filePath, video.thumbnailPath)
        videoService.deleteVideo(id)
    }

    @GetMapping("/{id}/file")
    fun getFile(@PathVariable id: Long): ResponseEntity<Resource> {
        val video = videoService.getVideo(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Video not found")

        val path = videoStorageService.getVideoPath(video.filePath)
        if (!path.toFile().exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Video file not found")
        }

        val resource = FileSystemResource(path)
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${video.name}.mp4\"")
            .contentType(MediaType.parseMediaType("video/mp4"))
            .body(resource)
    }
}
