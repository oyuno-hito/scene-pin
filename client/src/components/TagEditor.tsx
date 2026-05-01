import { useState } from 'react';
import type { TagResponse } from '../api/generated';

interface Props {
  tags: TagResponse[];
  allTags: TagResponse[];
  onAddTag: (name: string) => void;
  onRemoveTag: (tagId: number) => void;
}

export function TagEditor({ tags, allTags, onAddTag, onRemoveTag }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const existingTagIds = new Set(tags.map(t => t.id));
  const suggestions = allTags.filter(
    t => !existingTagIds.has(t.id) && t.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTag(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (tag: TagResponse) => {
    onAddTag(tag.name);
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <div className="tag-editor">
      <div className="tag-list">
        {tags.map(tag => (
          <span key={tag.id} className="tag">
            {tag.name}
            <button
              className="tag-remove"
              onClick={() => onRemoveTag(tag.id)}
              title="削除"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <form className="tag-input-form" onSubmit={handleSubmit}>
        <div className="tag-input-wrapper">
          <input
            type="text"
            className="tag-input"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="タグを追加..."
          />
          {showSuggestions && inputValue && suggestions.length > 0 && (
            <ul className="tag-suggestions">
              {suggestions.slice(0, 5).map(tag => (
                <li
                  key={tag.id}
                  onClick={() => handleSelectSuggestion(tag)}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="tag-add-btn">追加</button>
      </form>
    </div>
  );
}
