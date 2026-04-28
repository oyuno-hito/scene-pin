# ScenePin - App

動画のシーンをピン留めして瞬時にジャンプできるアプリ。

## 開発（Web）

```bash
npm install
npm run dev
```

## ビルド（Web）

```bash
npm run build
```

## iOSアプリ（Capacitor）

### 初回セットアップ

```bash
# Webをビルドしてiプロジェクトを同期
npm run cap:build:ios

# Xcodeでプロジェクトを開く
npm run cap:open:ios
```

### Xcodeでの操作

1. Xcodeで開いたら、左上でターゲットデバイス（シミュレータまたは実機）を選択
2. `Cmd + R` でビルド＆実行
3. 実機の場合は「Signing & Capabilities」でTeamを設定

### 変更後の再ビルド

```bash
npm run cap:sync
```

### AltStoreでインストール（Apple Developer不要）

1. Xcodeで Product → Archive
2. Distribute App → Ad Hoc → Export
3. 出力された .ipa ファイルをAltStoreでインストール

## 技術スタック

- React 19
- TypeScript
- Vite
- Dexie（IndexedDB）
- Capacitor（iOS/Android）
