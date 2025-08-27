import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import "./SearchBar.scss";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedValue !== value) onChange(debouncedValue);
  }, [debouncedValue, value, onChange]);

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        data-testid="search-input"
      />
      {inputValue ? (
        <FaTimes
          className="icon"
          onClick={handleClear}
          data-testid="clear-icon"
        />
      ) : (
        <FaSearch className="icon" data-testid="search-icon" />
      )}
    </div>
  );
}

export default SearchBar;
