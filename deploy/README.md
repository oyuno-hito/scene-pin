# ScenePin デプロイ手順

## 前提条件

- Docker / Docker Compose がインストールされていること
- GitHub Personal Access Token (PAT) を取得済みであること
- 外付けHDDがマウントされていること（任意）

---

## 1. GitHub Personal Access Token の取得

ghcr.io（Private）からイメージをpullするためにPATが必要です。

### 取得手順

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token (classic)」をクリック
3. 以下のスコープを選択:
   - `read:packages`
4. トークンを生成してコピー

---

## 2. 初回セットアップ

### 2.1 ファイルの配置

```bash
# 外付けHDDにディレクトリ作成
mkdir -p /mnt/external-hdd/scene-pin
cd /mnt/external-hdd/scene-pin

# 必要なファイルをコピー（またはリポジトリからclone）
# docker-compose.yml と .env.example を配置
```

### 2.2 環境変数の設定

```bash
# .envファイル作成
cp .env.example .env

# 編集
nano .env
```

**必須の設定項目:**

| 変数 | 説明 | 例 |
|------|------|-----|
| `GITHUB_USERNAME` | GitHubユーザー名 | `your-username` |
| `STORAGE_BASE_URL` | サムネイルURL用 | `http://192.168.1.100:8080` |
| `DATA_PATH` | データ保存先 | `/mnt/external-hdd/scene-pin/data` |
| `POSTGRES_PASSWORD` | DBパスワード | 任意の安全な値 |

### 2.3 GitHub Container Registry へのログイン

```bash
# PATでログイン
echo YOUR_GITHUB_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

> 認証情報は `~/.docker/config.json` に保存され、Watchtowerも使用します。

### 2.4 データディレクトリの作成

```bash
mkdir -p ${DATA_PATH}/videos
mkdir -p ${DATA_PATH}/thumbnails
mkdir -p ${DATA_PATH}/postgres
```

### 2.5 起動

```bash
docker compose up -d
```

---

## 3. 動作確認

### ログ確認

```bash
docker compose logs -f app
```

### ヘルスチェック

```bash
curl http://localhost:8080/actuator/health
```

### ブラウザでアクセス

```
http://<サーバーIP>:8080
```

---

## 4. 自動更新（Watchtower）

Watchtowerが5分ごと（デフォルト）にghcr.ioをチェックし、新しいイメージがあれば自動で更新します。

### 更新の流れ

1. コードをmainブランチにpush
2. GitHub Actionsがイメージをビルド・push
3. Watchtowerが新しいイメージを検知
4. 自動でpull → コンテナ再起動

### 手動更新

```bash
docker compose pull
docker compose up -d
```

---

## 5. Tailscale経由でのアクセス

外出先からアクセスする場合:

1. サーバーPCにTailscaleをインストール
2. `STORAGE_BASE_URL`をTailscale IPに変更
   ```
   STORAGE_BASE_URL=http://100.x.x.x:8080
   ```
3. `docker compose up -d` で再起動

---

## 6. トラブルシューティング

### イメージがpullできない

```bash
# 認証状態を確認
cat ~/.docker/config.json

# 再ログイン
docker logout ghcr.io
echo YOUR_PAT | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### データベース接続エラー

```bash
# PostgreSQLコンテナの状態確認
docker compose logs postgres

# コンテナ内から接続テスト
docker compose exec postgres psql -U scenepin -d scenepin
```

### ストレージ権限エラー

```bash
# データディレクトリの権限確認
ls -la ${DATA_PATH}

# 必要に応じて権限変更
sudo chown -R 1000:1000 ${DATA_PATH}
```

---

## 7. バックアップ

### データベース

```bash
docker compose exec postgres pg_dump -U scenepin scenepin > backup.sql
```

### リストア

```bash
cat backup.sql | docker compose exec -T postgres psql -U scenepin scenepin
```

---

## 環境変数一覧

| 変数 | 必須 | デフォルト | 説明 |
|------|------|-----------|------|
| `GITHUB_USERNAME` | ✅ | - | GitHubユーザー名 |
| `APP_PORT` | - | `8080` | 公開ポート |
| `STORAGE_BASE_URL` | ✅ | `http://localhost:8080` | クライアントからのアクセスURL |
| `POSTGRES_DB` | - | `scenepin` | データベース名 |
| `POSTGRES_USER` | - | `scenepin` | DBユーザー名 |
| `POSTGRES_PASSWORD` | ✅ | `scenepin` | DBパスワード |
| `DATA_PATH` | ✅ | `./data` | データ保存先 |
| `WATCHTOWER_INTERVAL` | - | `300` | 更新チェック間隔（秒） |
