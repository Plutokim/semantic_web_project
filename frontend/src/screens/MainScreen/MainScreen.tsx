import FilterPanel, {
  type FilterSection,
} from "~/components/FilterPanel/FilterPanel";
import InstitutionList from "~/components/InstitutionList/InstitutionList";
import SearchBar from "~/components/SearchBar/SearchBar";
import StudentRangeFilter from "~/components/StudentRangeFilter/StudentRangeFilter";
import type { Institution } from "~/types/institution";
import styles from "./MainScreen.module.css";

type MainScreenProps = {
  institutions: Institution[];
};

const BASE_FILTER_SECTIONS: FilterSection[] = [
  {
    title: "Тип закладу",
    items: [
      { label: "Університет" },
      { label: "Інститут" },
      { label: "Коледж" },
      { label: "Технічна школа" },
    ],
  },
  {
    title: "Місто",
    items: [
      { label: "Київ" },
      { label: "Львів" },
      { label: "Харків" },
      { label: "Одеса" },
    ],
  },
];

export default function MainScreen({ institutions }: MainScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.layout}>
        <div className={styles.filters}>
          <FilterPanel sections={BASE_FILTER_SECTIONS} />
          <section className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Кількість студентів</h3>
            <StudentRangeFilter min={0} max={20000} step={500} />
          </section>
        </div>
        <section className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Довідник з навчальних закладів України
            </h1>
          </header>
          <SearchBar />
          <InstitutionList institutions={institutions} />
        </section>
      </div>
    </div>
  );
}

