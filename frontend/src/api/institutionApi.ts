import type { Institution, InstitutionsResponse } from "~/types/institution";

class InstitutionApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8080") {
    this.baseUrl = baseUrl;
  }

  async all(): Promise<Institution[]> {
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
  }
}

export const institutionApi = new InstitutionApi();

