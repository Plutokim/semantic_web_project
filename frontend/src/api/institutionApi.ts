import type { Institution, InstitutionsResponse } from "~/types/institution";

export type FilterItem = {
  id: string;
  label: string;
};

export type FiltersResponse = {
  locations: FilterItem[];
  types: FilterItem[];
};

export type SearchParams = {
  search?: string;
  city?: string[];
  type?: string[];
};

class InstitutionApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8080") {
    this.baseUrl = baseUrl;
  }

  async all(): Promise<Institution[]> {
    try {
      const response = await fetch(`${this.baseUrl}/institutions`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to load institutions", response.status);
        return [];
      }

      const data: InstitutionsResponse = await response.json();
      return data?.institutions ?? [];
    } catch (error) {
      console.error("Network error while loading institutions:", error);
      return [];
    }
  }

  async search(params: SearchParams = {}): Promise<Institution[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) {
        queryParams.append("search", params.search);
      }
      
      if (params.city && params.city.length > 0) {
        queryParams.append("city", params.city.join(","));
      }
      
      if (params.type && params.type.length > 0) {
        queryParams.append("type", params.type.join(","));
      }

      const url = `${this.baseUrl}/institutions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to search institutions", response.status);
        return [];
      }

      const data: InstitutionsResponse = await response.json();
      return data?.institutions ?? [];
    } catch (error) {
      console.error("Network error while searching institutions:", error);
      return [];
    }
  }

  async getById(itemId: string): Promise<Institution | null> {
    try {
      const response = await fetch(`${this.baseUrl}/institutions/${itemId}`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        console.error("Failed to load institution", response.status);
        return null;
      }

      const data: { institution: Institution | Institution[] } = await response.json();
      
      if (Array.isArray(data.institution)) {
        return data.institution.length > 0 ? data.institution[0] : null;
      }
      
      return data?.institution ?? null;
    } catch (error) {
      console.error("Network error while loading institution:", error);
      return null;
    }
  }

  async getFilters(): Promise<FiltersResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/filters`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to load filters", response.status);
        return { locations: [], types: [] };
      }

      const data: FiltersResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Network error while loading filters:", error);
      return { locations: [], types: [] };
    }
  }
}

export const institutionApi = new InstitutionApi();

