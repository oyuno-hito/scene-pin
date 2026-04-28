# Media Player

iOS Safari 向けのパーソナル動画ブックマーク＆プレイヤー。
端末内の動画ファイルを読み込み、タイムスタンプへのブックマークや A-B ループ再生が行える PWA。

## 機能

- **動画再生** — iOS「ファイル」アプリや iCloud Drive から動画を選択・再生
- **再生制御** — 再生/一時停止、シーク、ボリューム調整、速度変更（0.5x〜2.0x）
- **ブックマーク** — 再生中の任意位置にタイムスタンプを保存、メモ編集、タップでジャンプ
- **A-B ループ** — 開始点と終了点を指定してリピート再生
- **オフライン動作** — Service Worker によるキャッシュで、PWA としてホーム画面から起動可能
- **プライバシー** — 外部通信なし、すべてのデータは端末内 IndexedDB に保存

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 19 + TypeScript, Vite |
| データ永続化 | IndexedDB (Dexie.js) |
| PWA | manifest.json + Service Worker |
| インフラ | S3 + CloudFront (Terraform) |
| CI/CD | GitHub Actions |

## ディレクトリ構成

```
.
├── app/                  # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/   # UI コンポーネント
│   │   ├── hooks/        # カスタムフック
│   │   ├── utils/        # ユーティリティ
│   │   ├── db.ts         # IndexedDB スキーマ定義
│   │   ├── App.tsx       # ルートコンポーネント
│   │   └── main.tsx      # エントリーポイント
│   └── public/           # 静的アセット（manifest.json, sw.js）
├── infra/                # Terraform 構成ファイル
├── .github/workflows/    # GitHub Actions
│   ├── deploy.yml        # ビルド & S3 デプロイ
│   └── terraform.yml     # インフラ管理
└── 要求仕様書.md
```

## ローカル開発

```bash
cd app
npm install
npm run dev
```

`http://localhost:5173` でアプリが起動します。

### その他のコマンド

```bash
npm run build    # プロダクションビルド
npm run lint     # ESLint
npm run preview  # ビルド成果物のプレビュー
```

## インフラ構成

S3（静的ホスティング）+ CloudFront（CDN / HTTPS）の構成を Terraform で管理しています。

```
CloudFront (HTTPS)
  └── S3 Bucket (OAC 経由、パブリックアクセスなし)
```

### インフラのセットアップ

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars  # 必要に応じて値を編集
terraform init
terraform plan
terraform apply
```

適用後、以下の出力が得られます：

- `s3_bucket_name` — デプロイ先バケット名
- `cloudfront_distribution_id` — キャッシュ無効化に使用する ID
- `site_url` — サイトの URL

## CI/CD

GitHub Actions で自動デプロイが行われます。

### 必要な GitHub Secrets

| Secret | 説明 |
|---|---|
| `AWS_ROLE_ARN` | GitHub OIDC 連携用 IAM ロールの ARN |
| `S3_BUCKET_NAME` | Terraform output の `s3_bucket_name` |
| `CLOUDFRONT_DISTRIBUTION_ID` | Terraform output の `cloudfront_distribution_id` |

### ワークフロー

| ワークフロー | トリガー | 処理内容 |
|---|---|---|
| **Build & Deploy** | `app/**` への push (main) | lint → build → S3 sync → CloudFront invalidation |
| **Terraform** | `infra/**` への push / PR | fmt check → validate → plan → apply (main のみ) |

## ライセンス

Private
