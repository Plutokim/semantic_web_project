import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '~/components/SearchBar/SearchBar';

jest.useFakeTimers();

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Пошук закладів...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('calls onSearchChange after debounce', async () => {
    const handleSearchChange = jest.fn();
    const user = userEvent.setup({ delay: null });
    
    render(<SearchBar onSearchChange={handleSearchChange} />);
    
    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');
    
    expect(handleSearchChange).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(handleSearchChange).toHaveBeenCalledWith('test');
    });
  });

  it('calls onSearchChange immediately when search button is clicked', async () => {
    const handleSearchChange = jest.fn();
    const user = userEvent.setup({ delay: null });
    
    render(<SearchBar onSearchChange={handleSearchChange} />);
    
    const input = screen.getByRole('searchbox');
    const button = screen.getByRole('button', { name: /пошук/i });
    
    await user.type(input, 'test');
    await user.click(button);
    
    expect(handleSearchChange).toHaveBeenCalledWith('test');
  });

  it('calls onSearchChange when Enter is pressed', async () => {
    const handleSearchChange = jest.fn();
    const user = userEvent.setup({ delay: null });
    
    render(<SearchBar onSearchChange={handleSearchChange} />);
    
    const input = screen.getByRole('searchbox');
    await user.type(input, 'test{Enter}');
    
    expect(handleSearchChange).toHaveBeenCalledWith('test');
  });
});

