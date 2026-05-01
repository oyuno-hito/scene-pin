package com.scenepin.domain.tag.model

import java.time.LocalDateTime

data class Tag(
    val id: Long? = null,
    val name: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
