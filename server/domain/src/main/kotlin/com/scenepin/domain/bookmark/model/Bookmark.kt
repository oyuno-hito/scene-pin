package com.scenepin.domain.bookmark.model

import java.time.LocalDateTime

data class Bookmark(
    val id: Long? = null,
    val videoId: Long,
    val timestamp: Long,
    val memo: String = "",
    val createdAt: LocalDateTime = LocalDateTime.now()
)
