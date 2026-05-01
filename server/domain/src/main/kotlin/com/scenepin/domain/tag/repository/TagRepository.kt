package com.scenepin.domain.tag.repository

import com.scenepin.domain.tag.model.Tag

interface TagRepository {
    fun findById(id: Long): Tag?
    fun findByName(name: String): Tag?
    fun findAll(): List<Tag>
    fun findByVideoId(videoId: Long): List<Tag>
    fun save(tag: Tag): Tag
    fun delete(id: Long)
    fun addTagToVideo(videoId: Long, tagId: Long)
    fun removeTagFromVideo(videoId: Long, tagId: Long)
}
