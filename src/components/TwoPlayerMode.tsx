import { useMemo, useRef, useState } from 'react';
import translations from '../i18n';
import { evaluateGuess, validateGuess } from '../utils/game';
import type { GuessRecord, Player } from '../types';

export default function TwoPlayerMode({
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
  const [secrets, setSecrets] = useState<Record<Player, string>>({ A: '', B: '' });
  const [secretErrors, setSecretErrors] = useState<Record<Player, string | null>>({ A: null, B: null });
  const [guesses, setGuesses] = useState<Record<Player, string>>({ A: '', B: '' });
  const [guessErrors, setGuessErrors] = useState<Record<Player, string | null>>({ A: null, B: null });
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null);

  const playerRounds = useMemo(
    () => ({
      A: history.filter((record) => record.player === 'A').length,
      B: history.filter((record) => record.player === 'B').length,
    }),
    [history],
  );

  const notStarted = history.length === 0 && !secrets.A && !secrets.B && !guesses.A && !guesses.B;
  const effectiveLen = notStarted ? pendingLength : length;
  const t = translations[lang];

  function cleanDigits(value: string, len: number) {
    return value.replace(/\D/g, '').slice(0, len);
  }

  function setSecret(player: Player, value: string, effectiveLen: number) {
    const v = cleanDigits(value, effectiveLen);
    setSecrets((s) => ({ ...s, [player]: v }));
    setSecretErrors((e) => ({ ...e, [player]: null }));
  }

  function setGuess(player: Player, value: string, effectiveLen: number) {
    const v = cleanDigits(value, effectiveLen);
    setGuesses((g) => ({ ...g, [player]: v }));
    setGuessErrors((e) => ({ ...e, [player]: null }));
  }

  const inputRefsA = useRef<Array<HTMLInputElement | null>>([]);
  const inputRefsB = useRef<Array<HTMLInputElement | null>>([]);

  function submitGuess(player: Player) {
    const effectiveLen = (!history.length && !secrets.A && !secrets.B && !guesses.A && !guesses.B) ? pendingLength : length;
    const guess = guesses[player];
    const validationError = validateGuess(guess, effectiveLen);
    if (validationError) {
      setGuessErrors((e) => ({ ...e, [player]: validationError }));
      return;
    }

    const target: Player = player === 'A' ? 'B' : 'A';
    const targetSecret = secrets[target];
    if (!validateGuess(targetSecret, effectiveLen)) {
      setGuessErrors((e) => ({ ...e, [player]: t.targetSecretNotSet }));
      return;
    }

    const feedback = evaluateGuess(targetSecret, guess, effectiveLen);
    const round = playerRounds[player] + 1;
    const record: GuessRecord = {
      id: `${gameId}-${player}-${history.length + 1}`,
      guess,
      round,
      player,
      ...feedback,
    };

    setHistory((h) => [record, ...h]);
    setGuesses((g) => ({ ...g, [player]: '' }));

    if (feedback.positionCount === effectiveLen) {
      setWinnerMessage(t.foundTwoPlayer(player, target, round));
    }
  }

  function resetGame() {
    setGameId((c) => c + 1);
    setSecrets({ A: '', B: '' });
    setSecretErrors({ A: null, B: null });
    setGuesses({ A: '', B: '' });
    setGuessErrors({ A: null, B: null });
    setHistory([]);
    setWinnerMessage(null);
    onApplyLength?.();
  }

  return (
    <section className="game-card two-player-vertical">
      <div className="game-header">
        <div>
          <h2>{t.twoPlayerTitle}</h2>
          <p>{t.twoPlayerSubtitle}</p>
        </div>
        <button className="secondary-button" type="button" onClick={resetGame}>
          {t.newGame}
        </button>
      </div>

      {winnerMessage ? <div className="winner-banner">{winnerMessage}</div> : null}

      <div className="two-player-stack">
        <div className="player-panel player-a">
          <h3>{t.playerLabel('A')}</h3>
          <label>{t.secretMaskedLabel}</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={effectiveLen}
            value={secrets.A}
            onChange={(e) => setSecret('A', e.target.value, effectiveLen)}
            placeholder={Array.from({ length: effectiveLen }).map(() => '•').join('')}
          />
          {secretErrors.A ? <div className="error">{secretErrors.A}</div> : null}

          <label className="stacked-label">{t.guessLabel('B')}</label>
          <div className="guess-row">
            <div className="digit-input" role="group" aria-label={`${effectiveLen} digit input A`}>
              {Array.from({ length: effectiveLen }).map((_, i) => {
                const val = guesses.A[i] ?? '';
                return (
                  <input
                    key={i}
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    className="digit-box digit-input-field"
                    value={val}
                    aria-label={`A digit ${i + 1}`}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(-1);
                      const arr = Array.from({ length: effectiveLen }).map((__, idx) => (guesses.A[idx] ?? ''));
                      arr[i] = v;
                      setGuesses((g) => ({ ...g, A: arr.join('') }));
                      setGuessErrors((e) => ({ ...e, A: null }));
                      if (v && i < effectiveLen - 1) inputRefsA.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      const key = e.key;
                      if (key === 'Backspace') {
                        if (!guesses.A[i] && i > 0) {
                          const arr = Array.from({ length: effectiveLen }).map((__, idx) => (guesses.A[idx] ?? ''));
                          arr[i - 1] = '';
                          setGuesses((g) => ({ ...g, A: arr.join('') }));
                          inputRefsA.current[i - 1]?.focus();
                          e.preventDefault();
                        }
                      } else if (key === 'ArrowLeft' && i > 0) {
                        inputRefsA.current[i - 1]?.focus();
                        e.preventDefault();
                      } else if (key === 'ArrowRight' && i < effectiveLen - 1) {
                        inputRefsA.current[i + 1]?.focus();
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData('text').replace(/\D/g, '');
                      if (!paste) return;
                      const arr = Array.from({ length: effectiveLen }).map((__, idx) => (guesses.A[idx] ?? ''));
                      for (let j = 0; j < paste.length && i + j < effectiveLen; j += 1) {
                        arr[i + j] = paste[j];
                      }
                      setGuesses((g) => ({ ...g, A: arr.join('') }));
                      const next = Math.min(effectiveLen - 1, i + paste.length);
                      setTimeout(() => inputRefsA.current[next]?.focus(), 0);
                      e.preventDefault();
                    }}
                    ref={(el) => {
                      inputRefsA.current[i] = el;
                    }}
                  />
                );
              })}
            </div>
            <button type="button" onClick={() => submitGuess('A')}>
              {t.guess}
            </button>
          </div>
          {guessErrors.A ? <div className="error">{guessErrors.A}</div> : null}
        </div>

        <div className="player-panel player-b">
          <h3>{t.playerLabel('B')}</h3>
          <label>{t.secretMaskedLabel}</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={effectiveLen}
            value={secrets.B}
            onChange={(e) => setSecret('B', e.target.value, effectiveLen)}
            placeholder={Array.from({ length: effectiveLen }).map(() => '•').join('')}
          />
          {secretErrors.B ? <div className="error">{secretErrors.B}</div> : null}

          <label className="stacked-label">{t.guessLabel('A')}</label>
          <div className="guess-row">
            <div className="digit-input" role="group" aria-label={`${effectiveLen} digit input B`}>
              {Array.from({ length: effectiveLen }).map((_, i) => {
                const val = guesses.B[i] ?? '';
                return (
                  <input
                    key={i}
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    className="digit-box digit-input-field"
                    value={val}
                    aria-label={`B digit ${i + 1}`}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(-1);
                      const arr = Array.from({ length: effectiveLen }).map((__, idx) => (guesses.B[idx] ?? ''));
                      arr[i] = v;
                      setGuesses((g) => ({ ...g, B: arr.join('') }));
                      setGuessErrors((e) => ({ ...e, B: null }));
                      if (v && i < effectiveLen - 1) inputRefsB.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      const key = e.key;
                      if (key === 'Backspace') {
                        if (!guesses.B[i] && i > 0) {
                          const arr = Array.from({ length: effectiveLen }).map((__, idx) => (guesses.B[idx] ?? ''));
                          arr[i - 1] = '';
                          setGuesses((g) => ({ ...g, B: arr.join('') }));
                          inputRefsB.current[i - 1]?.focus();
                          e.preventDefault();
                        }
                      } else if (key === 'ArrowLeft' && i > 0) {
                        inputRefsB.current[i - 1]?.focus();
                        e.preventDefault();
                      } else if (key === 'ArrowRight' && i < effectiveLen - 1) {
                        inputRefsB.current[i + 1]?.focus();
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData('text').replace(/\D/g, '');
                      if (!paste) return;
                      const arr = Array.from({ length: effectiveLen }).map((__, idx) => (guesses.B[idx] ?? ''));
                      for (let j = 0; j < paste.length && i + j < effectiveLen; j += 1) {
                        arr[i + j] = paste[j];
                      }
                      setGuesses((g) => ({ ...g, B: arr.join('') }));
                      const next = Math.min(effectiveLen - 1, i + paste.length);
                      setTimeout(() => inputRefsB.current[next]?.focus(), 0);
                      e.preventDefault();
                    }}
                    ref={(el) => {
                      inputRefsB.current[i] = el;
                    }}
                  />
                );
              })}
            </div>
            <button type="button" onClick={() => submitGuess('B')}>
              {t.guess}
            </button>
          </div>
          {guessErrors.B ? <div className="error">{guessErrors.B}</div> : null}
        </div>
      </div>

      <section className="history-panel" aria-label="Guess history">
        <div className="history-title">
          <h3>{t.guessHistory}</h3>
          <span>{t.guesses(history.length)}</span>
        </div>

        {history.length === 0 ? (
          <p className="empty-state">{t.noGuessesShort}</p>
        ) : (
          <ol className="history-list">
            {history.map((record) => (
              <li key={record.id}>
                <div className="guess-value">
                  {Array.from({ length: record.guess.length || effectiveLen }).map((_, i) => (
                    <span key={i} className="guess-digit">
                      {record.guess[i] ?? ''}
                    </span>
                  ))}
                </div>
                <div>{t.playerLabel(record.player)}</div>
                <div className="feedback-column">
                  {!hardMode ? (
                    <div className="feedback-label" aria-hidden="true">
                      {t.feedbackLabelEasy}
                    </div>
                  ) : null}
                  <div className="feedback">
                    {hardMode ? `${record.positionCount}` : `${record.presentCount} / ${record.positionCount}`}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  );
}
