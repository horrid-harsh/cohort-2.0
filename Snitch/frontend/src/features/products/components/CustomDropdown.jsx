import React, { useState, useRef, useEffect } from "react";
import styles from "./CustomDropdown.module.scss";

const CustomDropdown = ({ label, options, value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || label || "Select";

  return (
    <div
      className={`${styles.dropdown} ${isOpen ? styles.isOpen : ""}`}
      ref={containerRef}
    >
      {/* ── Trigger: button instead of checkbox label ── */}
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${name} dropdown, selected: ${selectedLabel}`}
      >
        {selectedLabel}
      </button>

      {/* ── Options list ── */}
      <ul
        className={`${styles.list} ${styles.webkitScrollbar} ${isOpen ? styles.listOpen : ""}`}
        role="listbox"
        aria-label={name}
      >
        {options.map((option) => (
          <li
            key={option.value}
            className={`${styles.listItem} ${value === option.value ? styles.active : ""}`}
            role="option"
            aria-selected={value === option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomDropdown;
