package com.scenepin.api.feature.video.request

import jakarta.validation.constraints.NotBlank

data class VideoUpdateRequest(
    @field:NotBlank
    val name: String
)
