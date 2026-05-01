package com.scenepin.infra.persistence.tag

import com.scenepin.domain.tag.model.Tag
import com.scenepin.domain.tag.repository.TagRepository
import com.scenepin.infra.jooq.tables.Tags.Companion.TAGS
import com.scenepin.infra.jooq.tables.VideoTags.Companion.VIDEO_TAGS
import com.scenepin.infra.jooq.tables.records.TagsRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class TagRepositoryImpl(
    private val dsl: DSLContext
) : TagRepository {

    override fun findById(id: Long): Tag? {
        return dsl.selectFrom(TAGS)
            .where(TAGS.ID.eq(id))
            .fetchOne()
            ?.toDomain()
    }

    override fun findByName(name: String): Tag? {
        return dsl.selectFrom(TAGS)
            .where(TAGS.NAME.eq(name))
            .fetchOne()
            ?.toDomain()
    }

    override fun findAll(): List<Tag> {
        return dsl.selectFrom(TAGS)
            .orderBy(TAGS.NAME)
            .fetch()
            .map { it.toDomain() }
    }

    override fun findByVideoId(videoId: Long): List<Tag> {
        return dsl.select(TAGS.asterisk())
            .from(TAGS)
            .join(VIDEO_TAGS).on(TAGS.ID.eq(VIDEO_TAGS.TAG_ID))
            .where(VIDEO_TAGS.VIDEO_ID.eq(videoId))
            .fetchInto(TAGS)
            .map { it.toDomain() }
    }

    override fun save(tag: Tag): Tag {
        return if (tag.id == null) {
            insert(tag)
        } else {
            update(tag)
        }
    }

    private fun insert(tag: Tag): Tag {
        val record = dsl.newRecord(TAGS).apply {
            name = tag.name
            createdAt = LocalDateTime.now()
        }
        record.store()
        return record.toDomain()
    }

    private fun update(tag: Tag): Tag {
        dsl.update(TAGS)
            .set(TAGS.NAME, tag.name)
            .where(TAGS.ID.eq(tag.id))
            .execute()

        return findById(tag.id!!)!!
    }

    override fun delete(id: Long) {
        dsl.deleteFrom(TAGS)
            .where(TAGS.ID.eq(id))
            .execute()
    }

    override fun addTagToVideo(videoId: Long, tagId: Long) {
        dsl.insertInto(VIDEO_TAGS)
            .set(VIDEO_TAGS.VIDEO_ID, videoId)
            .set(VIDEO_TAGS.TAG_ID, tagId)
            .onConflictDoNothing()
            .execute()
    }

    override fun removeTagFromVideo(videoId: Long, tagId: Long) {
        dsl.deleteFrom(VIDEO_TAGS)
            .where(VIDEO_TAGS.VIDEO_ID.eq(videoId))
            .and(VIDEO_TAGS.TAG_ID.eq(tagId))
            .execute()
    }

    private fun TagsRecord.toDomain() = Tag(
        id = id,
        name = name,
        createdAt = createdAt
    )
}
