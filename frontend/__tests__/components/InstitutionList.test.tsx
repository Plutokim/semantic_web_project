import { render, screen } from '@testing-library/react';
import InstitutionList from '~/components/InstitutionList/InstitutionList';
import type { Institution } from '~/types/institution';

const mockInstitutions: Institution[] = [
  {
    item: 'http://www.wikidata.org/entity/Q1',
    itemLabel: 'University 1',
    locationLabel: 'Kyiv',
    typeLabel: 'University',
    address: null,
    coordinate: null,
    founded: null,
    image: null,
    studentCount: null,
    website: null,
  },
  {
    item: 'http://www.wikidata.org/entity/Q2',
    itemLabel: 'University 2',
    locationLabel: 'Lviv',
    typeLabel: 'College',
    address: null,
    coordinate: null,
    founded: null,
    image: null,
    studentCount: null,
    website: null,
  },
];

describe('InstitutionList', () => {
  it('renders list of institutions', () => {
    render(<InstitutionList institutions={mockInstitutions} />);
    expect(screen.getByText('University 1')).toBeInTheDocument();
    expect(screen.getByText('University 2')).toBeInTheDocument();
  });

  it('renders empty state when no institutions', () => {
    render(<InstitutionList institutions={[]} />);
    expect(screen.getByText(/Заклади не знайдено/i)).toBeInTheDocument();
  });

  it('renders all institution cards', () => {
    render(<InstitutionList institutions={mockInstitutions} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});

