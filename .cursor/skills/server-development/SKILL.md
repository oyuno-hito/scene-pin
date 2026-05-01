---
name: server-development
description: >-
  ScenePinサーバー（Kotlin/Spring Boot）の開発ガイド。マルチモジュール構成、
  feature追加、API実装、マイグレーション作成時に使用。サーバー、API、
  バックエンド、Kotlin、Spring Boot関連の作業で適用。
---

# ScenePin Server Development

## プロジェクト構成

```
server/
├── api/        # HTTP層（Controller, DTO）
├── domain/     # ビジネスロジック（Service, UseCase, Repository IF）
├── infra/      # 外部連携実装（RepositoryImpl, Storage）
└── migration/  # Flywayマイグレーション
```

### 依存関係

```
api → domain, infra, migration
infra → domain
domain → (なし)
```

## 技術スタック

- Kotlin + Spring Boot
- PostgreSQL + Flyway
- JOOQ (ORM/クエリビルダー)
- Gradle (Kotlin DSL)

---

## Feature追加の手順

新しいfeatureを追加する際は以下の順序で実装:

### 1. マイグレーション作成

```sql
-- migration/src/main/resources/db/migration/V{n}__create_{feature}_table.sql
CREATE TABLE {features} (
    id BIGSERIAL PRIMARY KEY,
    -- columns
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. domain層

```
domain/src/main/kotlin/com/scenepin/domain/feature/{feature}/
├── model/
│   └── {Feature}.kt
├── service/
│   └── {Feature}Service.kt
├── usecase/              # 複雑なロジックがある場合のみ
│   └── {Action}{Feature}UseCase.kt
└── repository/
    └── {Feature}Repository.kt  # interface
```

### 3. JOOQコード生成

テーブル追加後、JOOQのコード生成を実行:

```bash
# 1. PostgreSQL起動
cd server && docker-compose up -d

# 2. アプリ起動でマイグレーション実行（初回のみ）
./gradlew :api:bootRun

# 3. JOOQコード生成
./gradlew :infra:jooqCodegen
```

生成されたコードは `infra/src/main/kotlin/com/scenepin/infra/jooq/` に配置される。

### 4. infra層

```
infra/src/main/kotlin/com/scenepin/infra/
├── jooq/                    # JOOQ生成コード（自動生成、編集禁止）
│   └── tables/
└── persistence/{feature}/
    └── {Feature}RepositoryImpl.kt
```

### 5. api層

```
api/src/main/kotlin/com/scenepin/api/feature/{feature}/
├── controller/
│   └── {Feature}Controller.kt
├── request/
│   ├── {Feature}CreateRequest.kt
│   └── {Feature}UpdateRequest.kt
└── response/
    └── {Feature}Response.kt
```

---

## コード規約

### Domain Model

```kotlin
// domain/model - ビジネスロジック用（純粋なデータクラス）
data class Video(
    val id: Long?,
    val name: String,
    val filePath: String,
    val thumbnailPath: String?,
    val duration: Long,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
```

### Repository パターン（JOOQ実装）

```kotlin
// domain - interface
interface VideoRepository {
    fun save(video: Video): Video
    fun findById(id: Long): Video?
    fun findAll(): List<Video>
    fun delete(id: Long)
}

// infra - JOOQ実装
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

    override fun save(video: Video): Video {
        val record = dsl.newRecord(VIDEOS).apply {
            name = video.name
            filePath = video.filePath
            // ...
        }
        record.store()
        return record.toDomain()
    }
    // ...
}

// 変換関数
private fun VideosRecord.toDomain() = Video(
    id = id,
    name = name,
    // ...
)
```

### Controller

```kotlin
@RestController
@RequestMapping("/api/videos")
class VideoController(
    private val videoService: VideoService
) {
    @GetMapping
    fun list(): List<VideoResponse> =
        videoService.findAll().map { it.toResponse() }

    @GetMapping("/{id}")
    fun get(@PathVariable id: Long): VideoResponse =
        videoService.findById(id)?.toResponse()
            ?: throw NotFoundException("Video not found")

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody request: VideoCreateRequest): VideoResponse =
        videoService.create(request.toDomain()).toResponse()
}
```

---

## マイグレーション規約

### 命名規則

```
V{version}__{description}.sql

例:
V1__create_videos_table.sql
V2__create_bookmarks_table.sql
V3__add_duration_to_videos.sql
```

### 注意事項

- 一度適用したマイグレーションは編集しない
- カラム追加は新しいマイグレーションで
- 本番環境でのDROP/TRUNCATEは慎重に

---

## API設計規約

### エンドポイント命名

```
GET    /api/{resources}           # 一覧
GET    /api/{resources}/{id}      # 詳細
POST   /api/{resources}           # 作成
PATCH  /api/{resources}/{id}      # 更新
DELETE /api/{resources}/{id}      # 削除
```

### レスポンス形式

```kotlin
// 成功時: 直接オブジェクトを返す
data class VideoResponse(
    val id: Long,
    val name: String,
    // ...
)

// エラー時: 共通形式
data class ErrorResponse(
    val message: String,
    val code: String
)
```

---

## ビルド確認

実装完了後は必ずビルドが通ることを確認する。

### ビルドコマンド

Javaバージョンの問題を避けるため、以下のコマンドを使用:

```bash
asdf current && export JAVA_HOME=$(asdf where java corretto-21.0.1.12.1) && java -version && cd server && ./gradlew build
```

### チェックリスト

- [ ] コンパイルエラーがないこと
- [ ] テストが通ること
- [ ] Lintエラーがないこと

---

## 詳細ドキュメント

- アーキテクチャ詳細: [docs/architecture/server.md](../../../docs/architecture/server.md)
- 要求仕様: [docs/要求仕様書/v2.0.0.md](../../../docs/要求仕様書/v2.0.0.md)
