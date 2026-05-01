---
name: jooq-codegen
description: >-
  JOOQのコード生成手順。テーブル追加・変更後にJOOQの型安全なコードを生成する際に使用。
---

# JOOQ コード生成

## 前提条件

- Docker / Docker Compose がインストール済み

## DB構成

Docker Composeプロファイルで開発用とAI用を分離:

| プロファイル | コンテナ名 | ポート | 用途 |
|-------------|-----------|--------|------|
| `dev` | scenepin-postgres | 5432 | 開発用（常時起動、データ永続化） |
| `ai` | scenepin-postgres-ai | 5433 | AIコーディング用（使い捨て） |

## マイグレーション実行タイミング

以下の場合にマイグレーションを実行する:

1. **マイグレーションファイルを新規追加した時**
   - `migration/src/main/resources/db/migration/V*__.sql` を追加

2. **マイグレーションファイルを変更した時**（開発中のみ）
   - 既存ファイルを編集した場合は clean + migrate が必要

## コード生成手順

### 1. AI用DB起動

```bash
cd server
docker compose --profile ai up -d
```

起動確認:
```bash
docker compose --profile ai ps
```

### 2. マイグレーション実行

**開発中（スキーマ変更あり）の場合: clean + migrate**

```bash
export JAVA_HOME=$(asdf where java corretto-21.0.1.12.1)

./gradlew flywayClean flywayMigrate \
  -Dflyway.url=jdbc:postgresql://localhost:5433/scenepin \
  -Dflyway.user=scenepin \
  -Dflyway.password=scenepin
```

**新規追加のみの場合: migrate**

```bash
./gradlew flywayMigrate \
  -Dflyway.url=jdbc:postgresql://localhost:5433/scenepin \
  -Dflyway.user=scenepin \
  -Dflyway.password=scenepin
```

### 3. JOOQコード生成

```bash
./gradlew :infra:jooqCodegen
```

> **Note:** `infra/build.gradle.kts` のJOOQ設定はポート5433（AI用）を参照

### 4. 生成結果確認

生成先: `infra/src/main/kotlin/com/scenepin/infra/jooq/`

```
infra/src/main/kotlin/com/scenepin/infra/jooq/
├── DefaultCatalog.kt
├── Public.kt
├── tables/
│   ├── Videos.kt
│   ├── Bookmarks.kt
│   ├── Tags.kt
│   ├── VideoTags.kt
│   └── records/
│       ├── VideosRecord.kt
│       └── ...
└── ...
```

### 5. AI用DB停止

```bash
docker compose --profile ai down
```

## トラブルシューティング

### DBに接続できない

```bash
docker compose --profile ai ps
docker compose --profile ai logs
```

### マイグレーションエラー（チェックサム不一致）

開発中にマイグレーションファイルを変更した場合に発生。clean + migrate を実行。

### 生成コードが古い

`infra/src/main/kotlin/com/scenepin/infra/jooq/` を削除してから再生成。

```bash
rm -rf infra/src/main/kotlin/com/scenepin/infra/jooq
./gradlew :infra:jooqCodegen
```

## 注意事項

- 生成コードは **編集禁止**（再生成で上書きされる）
- テーブル変更後は必ず再生成すること
- 生成コードはgitにコミットする（CI環境でDB起動が不要になる）
- 開発用DB（`--profile dev`）は停止しない
