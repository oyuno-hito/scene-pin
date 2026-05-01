import type { TagResponse } from '../api/generated';

interface Props {
  allTags: TagResponse[];
  selectedTagIds: number[];
  onToggleTag: (tagId: number) => void;
  onClearAll: () => void;
}

export function TagFilter({ allTags, selectedTagIds, onToggleTag, onClearAll }: Props) {
  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="tag-filter">
      <div className="tag-filter-list">
        {allTags.map(tag => (
          <button
            key={tag.id}
            className={`tag-filter-item ${selectedTagIds.includes(tag.id) ? 'selected' : ''}`}
            onClick={() => onToggleTag(tag.id)}
          >
            {tag.name}
          </button>
        ))}
      </div>
      {selectedTagIds.length > 0 && (
        <button className="tag-filter-clear" onClick={onClearAll}>
          クリア
        </button>
      )}
    </div>
  );
}
