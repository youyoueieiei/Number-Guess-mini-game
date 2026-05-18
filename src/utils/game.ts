import type { GuessFeedback } from '../types';

const DIGIT_COUNT = 10;
const DEFAULT_LENGTH = 4;

export function generateSecret(length = DEFAULT_LENGTH): string {
  return Array.from({ length }, () => Math.floor(Math.random() * DIGIT_COUNT)).join('');
}

export function validateGuess(value: string, length = DEFAULT_LENGTH): string | null {
  if (!/^\d*$/.test(value)) {
    return 'Use digits 0-9 only.';
  }

  if (value.length !== length) {
    return `Enter exactly ${length} digits.`;
  }

  return null;
}

export function isCompleteGuess(value: string, length = DEFAULT_LENGTH): boolean {
  return validateGuess(value, length) === null;
}

export function evaluateGuess(secret: string, guess: string, length?: number): GuessFeedback {
  const lengthUsed = length ?? (guess?.length || secret?.length || DEFAULT_LENGTH);
  const secretError = validateGuess(secret, lengthUsed);
  const guessError = validateGuess(guess, lengthUsed);

  if (secretError) {
    throw new Error(`Invalid secret: ${secretError}`);
  }

  if (guessError) {
    throw new Error(`Invalid guess: ${guessError}`);
  }

  const len = lengthUsed;
  let positionCount = 0;
  const secretCounts = Array<number>(DIGIT_COUNT).fill(0);
  const guessCounts = Array<number>(DIGIT_COUNT).fill(0);

  for (let i = 0; i < len; i += 1) {
    if (secret[i] === guess[i]) {
      positionCount += 1;
    }

    secretCounts[Number(secret[i])] += 1;
    guessCounts[Number(guess[i])] += 1;
  }

  const presentCount = secretCounts.reduce(
    (total, count, digit) => total + Math.min(count, guessCounts[digit]),
    0,
  );

  return { presentCount, positionCount };
}
