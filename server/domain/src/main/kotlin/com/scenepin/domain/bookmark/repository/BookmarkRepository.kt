package com.scenepin.domain.bookmark.repository

import com.scenepin.domain.bookmark.model.Bookmark

interface BookmarkRepository {
    fun findById(id: Long): Bookmark?
    fun findByVideoId(videoId: Long): List<Bookmark>
    fun save(bookmark: Bookmark): Bookmark
    fun delete(id: Long)
    fun deleteByVideoId(videoId: Long)
}
