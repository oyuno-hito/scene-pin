package com.scenepin.api.feature.bookmark.response

import com.scenepin.domain.bookmark.model.Bookmark
import java.time.LocalDateTime

data class BookmarkResponse(
    val id: Long,
    val videoId: Long,
    val timestamp: Long,
    val memo: String,
    val createdAt: LocalDateTime
)

fun Bookmark.toResponse() = BookmarkResponse(
    id = id!!,
    videoId = videoId,
    timestamp = timestamp,
    memo = memo,
    createdAt = createdAt
)
