---
description: Skill/Ruleの同期更新ルール
globs:
  - server/**
  - client/**
  - .cursor/skills/**
  - .cursor/rules/**
  - docs/**
---

# Skill/Rule 同期更新

## 更新が必要なタイミング

以下の場合、関連する `.cursor/skills/` または `.cursor/rules/` を更新すること:

1. **方向性・方針の変更**
   - ユーザーが「こうしてほしい」「これは違う」と指摘した場合
   - アーキテクチャや設計方針が変わった場合

2. **コマンド・手順の変更**
   - ビルドコマンド、実行コマンドが変わった場合
   - 開発手順が追加・変更された場合

3. **規約の追加・変更**
   - コーディング規約が追加された場合
   - 命名規則などが変わった場合

## 対応表

| 変更対象 | 更新するファイル |
|---------|-----------------|
| サーバー関連 | `.cursor/skills/server-development/SKILL.md` |
| フロントエンド関連 | `.cursor/skills/frontend-development/SKILL.md` |
| ワークフロー全般 | `.cursor/rules/workflow.md` |

## 更新時の注意

- 既存の内容と矛盾しないよう確認
- 変更理由をコメントで残す必要はない（履歴はgitで管理）
- 大きな変更の場合はユーザーに確認してから更新
