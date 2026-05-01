# Server Architecture

## モジュール構成

```
server/
├── build.gradle.kts
├── settings.gradle.kts
│
├── api/                              # Spring Boot起動、HTTP層
├── domain/                           # ドメインロジック
├── infra/                            # 外部連携実装
└── migration/                        # DBマイグレーション
```

### 依存関係

```
api → domain, infra, migration
infra → domain
domain → (なし)
migration → (なし)
```

---

## api モジュール

HTTP層を担当。Controller、リクエスト/レスポンスDTO、設定を配置。

```
api/
└── src/main/kotlin/com/scenepin/api/
    ├── ScenePinApplication.kt
    ├── config/
    │   ├── WebConfig.kt
    │   └── CorsConfig.kt
    │
    └── feature/
        ├── video/
        │   ├── controller/
        │   │   └── VideoController.kt
        │   ├── request/
        │   │   ├── VideoUploadRequest.kt
        │   │   └── VideoUpdateRequest.kt
        │   └── response/
        │       ├── VideoResponse.kt
        │       └── VideoListResponse.kt
        │
        ├── bookmark/
        │   ├── controller/
        │   │   └── BookmarkController.kt
        │   ├── request/
        │   │   ├── BookmarkCreateRequest.kt
        │   │   └── BookmarkUpdateRequest.kt
        │   └── response/
        │       └── BookmarkResponse.kt
        │
        └── tag/
            ├── controller/
            │   └── TagController.kt
            ├── request/
            └── response/
                └── TagResponse.kt
```

### 責務

- HTTPリクエストの受付・バリデーション
- リクエスト → ドメインモデルの変換
- ドメインモデル → レスポンスの変換
- 例外ハンドリング（@ControllerAdvice）

---

## domain モジュール

ビジネスロジックを担当。Spring依存あり（@Service等）。

```
domain/
└── src/main/kotlin/com/scenepin/domain/
    └── feature/
        ├── video/
        │   ├── model/
        │   │   └── Video.kt
        │   ├── service/
        │   │   └── VideoService.kt
        │   ├── usecase/
        │   │   ├── UploadVideoUseCase.kt
        │   │   ├── StreamVideoUseCase.kt
        │   │   └── DeleteVideoUseCase.kt
        │   └── repository/
        │       └── VideoRepository.kt          # interface
        │
        ├── bookmark/
        │   ├── model/
        │   │   └── Bookmark.kt
        │   ├── service/
        │   │   └── BookmarkService.kt
        │   ├── usecase/
        │   │   ├── AddBookmarkUseCase.kt
        │   │   └── UpdateBookmarkUseCase.kt
        │   └── repository/
        │       └── BookmarkRepository.kt       # interface
        │
        └── tag/
            ├── model/
            │   └── Tag.kt
            ├── service/
            │   └── TagService.kt
            └── repository/
                └── TagRepository.kt            # interface
```

### 責務

- **model**: ドメインエンティティ、値オブジェクト
- **service**: 複数のusecaseを束ねる、または単純なCRUD操作
- **usecase**: 単一のビジネスユースケースを表現
- **repository**: データアクセスの抽象（interface）

### Service vs UseCase の使い分け

| 種類 | 用途 | 例 |
|------|------|-----|
| **Service** | 複数usecaseの集約、シンプルなCRUD | VideoService（findAll, findById等） |
| **UseCase** | 複雑なビジネスロジックを持つ単一操作 | UploadVideoUseCase（サムネイル生成含む） |

小規模なfeatureではServiceのみでも可。UseCaseは必要に応じて導入。

---

## infra モジュール

外部システムとの連携実装を担当。

```
infra/
└── src/main/kotlin/com/scenepin/infra/
    ├── persistence/
    │   ├── video/
    │   │   ├── VideoEntity.kt
    │   │   ├── VideoJpaRepository.kt       # Spring Data JPA
    │   │   └── VideoRepositoryImpl.kt      # domain/VideoRepository の実装
    │   │
    │   ├── bookmark/
    │   │   ├── BookmarkEntity.kt
    │   │   ├── BookmarkJpaRepository.kt
    │   │   └── BookmarkRepositoryImpl.kt
    │   │
    │   └── tag/
    │       ├── TagEntity.kt
    │       ├── VideoTagEntity.kt           # 中間テーブル
    │       ├── TagJpaRepository.kt
    │       └── TagRepositoryImpl.kt
    │
    ├── storage/
    │   ├── StorageAdapter.kt               # interface
    │   └── LocalStorageAdapter.kt          # ローカルファイルシステム実装
    │
    └── thumbnail/
        └── FFmpegThumbnailGenerator.kt
```

### 責務

- **persistence**: DBアクセス実装
  - `*Entity.kt`: JPAエンティティ（DBテーブルとのマッピング）
  - `*JpaRepository.kt`: Spring Data JPAインターフェース
  - `*RepositoryImpl.kt`: domain層のRepositoryインターフェースの実装
- **storage**: ファイルストレージ抽象化
- **thumbnail**: FFmpegを使ったサムネイル生成

### Entity と Model の変換

```kotlin
// infra/persistence/video/VideoRepositoryImpl.kt
@Repository
class VideoRepositoryImpl(
    private val jpaRepository: VideoJpaRepository
) : VideoRepository {

    override fun save(video: Video): Video {
        val entity = video.toEntity()
        val saved = jpaRepository.save(entity)
        return saved.toDomain()
    }

    override fun findById(id: Long): Video? {
        return jpaRepository.findById(id)
            .map { it.toDomain() }
            .orElse(null)
    }
}

// 変換関数
private fun Video.toEntity() = VideoEntity(
    id = this.id,
    name = this.name,
    filePath = this.filePath,
    // ...
)

private fun VideoEntity.toDomain() = Video(
    id = this.id,
    name = this.name,
    filePath = this.filePath,
    // ...
)
```

---

## migration モジュール

Flywayマイグレーションファイルを配置。アプリ起動時に自動実行される。

```
migration/
└── src/main/resources/
    └── db/migration/
        ├── V1__create_videos_table.sql
        ├── V2__create_bookmarks_table.sql
        ├── V3__create_tags_table.sql
        └── V4__create_video_tags_table.sql
```

### 命名規則

```
V{version}__{description}.sql

例:
V1__create_videos_table.sql
V2__create_bookmarks_table.sql
V3__add_duration_to_videos.sql
```

### 実行タイミング

- Spring Boot起動時にFlywayが自動実行
- 未適用のマイグレーションのみ実行される
- jarにSQLファイルが含まれるため、ソースコードのclone不要

---

## 依存関係の詳細

### build.gradle.kts

```kotlin
// settings.gradle.kts
rootProject.name = "scene-pin-server"
include("api", "domain", "infra", "migration")
```

```kotlin
// api/build.gradle.kts
dependencies {
    implementation(project(":domain"))
    implementation(project(":infra"))
    implementation(project(":migration"))
    
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
}

// domain/build.gradle.kts
dependencies {
    implementation("org.springframework:spring-context")
    // Spring依存は最小限に
}

// infra/build.gradle.kts
dependencies {
    implementation(project(":domain"))
    
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.postgresql:postgresql")
}

// migration/build.gradle.kts
plugins {
    id("java")
}
// SQLファイルのみなので依存なし
```

---

## パッケージ構成の全体図

```
com.scenepin/
│
├── api/
│   ├── ScenePinApplication.kt
│   ├── config/
│   └── feature/
│       └── {feature}/
│           ├── controller/
│           ├── request/
│           └── response/
│
├── domain/
│   └── feature/
│       └── {feature}/
│           ├── model/
│           ├── service/
│           ├── usecase/      # 必要に応じて
│           └── repository/   # interface
│
└── infra/
    ├── persistence/
    │   └── {feature}/
    │       ├── *Entity.kt
    │       ├── *JpaRepository.kt
    │       └── *RepositoryImpl.kt
    ├── storage/
    └── thumbnail/
```
