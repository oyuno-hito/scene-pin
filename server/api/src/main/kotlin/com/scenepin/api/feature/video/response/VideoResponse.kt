package com.scenepin.api.feature.video.response

import com.scenepin.domain.video.model.Video
import java.time.LocalDateTime

data class VideoResponse(
    val id: Long,
    val name: String,
    val thumbnailUrl: String,
    val duration: Long,
    val fileSize: Long,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

fun Video.toResponse(storageBaseUrl: String) = VideoResponse(
    id = id!!,
    name = name,
    thumbnailUrl = "$storageBaseUrl/thumbnails/$thumbnailPath",
    duration = duration,
    fileSize = fileSize,
    createdAt = createdAt,
    updatedAt = updatedAt
)
