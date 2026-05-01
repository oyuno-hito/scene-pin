---
description: Skill/Ruleの同期更新ルール
globs:
  - server/**
  - client/**
  - .cursor/skills/**
  - .cursor/rules/**
  - docs/**
alwaysApply: true
---

# Skill/Rule 同期更新

## 重要: 必ず実行すること

**技術スタック・設計方針・手順が変わった場合、該当するskill/ruleを即座に更新せよ。**

これは「後で」ではなく、変更を加えた直後に行うこと。

## 更新トリガー（以下に該当したら即更新）

1. **技術スタックの変更**
   - ORM変更（JPA → JOOQ など）
   - フレームワーク追加・変更
   - ビルドツール・依存関係の変更

2. **設計方針の変更**
   - ユーザーが「こうしてほしい」「これは違う」と指摘
   - アーキテクチャ変更

3. **コマンド・手順の変更**
   - ビルドコマンド変更
   - 開発フロー変更

4. **規約の追加・変更**
   - コーディング規約追加
   - 命名規則変更

## 対応表

| 変更対象 | 更新するファイル |
|---------|-----------------|
| サーバー関連 | `.cursor/skills/server-development/SKILL.md` |
| フロントエンド関連 | `.cursor/skills/frontend-development/SKILL.md` |
| ワークフロー全般 | `.cursor/rules/workflow.md` |
| マイグレーション関連 | `.cursor/skills/server-development/SKILL.md` (マイグレーション規約セクション) |

## 更新時の注意

- 既存の内容と矛盾しないよう確認
- 変更理由をコメントで残す必要はない（履歴はgitで管理）
- 軽微な更新は確認不要、大きな変更の場合はユーザーに確認
