---
name: frontend-development
description: >-
  ScenePinフロントエンド（React/TypeScript）の開発ガイド。コンポーネント追加、
  hooks実装、API連携時に使用。フロントエンド、React、TypeScript、
  UI、コンポーネント関連の作業で適用。
---

# ScenePin Frontend Development

## プロジェクト構成

```
client/
├── src/
│   ├── components/       # UIコンポーネント
│   ├── hooks/            # カスタムフック
│   ├── pages/            # ページコンポーネント
│   ├── utils/            # ユーティリティ関数
│   ├── api/              # APIクライアント（v2.0.0で追加予定）
│   ├── db.ts             # IndexedDB定義（v1.0.0）
│   ├── App.tsx           # ルートコンポーネント
│   ├── main.tsx          # エントリーポイント
│   └── index.css         # グローバルスタイル
├── public/               # 静的ファイル
└── ios/                  # Capacitor iOSプロジェクト
```

## 技術スタック

- React 19 + TypeScript
- Vite
- openapi-generator-cli（APIクライアント生成）
- Dexie（ローカルDB - 視聴位置保存用）
- Capacitor（iOS）

---

## APIクライアント生成

サーバーAPIの変更後、クライアントコードを再生成する。

### 前提条件

- サーバーが起動していること（`http://localhost:8080`）

### 生成コマンド

```bash
cd client
npm run api:generate
```

### 生成されるファイル

```
src/api/generated/
├── apis/           # APIクラス
├── models/         # 型定義
├── runtime.ts
└── index.ts
```

### 注意事項

- `src/api/generated/` は自動生成、手動編集禁止
- multipart/form-data（ファイルアップロード）は`client.ts`で手動実装

---

## コンポーネント追加

### ディレクトリ構成

```
components/
├── VideoPlayer.tsx       # 機能単位のコンポーネント
├── VideoCard.tsx
└── BookmarkList.tsx
```

### コンポーネントの書き方

```typescript
interface Props {
  videoId: number;
  onSelect: (id: number) => void;
}

export function VideoCard({ videoId, onSelect }: Props) {
  return (
    <div className="video-card" onClick={() => onSelect(videoId)}>
      {/* ... */}
    </div>
  );
}
```

- **関数コンポーネント**を使用
- **Props**はinterfaceで定義
- **export function**で名前付きエクスポート

---

## カスタムフック

### 命名規則

- `use` プレフィックスを付ける
- 機能を表す名前にする

```
hooks/
├── useVideoPlayer.ts     # 動画プレイヤーロジック
├── useVideoList.ts       # 動画一覧管理
└── useBookmarks.ts       # ブックマーク管理
```

### フックの書き方

```typescript
export function useVideoPlayer(videoId: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = useCallback(() => {
    // ...
  }, []);

  return {
    videoRef,
    isPlaying,
    currentTime,
    togglePlay,
  };
}
```

---

## ページコンポーネント

```
pages/
├── VideoListPage.tsx     # 動画一覧画面
└── VideoDetailPage.tsx   # 動画詳細・再生画面
```

### 画面遷移（現状）

App.tsxでstateによる画面切り替え:

```typescript
export default function App() {
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);

  return (
    <div className="app">
      {currentVideoId === null ? (
        <VideoListPage onSelectVideo={setCurrentVideoId} />
      ) : (
        <VideoDetailPage
          videoId={currentVideoId}
          onBack={() => setCurrentVideoId(null)}
        />
      )}
    </div>
  );
}
```

---

## API連携

### ディレクトリ構成

```
api/
├── client.ts             # APIインスタンス・ヘルパー
└── generated/            # openapi-generatorで生成（編集禁止）
```

### APIクライアントの使い方

```typescript
// api/client.ts
import { Configuration, VideoControllerApi, ... } from './generated';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const configuration = new Configuration({
  basePath: API_BASE_URL,
});

export const videoApi = new VideoControllerApi(configuration);
export const bookmarkApi = new BookmarkControllerApi(configuration);

// multipart対応（生成コードでは未対応のため手動実装）
export async function uploadVideo(file: File): Promise<VideoResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/videos/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}
```

### hooks内での使用

```typescript
import { videoApi } from '../api/client';

export function useVideoList() {
  const refresh = useCallback(async () => {
    const items = await videoApi.list({});
    setVideos(items);
  }, []);
  // ...
}
```

### API変更時のワークフロー

1. サーバー側でController/DTOを変更
2. サーバーを起動
3. `npm run api:generate` でクライアント再生成
4. hooks/コンポーネントを更新
5. ビルド確認

---

## スタイリング

- **グローバルスタイル**: `index.css`
- **CSS変数**で色・サイズを管理
- **クラス名**はケバブケース（`video-card`, `bookmark-list`）

```css
:root {
  --bg: #0f0f13;
  --surface: #1a1a24;
  --accent: #6c5ce7;
  /* ... */
}

.video-card {
  background: var(--surface);
  /* ... */
}
```

---

## ビルド確認

実装完了後は必ずビルドが通ることを確認する。

### ビルドコマンド

```bash
cd client && npm run lint && npm run build
```

### Capacitor同期

iOS向けの変更がある場合:

```bash
cd client && npm run cap:sync
```

### チェックリスト

- [ ] ESLintエラーがないこと
- [ ] TypeScriptエラーがないこと
- [ ] ビルドが成功すること

---

## 詳細ドキュメント

- 要求仕様: [docs/要求仕様書/v2.0.0.md](../../../docs/要求仕様書/v2.0.0.md)
- Capacitor設定: [client/README.md](../../../client/README.md)
