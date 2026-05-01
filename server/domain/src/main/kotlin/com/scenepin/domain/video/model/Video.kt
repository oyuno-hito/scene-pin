package com.scenepin.domain.video.model

import java.time.LocalDateTime

data class Video(
    val id: Long? = null,
    val name: String,
    val filePath: String,
    val thumbnailPath: String,
    val duration: Long,
    val fileSize: Long,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
