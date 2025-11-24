export type Institution = {
  item: string;
  address: string | null;
  coordinate: string | null;
  founded: string | null;
  image: string | null;
  itemLabel: string;
  locationLabel: string | null;
  studentCount: number | null;
  typeLabel: string | null;
  website: string | null;
};

export type InstitutionsResponse = {
  institutions: Institution[];
};

