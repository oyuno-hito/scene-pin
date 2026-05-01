import { useState } from 'react';
import type { BookmarkResponse } from '../api/generated';
import { formatTime } from '../utils/format';

interface Props {
  bookmarks: BookmarkResponse[];
  onSeek: (time: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
  onRemove: (id: number) => void;
}

export function BookmarkList({ bookmarks, onSeek, onUpdateMemo, onRemove }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMemo, setEditMemo] = useState('');

  const startEdit = (b: BookmarkResponse) => {
    setEditingId(b.id);
    setEditMemo(b.memo);
  };

  const saveEdit = (id: number) => {
    onUpdateMemo(id, editMemo);
    setEditingId(null);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="bookmark-empty">
        <p>ブックマークはまだありません</p>
        <p className="hint">再生中に★ボタンでタイムスタンプを保存できます</p>
      </div>
    );
  }

  return (
    <ul className="bookmark-list">
      {bookmarks.map(b => {
        const timestampInSeconds = b.timestamp / 1000;
        return (
          <li key={b.id} className="bookmark-item">
            <button className="bookmark-time" onClick={() => onSeek(timestampInSeconds)}>
              {formatTime(timestampInSeconds)}
            </button>
            <div className="bookmark-body">
              {editingId === b.id ? (
                <div className="bookmark-edit">
                  <input
                    className="memo-input"
                    value={editMemo}
                    onChange={e => setEditMemo(e.target.value)}
                    placeholder="メモを入力..."
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(b.id);
                    }}
                  />
                  <button className="save-btn" onClick={() => saveEdit(b.id)}>
                    保存
                  </button>
                </div>
              ) : (
                <span
                  className="bookmark-memo"
                  onClick={() => startEdit(b)}
                >
                  {b.memo || 'メモなし（タップで編集）'}
                </span>
              )}
            </div>
            <button className="delete-btn" onClick={() => onRemove(b.id)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
