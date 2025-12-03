"use client";

import { useState, useEffect } from "react";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  placeholder?: string;
  onSearchChange?: (search: string) => void;
};

export default function SearchBar({
  placeholder = "Пошук закладів...",
  onSearchChange,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange?.(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    onSearchChange?.(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button type="button" className={styles.button} onClick={handleSearch}>
        Пошук
      </button>
    </div>
  );
}

