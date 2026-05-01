package com.scenepin.api.feature.tag.request

import jakarta.validation.constraints.NotBlank

data class TagCreateRequest(
    @field:NotBlank
    val name: String
)
