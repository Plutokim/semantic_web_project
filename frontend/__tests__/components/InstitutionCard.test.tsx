import { render, screen } from '@testing-library/react';
import InstitutionCard from '~/components/InstitutionCard/InstitutionCard';
import type { Institution } from '~/types/institution';

const mockInstitution: Institution = {
  item: 'http://www.wikidata.org/entity/Q123',
  itemLabel: 'Test University',
  locationLabel: 'Kyiv',
  typeLabel: 'University',
  address: 'Test Address',
  coordinate: null,
  founded: '1900',
  image: null,
  studentCount: 1000,
  website: 'https://test.com',
};

describe('InstitutionCard', () => {
  it('renders institution name', () => {
    render(<InstitutionCard institution={mockInstitution} />);
    expect(screen.getByText('Test University')).toBeInTheDocument();
  });

  it('renders location label when provided', () => {
    render(<InstitutionCard institution={mockInstitution} />);
    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('renders type label when provided', () => {
    render(<InstitutionCard institution={mockInstitution} />);
    expect(screen.getByText('University')).toBeInTheDocument();
  });

  it('does not render location when not provided', () => {
    const institutionWithoutLocation = { ...mockInstitution, locationLabel: null };
    render(<InstitutionCard institution={institutionWithoutLocation} />);
    expect(screen.queryByText('Kyiv')).not.toBeInTheDocument();
  });

  it('has correct link href', () => {
    render(<InstitutionCard institution={mockInstitution} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/institution/Q123');
  });
});

