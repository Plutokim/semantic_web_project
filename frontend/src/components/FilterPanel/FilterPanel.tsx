import FilterItem from "~/components/FilterItem/FilterItem";
import styles from "./FilterPanel.module.css";

export type FilterSection = {
  title: string;
  items: Array<{ label: string; count?: number }>;
};

type FilterPanelProps = {
  sections: FilterSection[];
};

export default function FilterPanel({ sections }: FilterPanelProps) {
  return (
    <aside className={styles.panel}>
      {sections.map((section) => (
        <section key={section.title} className={styles.section}>
          <h3 className={styles.title}>{section.title}</h3>
          <div className={styles.items}>
            {section.items.map((item) => (
              <FilterItem key={`${section.title}-${item.label}`} {...item} />
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}

