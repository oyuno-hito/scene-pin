package com.scenepin.api.feature.bookmark.controller

import com.scenepin.api.feature.bookmark.request.BookmarkCreateRequest
import com.scenepin.api.feature.bookmark.request.BookmarkUpdateRequest
import com.scenepin.api.feature.bookmark.response.BookmarkResponse
import com.scenepin.api.feature.bookmark.response.toResponse
import com.scenepin.domain.bookmark.model.Bookmark
import com.scenepin.domain.bookmark.service.BookmarkService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@RestController
class BookmarkController(
    private val bookmarkService: BookmarkService
) {

    @GetMapping("/api/videos/{videoId}/bookmarks")
    fun listByVideo(@PathVariable videoId: Long): List<BookmarkResponse> {
        return bookmarkService.getBookmarksByVideoId(videoId)
            .map { it.toResponse() }
    }

    @PostMapping("/api/videos/{videoId}/bookmarks")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable videoId: Long,
        @Valid @RequestBody request: BookmarkCreateRequest
    ): BookmarkResponse {
        val bookmark = Bookmark(
            videoId = videoId,
            timestamp = request.timestamp,
            memo = request.memo,
            createdAt = LocalDateTime.now()
        )
        return bookmarkService.createBookmark(bookmark).toResponse()
    }

    @PatchMapping("/api/videos/{videoId}/bookmarks/{id}")
    fun update(
        @PathVariable videoId: Long,
        @PathVariable id: Long,
        @Valid @RequestBody request: BookmarkUpdateRequest
    ): BookmarkResponse {
        return bookmarkService.updateMemo(id, request.memo)?.toResponse()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found")
    }

    @DeleteMapping("/api/videos/{videoId}/bookmarks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable videoId: Long,
        @PathVariable id: Long
    ) {
        bookmarkService.deleteBookmark(id)
    }
}
