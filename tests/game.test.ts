import { evaluateGuess, generateSecret, validateGuess } from '../src/utils/game';

describe('validateGuess', () => {
  it('accepts exactly four digits', () => {
    expect(validateGuess('0000', 4)).toBeNull();
    expect(validateGuess('9876', 4)).toBeNull();
  });

  it('rejects guesses with the wrong length', () => {
    expect(validateGuess('123', 4)).toBe('Enter exactly 4 digits.');
    expect(validateGuess('12345', 4)).toBe('Enter exactly 4 digits.');
  });

  it('rejects non-digit characters', () => {
    expect(validateGuess('12a4', 4)).toBe('Use digits 0-9 only.');
  });
});

describe('evaluateGuess', () => {
  it('counts all digits and exact positions', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ presentCount: 4, positionCount: 4 });
  });

  it('counts present digits even when positions are wrong', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ presentCount: 4, positionCount: 0 });
  });

  it('handles repeated digits in the secret and guess', () => {
    expect(evaluateGuess('1123', '1211')).toEqual({ presentCount: 3, positionCount: 1 });
    expect(evaluateGuess('5551', '1555')).toEqual({ presentCount: 4, positionCount: 2 });
  });

  it('does not over-count duplicate guesses', () => {
    expect(evaluateGuess('1000', '1111')).toEqual({ presentCount: 1, positionCount: 1 });
    expect(evaluateGuess('2211', '2222')).toEqual({ presentCount: 2, positionCount: 2 });
  });

  it('throws when values are invalid', () => {
    expect(() => evaluateGuess('123', '1234')).toThrow('Invalid secret');
    expect(() => evaluateGuess('1234', '12x4')).toThrow('Invalid guess');
  });
});

describe('generateSecret', () => {
  it('generates four numeric digits', () => {
    expect(generateSecret()).toMatch(/^\d{4}$/);
  });

  it('generates five and six digit secrets when requested', () => {
    expect(generateSecret(5)).toMatch(/^\d{5}$/);
    expect(generateSecret(6)).toMatch(/^\d{6}$/);
  });
});
