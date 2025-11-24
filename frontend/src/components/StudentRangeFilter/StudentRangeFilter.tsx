"use client";

import { useMemo, useState } from "react";
import styles from "./StudentRangeFilter.module.css";

type StudentRangeFilterProps = {
  min?: number;
  max?: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
};

export default function StudentRangeFilter({
  min = 0,
  max = 10000,
  step = 500,
  initialMin,
  initialMax,
}: StudentRangeFilterProps) {
  const [range, setRange] = useState({
    min: initialMin ?? min,
    max: initialMax ?? max,
  });

  const minPercent = useMemo(
    () => ((range.min - min) / (max - min)) * 100,
    [range.min, min, max]
  );

  const maxPercent = useMemo(
    () => ((range.max - min) / (max - min)) * 100,
    [range.max, min, max]
  );

  const handleMinChange = (value: number) => {
    setRange((prev) => ({
      ...prev,
      min: Math.min(value, prev.max - step),
    }));
  };

  const handleMaxChange = (value: number) => {
    setRange((prev) => ({
      ...prev,
      max: Math.max(value, prev.min + step),
    }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.values}>
        {range.min} - {range.max}
      </div>
      <div className={styles.slider}>
        <div className={styles.track} />
        <div
          className={styles.range}
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range.min}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className={styles.thumb}
          style={{ zIndex: range.min > max - 100 ? 5 : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range.max}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className={styles.thumb}
        />
      </div>
      <div className={styles.inputs}>
        <input
          type="number"
          min={min}
          max={range.max - step}
          step={step}
          value={range.min}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className={styles.input}
        />
        <input
          type="number"
          min={range.min + step}
          max={max}
          step={step}
          value={range.max}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className={styles.input}
        />
      </div>
    </div>
  );
}
