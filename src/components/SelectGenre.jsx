import React, { useMemo } from "react";
import styled from "styled-components";

const normalizeOptions = (genres) =>
  (Array.isArray(genres) ? genres : []).map((genre) => {
    if (typeof genre === "string") {
      return { value: genre, label: genre };
    }

    if (genre && typeof genre === "object") {
      const value =
        genre.id ??
        genre._id ??
        genre.value ??
        genre.name ??
        genre.label ??
        "";
      const label = genre.name ?? genre.label ?? String(value);
      return { value, label };
    }

    const fallback = String(genre ?? "");
    return { value: fallback, label: fallback };
  });

function SelectGenre({
  genres = [],
  value = "",
  placeholder = "Browse by genre",
  onChange,
}) {
  const options = useMemo(() => normalizeOptions(genres), [genres]);

  return (
    <Select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      aria-label="Select genre"
    >
      <option value="">{placeholder}</option>
      {options.map(({ value: optionValue, label }) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </Select>
  );
}

export default SelectGenre;

const Select = styled.select`
  margin: 0;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 999px;
  border: none;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(12px);
  min-width: 220px;
  appearance: none;
  cursor: pointer;

  option {
    color: #111;
  }
`;
