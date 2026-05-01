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
- Dexie（IndexedDB）
- Capacitor（iOS）

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

## API連携（v2.0.0）

### ディレクトリ構成

```
api/
├── client.ts             # fetchラッパー
├── videos.ts             # 動画API
└── bookmarks.ts          # ブックマークAPI
```

### APIクライアントの書き方

```typescript
// api/client.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// api/videos.ts
export const videosApi = {
  list: () => apiGet<Video[]>('/api/videos'),
  get: (id: number) => apiGet<Video>(`/api/videos/${id}`),
  // ...
};
```

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
