package com.scenepin.infra.storage

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "storage")
data class StorageProperties(
    val baseUrl: String = "http://localhost:8080",
    val videoPath: String = "./data/videos",
    val thumbnailPath: String = "./data/thumbnails"
)

@ConfigurationProperties(prefix = "video.compression")
data class CompressionProperties(
    val enabled: Boolean = true,
    val maxWidth: Int = 1280,
    val crf: Int = 28,
    val codec: String = "libx264"
)

@ConfigurationProperties(prefix = "video.thumbnail")
data class ThumbnailProperties(
    val width: Int = 320,
    val height: Int = 180
)
