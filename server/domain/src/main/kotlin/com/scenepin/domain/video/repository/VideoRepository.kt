package com.scenepin.domain.video.repository

import com.scenepin.domain.video.model.Video

interface VideoRepository {
    fun findById(id: Long): Video?
    fun findAll(): List<Video>
    fun findByTagIds(tagIds: List<Long>): List<Video>
    fun save(video: Video): Video
    fun delete(id: Long)
}
