package com.scenepin.api.feature.bookmark.request

import jakarta.validation.constraints.Min

data class BookmarkCreateRequest(
    @field:Min(0)
    val timestamp: Long,
    val memo: String = ""
)
