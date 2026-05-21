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

  it('allows guesses after both two-player secrets are locked', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('tab', { name: /2 players/i }));
    await user.type(screen.getByLabelText(/player a secret number/i), '1234');
    await user.type(screen.getByLabelText(/player b secret number/i), '6666');

    await user.click(screen.getAllByRole('button', { name: /lock my secret/i })[0]);
    await user.click(screen.getAllByRole('button', { name: /lock my secret/i })[0]);

    await user.type(screen.getByLabelText(/a digit 1/i), '6');
    await user.type(screen.getByLabelText(/a digit 2/i), '6');
    await user.type(screen.getByLabelText(/a digit 3/i), '6');
    await user.type(screen.getByLabelText(/a digit 4/i), '6');
    await user.click(screen.getAllByRole('button', { name: /^guess$/i })[0]);

    expect(screen.queryByText(/target secret not set/i)).not.toBeInTheDocument();
    expect(screen.getByText(/player a guessed player b's number/i)).toBeInTheDocument();
  });
});
