package com.scenepin.api.feature.video.controller

import com.scenepin.api.feature.video.response.VideoResponse
import com.scenepin.api.feature.video.response.toResponse
import com.scenepin.domain.video.model.Video
import com.scenepin.domain.video.service.VideoService
import com.scenepin.infra.storage.StorageProperties
import com.scenepin.infra.storage.VideoStorageService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/videos")
class VideoUploadController(
    private val videoService: VideoService,
    private val videoStorageService: VideoStorageService,
    private val storageProperties: StorageProperties
) {

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    fun upload(@RequestParam("file") file: MultipartFile): VideoResponse {
        val originalName = file.originalFilename ?: "video.mp4"
        val nameWithoutExtension = originalName.substringBeforeLast(".")

        val result = videoStorageService.processAndSave(file.inputStream)

        val now = LocalDateTime.now()
        val video = Video(
            name = nameWithoutExtension,
            filePath = result.videoPath,
            thumbnailPath = result.thumbnailPath,
            duration = result.duration,
            fileSize = result.fileSize,
            createdAt = now,
            updatedAt = now
        )

        return videoService.createVideo(video).toResponse(storageProperties.baseUrl)
    }
}
