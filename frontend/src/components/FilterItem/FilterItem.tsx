"use client";

import styles from "./FilterItem.module.css";

type FilterItemProps = {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function FilterItem({
  label,
  count,
  checked = false,
  onChange,
}: FilterItemProps) {
  return (
    <label className={`${styles.item} ${checked ? styles.active : ""}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className={styles.label}>{label}</span>
      {typeof count === "number" && (
        <span className={styles.count}>{count}</span>
      )}
    </label>
  );
}

