import { useMemo, useState } from 'react';
import Game from './Game';
import translations from '../i18n';
import { evaluateGuess, generateSecret, validateGuess } from '../utils/game';
import type { GuessRecord } from '../types';

function createSoloSecret(length: number) {
  return generateSecret(length);
}

export default function SoloMode({
  length = 4,
  pendingLength = 4,
  hardMode = false,
  lang = 'en',
  onApplyLength,
}: {
  length?: number;
  pendingLength?: number;
  hardMode?: boolean;
  lang?: 'en' | 'zh';
  onApplyLength?: () => void;
}) {
  const [gameId, setGameId] = useState(0);
  const [guess, setGuess] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null);
  const effectiveLength = length;
  const secret = useMemo(() => createSoloSecret(effectiveLength), [gameId, effectiveLength]);

  function handleGuessChange(value: string) {
    setGuess(value.replace(/\D/g, '').slice(0, effectiveLength));
    setError(null);
  }

  function handleSubmit() {
    const validationError = validateGuess(guess, effectiveLength);
    if (validationError) {
      setError(validationError);
      return;
    }

    const feedback = evaluateGuess(secret, guess, effectiveLength);
    const round = history.length + 1;
    const record: GuessRecord = {
      id: `${gameId}-solo-${round}`,
      guess,
      round,
      player: 'Solo',
      ...feedback,
    };

    const nextHistory = [record, ...history];
    setHistory(nextHistory);
    setGuess('');

    if (feedback.positionCount === effectiveLength) {
      setWinnerMessage(translations[lang].foundSolo(secret, round));
    }
  }

  function resetGame() {
    setGameId((current) => current + 1);
    setGuess('');
    setError(null);
    setHistory([]);
    setWinnerMessage(null);
    // inform parent to apply pending length for new game
    onApplyLength?.();
  }

  return (
    <Game
      title={translations[lang].soloTitle}
      subtitle={translations[lang].description(effectiveLength)}
      guess={guess}
      history={history}
      error={error}
      winnerMessage={winnerMessage}
      onGuessChange={handleGuessChange}
      onSubmit={handleSubmit}
      onReset={resetGame}
      digitLength={effectiveLength}
      hardMode={hardMode}
      lang={lang}
    />
  );
}
