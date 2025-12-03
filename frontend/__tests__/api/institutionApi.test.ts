import { institutionApi } from '~/api/institutionApi';
import type { Institution } from '~/types/institution';

global.fetch = jest.fn();

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('InstitutionApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (console.error as jest.Mock).mockClear();
  });

  describe('all', () => {
    it('fetches all institutions successfully', async () => {
      const mockInstitutions: Institution[] = [
        {
          item: 'http://www.wikidata.org/entity/Q123',
          itemLabel: 'Test University',
          locationLabel: 'Kyiv',
          typeLabel: 'University',
          address: null,
          coordinate: null,
          founded: null,
          image: null,
          studentCount: null,
          website: null,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ institutions: mockInstitutions }),
      });

      const result = await institutionApi.all();
      expect(result).toEqual(mockInstitutions);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/institutions',
        expect.objectContaining({
          cache: 'no-store',
        })
      );
    });

    it('returns empty array on error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await institutionApi.all();
      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('searches with query parameters', async () => {
      const mockInstitutions: Institution[] = [];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ institutions: mockInstitutions }),
      });

      await institutionApi.search({ search: 'test', city: ['Q1'], type: ['Q2'] });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('city=Q1'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('type=Q2'),
        expect.any(Object)
      );
    });

    it('handles empty search params', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ institutions: [] }),
      });

      await institutionApi.search();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/institutions',
        expect.any(Object)
      );
    });
  });

  describe('getById', () => {
    it('fetches institution by id successfully', async () => {
      const mockInstitution: Institution = {
        item: 'http://www.wikidata.org/entity/Q123',
        itemLabel: 'Test University',
        locationLabel: null,
        typeLabel: null,
        address: null,
        coordinate: null,
        founded: null,
        image: null,
        studentCount: null,
        website: null,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ institution: mockInstitution }),
      });

      const result = await institutionApi.getById('Q123');
      expect(result).toEqual(mockInstitution);
    });

    it('handles array response from backend', async () => {
      const mockInstitution: Institution = {
        item: 'http://www.wikidata.org/entity/Q123',
        itemLabel: 'Test University',
        locationLabel: null,
        typeLabel: null,
        address: null,
        coordinate: null,
        founded: null,
        image: null,
        studentCount: null,
        website: null,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ institution: [mockInstitution] }),
      });

      const result = await institutionApi.getById('Q123');
      expect(result).toEqual(mockInstitution);
    });

    it('returns null for 404', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await institutionApi.getById('Q999');
      expect(result).toBeNull();
    });
  });

  describe('getFilters', () => {
    it('fetches filters successfully', async () => {
      const mockFilters = {
        locations: [{ id: 'Q1', label: 'Kyiv' }],
        types: [{ id: 'Q2', label: 'University' }],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFilters,
      });

      const result = await institutionApi.getFilters();
      expect(result).toEqual(mockFilters);
    });

    it('returns empty filters on error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await institutionApi.getFilters();
      expect(result).toEqual({ locations: [], types: [] });
    });
  });
});

