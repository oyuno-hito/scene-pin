package com.scenepin.infra.persistence.video

import com.scenepin.domain.video.model.Video
import com.scenepin.domain.video.repository.VideoRepository
import com.scenepin.infra.jooq.tables.Videos.Companion.VIDEOS
import com.scenepin.infra.jooq.tables.VideoTags.Companion.VIDEO_TAGS
import com.scenepin.infra.jooq.tables.records.VideosRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class VideoRepositoryImpl(
    private val dsl: DSLContext
) : VideoRepository {

    override fun findById(id: Long): Video? {
        return dsl.selectFrom(VIDEOS)
            .where(VIDEOS.ID.eq(id))
            .fetchOne()
            ?.toDomain()
    }

    override fun findAll(): List<Video> {
        return dsl.selectFrom(VIDEOS)
            .orderBy(VIDEOS.UPDATED_AT.desc())
            .fetch()
            .map { it.toDomain() }
    }

    override fun findByTagIds(tagIds: List<Long>): List<Video> {
        if (tagIds.isEmpty()) return findAll()

        return dsl.selectDistinct(VIDEOS.asterisk())
            .from(VIDEOS)
            .join(VIDEO_TAGS).on(VIDEOS.ID.eq(VIDEO_TAGS.VIDEO_ID))
            .where(VIDEO_TAGS.TAG_ID.`in`(tagIds))
            .orderBy(VIDEOS.UPDATED_AT.desc())
            .fetchInto(VIDEOS)
            .map { it.toDomain() }
    }

    override fun save(video: Video): Video {
        return if (video.id == null) {
            insert(video)
        } else {
            update(video)
        }
    }

    private fun insert(video: Video): Video {
        val record = dsl.newRecord(VIDEOS).apply {
            name = video.name
            filePath = video.filePath
            thumbnailPath = video.thumbnailPath
            duration = video.duration
            fileSize = video.fileSize
            createdAt = LocalDateTime.now()
            updatedAt = LocalDateTime.now()
        }
        record.store()
        return record.toDomain()
    }

    private fun update(video: Video): Video {
        dsl.update(VIDEOS)
            .set(VIDEOS.NAME, video.name)
            .set(VIDEOS.FILE_PATH, video.filePath)
            .set(VIDEOS.THUMBNAIL_PATH, video.thumbnailPath)
            .set(VIDEOS.DURATION, video.duration)
            .set(VIDEOS.FILE_SIZE, video.fileSize)
            .set(VIDEOS.UPDATED_AT, LocalDateTime.now())
            .where(VIDEOS.ID.eq(video.id))
            .execute()

        return findById(video.id!!)!!
    }

    override fun delete(id: Long) {
        dsl.deleteFrom(VIDEOS)
            .where(VIDEOS.ID.eq(id))
            .execute()
    }

    private fun VideosRecord.toDomain() = Video(
        id = id,
        name = name,
        filePath = filePath,
        thumbnailPath = thumbnailPath,
        duration = duration,
        fileSize = fileSize,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
