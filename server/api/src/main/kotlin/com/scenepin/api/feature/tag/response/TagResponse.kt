package com.scenepin.api.feature.tag.response

import com.scenepin.domain.tag.model.Tag
import java.time.LocalDateTime

data class TagResponse(
    val id: Long,
    val name: String,
    val createdAt: LocalDateTime
)

fun Tag.toResponse() = TagResponse(
    id = id!!,
    name = name,
    createdAt = createdAt
)
