import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterItem from '~/components/FilterItem/FilterItem';

describe('FilterItem', () => {
  it('renders label correctly', () => {
    render(<FilterItem label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders count when provided', () => {
    render(<FilterItem label="Test" count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not render count when not provided', () => {
    render(<FilterItem label="Test" />);
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it('calls onChange when checkbox is clicked', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<FilterItem label="Test" onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('shows checked state correctly', () => {
    render(<FilterItem label="Test" checked={true} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('shows unchecked state correctly', () => {
    render(<FilterItem label="Test" checked={false} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });
});

