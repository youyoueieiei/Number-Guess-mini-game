import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

describe('App', () => {
  it('renders solo mode by default and switches to two-player setup', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading', { name: /number guessing game/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /solo mode/i })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /2 players/i }));
    expect(screen.getByRole('heading', { name: /2 player mode/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /player a/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /player b/i })).toBeInTheDocument();
  });
});
