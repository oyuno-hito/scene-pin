package com.scenepin.domain.bookmark.service

import com.scenepin.domain.bookmark.model.Bookmark
import com.scenepin.domain.bookmark.repository.BookmarkRepository
import org.springframework.stereotype.Service

@Service
class BookmarkService(
    private val bookmarkRepository: BookmarkRepository
) {
    fun getBookmarksByVideoId(videoId: Long): List<Bookmark> =
        bookmarkRepository.findByVideoId(videoId).sortedBy { it.timestamp }

    fun createBookmark(bookmark: Bookmark): Bookmark = bookmarkRepository.save(bookmark)

    fun updateMemo(id: Long, memo: String): Bookmark? {
        val existing = bookmarkRepository.findById(id) ?: return null
        return bookmarkRepository.save(existing.copy(memo = memo))
    }

    fun deleteBookmark(id: Long) = bookmarkRepository.delete(id)
}
