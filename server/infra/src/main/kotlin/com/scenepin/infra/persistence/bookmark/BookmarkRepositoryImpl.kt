package com.scenepin.infra.persistence.bookmark

import com.scenepin.domain.bookmark.model.Bookmark
import com.scenepin.domain.bookmark.repository.BookmarkRepository
import com.scenepin.infra.jooq.tables.Bookmarks.Companion.BOOKMARKS
import com.scenepin.infra.jooq.tables.records.BookmarksRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class BookmarkRepositoryImpl(
    private val dsl: DSLContext
) : BookmarkRepository {

    override fun findById(id: Long): Bookmark? {
        return dsl.selectFrom(BOOKMARKS)
            .where(BOOKMARKS.ID.eq(id))
            .fetchOne()
            ?.toDomain()
    }

    override fun findByVideoId(videoId: Long): List<Bookmark> {
        return dsl.selectFrom(BOOKMARKS)
            .where(BOOKMARKS.VIDEO_ID.eq(videoId))
            .orderBy(BOOKMARKS.TIMESTAMP)
            .fetch()
            .map { it.toDomain() }
    }

    override fun save(bookmark: Bookmark): Bookmark {
        return if (bookmark.id == null) {
            insert(bookmark)
        } else {
            update(bookmark)
        }
    }

    private fun insert(bookmark: Bookmark): Bookmark {
        val record = dsl.newRecord(BOOKMARKS).apply {
            videoId = bookmark.videoId
            timestamp = bookmark.timestamp
            memo = bookmark.memo
            createdAt = LocalDateTime.now()
        }
        record.store()
        return record.toDomain()
    }

    private fun update(bookmark: Bookmark): Bookmark {
        dsl.update(BOOKMARKS)
            .set(BOOKMARKS.TIMESTAMP, bookmark.timestamp)
            .set(BOOKMARKS.MEMO, bookmark.memo)
            .where(BOOKMARKS.ID.eq(bookmark.id))
            .execute()

        return findById(bookmark.id!!)!!
    }

    override fun delete(id: Long) {
        dsl.deleteFrom(BOOKMARKS)
            .where(BOOKMARKS.ID.eq(id))
            .execute()
    }

    override fun deleteByVideoId(videoId: Long) {
        dsl.deleteFrom(BOOKMARKS)
            .where(BOOKMARKS.VIDEO_ID.eq(videoId))
            .execute()
    }

    private fun BookmarksRecord.toDomain() = Bookmark(
        id = id,
        videoId = videoId,
        timestamp = timestamp,
        memo = memo,
        createdAt = createdAt
    )
}
