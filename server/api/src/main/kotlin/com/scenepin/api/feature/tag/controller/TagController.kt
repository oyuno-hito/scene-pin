package com.scenepin.api.feature.tag.controller

import com.scenepin.api.feature.tag.request.TagCreateRequest
import com.scenepin.api.feature.tag.response.TagResponse
import com.scenepin.api.feature.tag.response.toResponse
import com.scenepin.domain.tag.service.TagService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
class TagController(
    private val tagService: TagService
) {

    @GetMapping("/api/tags")
    fun list(): List<TagResponse> {
        return tagService.getAllTags().map { it.toResponse() }
    }

    @GetMapping("/api/videos/{videoId}/tags")
    fun listByVideo(@PathVariable videoId: Long): List<TagResponse> {
        return tagService.getTagsByVideoId(videoId).map { it.toResponse() }
    }

    @PostMapping("/api/videos/{videoId}/tags")
    @ResponseStatus(HttpStatus.CREATED)
    fun addTagToVideo(
        @PathVariable videoId: Long,
        @Valid @RequestBody request: TagCreateRequest
    ): TagResponse {
        tagService.addTagToVideo(videoId, request.name)
        return tagService.getTagsByVideoId(videoId)
            .first { it.name == request.name }
            .toResponse()
    }

    @DeleteMapping("/api/videos/{videoId}/tags/{tagId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeTagFromVideo(
        @PathVariable videoId: Long,
        @PathVariable tagId: Long
    ) {
        tagService.removeTagFromVideo(videoId, tagId)
    }
}
