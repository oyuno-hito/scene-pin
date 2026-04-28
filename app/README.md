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

### .ipaファイルの作成（AltStore用）

Apple Developer Program（$99/年）不要で、AltStoreを使ってインストールできます。

#### 1. Signing（署名）の設定

1. Xcodeの左サイドバーで **App** プロジェクトを選択
2. **TARGETS** → **App** を選択
3. **Signing & Capabilities** タブを開く
4. 設定：
   - **Team**: 自分のApple ID（無料でOK、初回は「Add Account」でApple IDを追加）
   - **Bundle Identifier**: `com.scenepin.app`（そのまま）

#### 2. Archive（アーカイブ）を作成

1. 上部のデバイス選択で **Any iOS Device (arm64)** を選択（シミュレータではArchive不可）
2. メニューバーから **Product → Archive**
3. ビルド完了後、**Organizer** ウィンドウが開く

#### 3. .ipaをエクスポート

1. Organizerで作成したアーカイブを選択
2. **Distribute App** をクリック
3. **Custom** → **Next**
4. **Ad Hoc** → **Next**
5. **Automatically manage signing** → **Next**
6. **Export** → 保存先を選択

#### 4. AltStoreでインストール

1. [AltStore](https://altstore.io) をPCとiPhoneにインストール（初回のみ）
2. 作成した `.ipa` ファイルをiPhoneに送信（AirDrop等）
3. iPhoneの **AltStore** アプリを開く
4. **My Apps** → 左上の **+** → `.ipa` ファイルを選択
5. インストール完了

> **注意**: 無料Apple IDの場合、7日ごとに再署名が必要です。AltStoreアプリを開くと自動更新されます。

## 技術スタック

- React 19
- TypeScript
- Vite
- Dexie（IndexedDB）
- Capacitor（iOS/Android）
