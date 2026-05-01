package com.scenepin.domain.tag.service

import com.scenepin.domain.tag.model.Tag
import com.scenepin.domain.tag.repository.TagRepository
import org.springframework.stereotype.Service

@Service
class TagService(
    private val tagRepository: TagRepository
) {
    fun getAllTags(): List<Tag> = tagRepository.findAll()

    fun getTagsByVideoId(videoId: Long): List<Tag> = tagRepository.findByVideoId(videoId)

    fun createTag(name: String): Tag {
        tagRepository.findByName(name)?.let { return it }
        return tagRepository.save(Tag(name = name))
    }

    fun addTagToVideo(videoId: Long, tagName: String) {
        val tag = createTag(tagName)
        tagRepository.addTagToVideo(videoId, tag.id!!)
    }

    fun removeTagFromVideo(videoId: Long, tagId: Long) =
        tagRepository.removeTagFromVideo(videoId, tagId)

    fun deleteTag(id: Long) = tagRepository.delete(id)
}
