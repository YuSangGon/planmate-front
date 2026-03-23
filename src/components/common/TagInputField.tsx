import { useState } from "react";

type TagInputFieldProps = {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (next: string[]) => void;
  popularTags?: string[];
};

export default function TagInputField({
  label,
  placeholder,
  value,
  onChange,
  popularTags = [],
}: TagInputFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAllPopular, setShowAllPopular] = useState(false);

  const visiblePopularTags = showAllPopular
    ? popularTags
    : popularTags.slice(0, 4);

  const hiddenCount = Math.max(0, popularTags.length - 4);

  const normalize = (text: string) => text.trim().toLowerCase();

  const addSingleTag = (rawValue: string) => {
    const nextValue = rawValue.trim();

    if (!nextValue) return false;

    const alreadyExists = value.some(
      (item) => normalize(item) === normalize(nextValue),
    );

    if (alreadyExists) {
      setErrorMessage(`"${nextValue}" is already added.`);
      return false;
    }

    onChange([...value, nextValue]);
    setErrorMessage("");
    return true;
  };

  const addTagsFromInput = (rawValue: string) => {
    const splitValues = rawValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (splitValues.length === 0) {
      return;
    }

    const existingNormalized = new Set(value.map(normalize));
    const nextTags: string[] = [];
    const duplicates: string[] = [];

    for (const tag of splitValues) {
      const normalizedTag = normalize(tag);

      if (
        existingNormalized.has(normalizedTag) ||
        nextTags.some((item) => normalize(item) === normalizedTag)
      ) {
        duplicates.push(tag);
        continue;
      }

      nextTags.push(tag);
      existingNormalized.add(normalizedTag);
    }

    if (nextTags.length > 0) {
      onChange([...value, ...nextTags]);
      setInputValue("");
    }

    if (duplicates.length > 0) {
      setErrorMessage(`Already added: ${duplicates.join(", ")}`);
    } else {
      setErrorMessage("");
    }
  };

  const removeTag = (target: string) => {
    onChange(value.filter((item) => item !== target));
    setErrorMessage("");
  };

  const togglePopularTag = (tag: string) => {
    const isSelected = value.some((item) => normalize(item) === normalize(tag));

    if (isSelected) {
      removeTag(tag);
      return;
    }

    const added = addSingleTag(tag);
    if (added) {
      setInputValue("");
    }
  };

  return (
    <div className="form-field form-field--full">
      <label>{label}</label>

      <div className="tag-input-group">
        <div className="tag-input-row">
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              const nextValue = e.target.value;
              setInputValue(nextValue);

              if (errorMessage) {
                setErrorMessage("");
              }

              if (nextValue.includes(",")) {
                addTagsFromInput(nextValue);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTagsFromInput(inputValue);
              }
            }}
          />

          <button
            type="button"
            className="tag-input-add-btn"
            onClick={() => addTagsFromInput(inputValue)}
          >
            Add
          </button>
        </div>

        {errorMessage ? (
          <p className="tag-input-error">{errorMessage}</p>
        ) : null}

        {value.length > 0 && (
          <div className="selected-tags">
            {value.map((tag) => (
              <div key={tag} className="selected-tag">
                <span>{tag}</span>
                <button
                  type="button"
                  className="selected-tag__remove"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {popularTags.length > 0 && (
          <div className="popular-tags popular-tags--compact">
            <div className="popular-tags__header">
              <span className="popular-tags__label">Popular</span>

              {hiddenCount > 0 && (
                <button
                  type="button"
                  className="popular-tags__toggle"
                  onClick={() => setShowAllPopular((prev) => !prev)}
                >
                  {showAllPopular ? "Show less" : `+${hiddenCount} more`}
                </button>
              )}
            </div>

            <div className="popular-tags__list">
              {visiblePopularTags.map((tag) => {
                const isSelected = value.some(
                  (item) => normalize(item) === normalize(tag),
                );

                return (
                  <button
                    key={tag}
                    type="button"
                    className={`chip chip--sm ${isSelected ? "chip--active" : ""}`}
                    onClick={() => togglePopularTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
