"use client";

import { useState } from "react";
import FilterItem from "~/components/FilterItem/FilterItem";
import styles from "./FilterPanel.module.css";

export type FilterSection = {
  title: string;
  items: Array<{ label: string; count?: number; checked?: boolean }>;
};

type FilterPanelProps = {
  sections: FilterSection[];
  onFilterChange?: (filterType: "city" | "type", label: string, checked: boolean) => void;
};

const ITEMS_PER_PAGE = 5;

export default function FilterPanel({ sections, onFilterChange }: FilterPanelProps) {
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});

  const showMore = (sectionTitle: string) => {
    setVisibleCount((prev) => ({
      ...prev,
      [sectionTitle]: (prev[sectionTitle] || ITEMS_PER_PAGE) + ITEMS_PER_PAGE,
    }));
  };

  return (
    <aside className={styles.panel}>
      {sections.map((section) => {
        const filterType = section.title === "Місто" ? "city" : "type";
        const currentVisible = visibleCount[section.title] || ITEMS_PER_PAGE;
        const visibleItems = section.items.slice(0, currentVisible);
        const hasMore = section.items.length > currentVisible;

        return (
          <section key={section.title} className={styles.section}>
            <h3 className={styles.title}>{section.title}</h3>
            <div className={styles.items}>
              {visibleItems.map((item, index) => {
                const label = typeof item.label === 'string' ? item.label : String(item.label || '');
                return (
                  <FilterItem
                    key={`${section.title}-${label}-${index}`}
                    label={label}
                    count={item.count}
                    checked={item.checked}
                    onChange={(checked) =>
                      onFilterChange?.(filterType, label, checked)
                    }
                  />
                );
              })}
            </div>
            {hasMore && (
              <button
                className={styles.showMoreButton}
                onClick={() => showMore(section.title)}
              >
                Показати ще ({section.items.length - currentVisible})
              </button>
            )}
          </section>
        );
      })}
    </aside>
  );
}

