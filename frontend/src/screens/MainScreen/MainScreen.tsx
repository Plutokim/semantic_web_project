/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import FilterPanel, {
  type FilterSection,
} from "~/components/FilterPanel/FilterPanel";
import InstitutionList from "~/components/InstitutionList/InstitutionList";
import SearchBar from "~/components/SearchBar/SearchBar";
import type { Institution } from "~/types/institution";
import type { FiltersResponse } from "~/api/institutionApi";
import styles from "./MainScreen.module.css";

type MainScreenProps = {
  institutions: Institution[];
  filters: FiltersResponse;
  loading?: boolean;
  onSearchChange: (search: string) => void;
  onCityFilterChange: (cities: string[]) => void;
  onTypeFilterChange: (types: string[]) => void;
};

const ITEMS_PER_PAGE = 12;

export default function MainScreen({
  institutions,
  filters,
  loading = false,
  onSearchChange,
  onCityFilterChange,
  onTypeFilterChange,
}: MainScreenProps) {
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filterSections: FilterSection[] = useMemo(() => {
    const sections: FilterSection[] = [];

    const validTypes = filters.types
      .map((type) => {
        if (typeof type === 'string') {
          return { id: type, label: type };
        }
        if (type && typeof type === 'object' && type.id && type.label) {
          return type;
        }
        return null;
      })
      .filter((type): type is { id: string; label: string } => type !== null);

    if (validTypes.length > 0) {
      sections.push({
        title: "Тип закладу",
        items: validTypes.map((type) => ({
          label: type.label,
          checked: selectedTypeIds.includes(type.id),
        })),
      });
    }

    const validLocations = filters.locations
      .map((location) => {
        if (typeof location === 'string') {
          return { id: location, label: location };
        }
        if (location && typeof location === 'object' && location.id && location.label) {
          return location;
        }
        return null;
      })
      .filter((location): location is { id: string; label: string } => location !== null);

    if (validLocations.length > 0) {
      sections.push({
        title: "Місто",
        items: validLocations.map((location) => ({
          label: location.label,
          checked: selectedCityIds.includes(location.id),
        })),
      });
    }

    return sections;
  }, [filters, selectedCityIds, selectedTypeIds]);

  const handleFilterChange = (
    filterType: "city" | "type",
    label: string,
    checked: boolean
  ) => {
    if (filterType === "city") {
      const location = filters.locations.find((loc) => loc.label === label);
      if (!location) return;

      const newCityIds = checked
        ? [...selectedCityIds, location.id]
        : selectedCityIds.filter((id) => id !== location.id);
      setSelectedCityIds(newCityIds);
      onCityFilterChange(newCityIds);
    } else {
      const type = filters.types.find((t) => t.label === label);
      if (!type) return;

      const newTypeIds = checked
        ? [...selectedTypeIds, type.id]
        : selectedTypeIds.filter((id) => id !== type.id);
      setSelectedTypeIds(newTypeIds);
      onTypeFilterChange(newTypeIds);
    }
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [institutions.length]);


  const totalPages = Math.ceil(institutions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedInstitutions = institutions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.layout}>
        <div className={styles.filters}>
          <FilterPanel
            sections={filterSections}
            onFilterChange={handleFilterChange}
          />
        </div>
        <section className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Довідник з навчальних закладів України
            </h1>
          </header>
          <SearchBar onSearchChange={onSearchChange} />
          {loading ? (
            <div className={styles.loading}>Завантаження...</div>
          ) : (
            <>
              <InstitutionList institutions={paginatedInstitutions} />
              {institutions.length > ITEMS_PER_PAGE && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Попередня сторінка"
                  >
                    ← Попередня
                  </button>
                  <div className={styles.paginationInfo}>
                    <span className={styles.paginationText}>
                      Сторінка {currentPage} з {totalPages}
                    </span>
                    <span className={styles.paginationCount}>
                      Показано {startIndex + 1}-{Math.min(endIndex, institutions.length)} з {institutions.length}
                    </span>
                  </div>
                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Наступна сторінка"
                  >
                    Наступна →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

