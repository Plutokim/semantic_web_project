"use client";

import { useEffect, useState } from "react";
import { institutionApi, type FiltersResponse, type SearchParams } from "~/api/institutionApi";
import type { Institution } from "~/types/institution";
import MainScreen from "~/screens/MainScreen/MainScreen";

export default function Home() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filters, setFilters] = useState<FiltersResponse>({ locations: [], types: [] });
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilters() {
      const filtersData = await institutionApi.getFilters();
      setFilters(filtersData);
    }
    loadFilters();
  }, []);

  useEffect(() => {
    async function loadInstitutions() {
      setLoading(true);
      const data = await institutionApi.search(searchParams);
      setInstitutions(data);
      setLoading(false);
    }
    loadInstitutions();
  }, [searchParams]);

  const handleSearchChange = (search: string) => {
    setSearchParams((prev) => ({ ...prev, search: search || undefined }));
  };

  const handleCityFilterChange = (cities: string[]) => {
    setSearchParams((prev) => ({ ...prev, city: cities.length > 0 ? cities : undefined }));
  };

  const handleTypeFilterChange = (types: string[]) => {
    setSearchParams((prev) => ({ ...prev, type: types.length > 0 ? types : undefined }));
  };

  return (
    <MainScreen
      institutions={institutions}
      filters={filters}
      loading={loading}
      onSearchChange={handleSearchChange}
      onCityFilterChange={handleCityFilterChange}
      onTypeFilterChange={handleTypeFilterChange}
    />
  );
}
