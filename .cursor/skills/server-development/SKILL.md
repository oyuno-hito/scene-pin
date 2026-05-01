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

### 3. infra層

```
infra/src/main/kotlin/com/scenepin/infra/persistence/{feature}/
├── {Feature}Entity.kt
├── {Feature}JpaRepository.kt
└── {Feature}RepositoryImpl.kt
```

### 4. api層

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

### Entity と Model の分離

```kotlin
// domain/model - ビジネスロジック用
data class Video(
    val id: Long?,
    val name: String,
    val filePath: String,
    val duration: Int,
    val lastPosition: Int
)

// infra/persistence - JPA用
@Entity
@Table(name = "videos")
class VideoEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val filePath: String,
    val duration: Int,
    val lastPosition: Int
)

// 変換関数は RepositoryImpl 内に配置
private fun Video.toEntity() = VideoEntity(...)
private fun VideoEntity.toDomain() = Video(...)
```

### Repository パターン

```kotlin
// domain - interface
interface VideoRepository {
    fun save(video: Video): Video
    fun findById(id: Long): Video?
    fun findAll(): List<Video>
    fun delete(id: Long)
}

// infra - 実装
@Repository
class VideoRepositoryImpl(
    private val jpaRepository: VideoJpaRepository
) : VideoRepository {
    override fun save(video: Video): Video {
        return jpaRepository.save(video.toEntity()).toDomain()
    }
    // ...
}
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
