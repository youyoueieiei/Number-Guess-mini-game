import { useRef, useEffect } from 'react';
import translations from '../i18n';
import type { FormEvent, ReactNode } from 'react';
import type { GuessRecord, Player } from '../types';

interface GameProps {
  title: string;
  subtitle: string;
  guess: string;
  history: GuessRecord[];
  error: string | null;
  disabled?: boolean;
  currentPlayer?: Player | 'Solo';
  winnerMessage?: string | null;
  extraContent?: ReactNode;
  digitLength?: number;
  hardMode?: boolean;
  lang?: 'en' | 'zh';
  onGuessChange: (guess: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export default function Game({
  title,
  subtitle,
  guess,
  history,
  error,
  disabled = false,
  currentPlayer = 'Solo',
  winnerMessage,
  extraContent,
  digitLength,
  hardMode = false,
  lang = 'en',
  onGuessChange,
  onSubmit,
  onReset,
}: GameProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dl = digitLength ?? 4;
  const t = (translations as any)[lang];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="game-card">
        <div className="game-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button className="secondary-button" type="button" onClick={onReset}>
          {t.newGame}
        </button>
      </div>

      {extraContent}

      {winnerMessage ? (
        <div className="winner-banner" role="status">
          {winnerMessage}
        </div>
      ) : null}

      <form className="guess-form" onSubmit={handleSubmit}>
        <label htmlFor="guess-input">
          {currentPlayer === 'Solo' ? 'Your guess' : `Player ${currentPlayer}, enter your guess`}
        </label>
        <div className="guess-row">
        <div className="digit-input" role="group" aria-label={`${dl} digit input`}>
            {Array.from({ length: dl }).map((_, i) => {
              const val = guess[i] ?? '';
              return (
                <input
                  key={i}
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  className="digit-box digit-input-field"
                  value={val}
                  disabled={disabled || Boolean(winnerMessage)}
                  aria-label={`digit ${i + 1}`}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(-1);
                    const arr = Array.from({ length: dl }).map((__, idx) => (guess[idx] ?? ''));
                    arr[i] = v;
                    onGuessChange(arr.join(''));
                    if (v && i < dl - 1) {
                      inputRefs.current[i + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (key === 'Backspace') {
                      if (!guess[i] && i > 0) {
                        const arr = Array.from({ length: dl }).map((__, idx) => (guess[idx] ?? ''));
                        arr[i - 1] = '';
                        onGuessChange(arr.join(''));
                        inputRefs.current[i - 1]?.focus();
                        e.preventDefault();
                      }
                    } else if (key === 'ArrowLeft' && i > 0) {
                      inputRefs.current[i - 1]?.focus();
                      e.preventDefault();
                    } else if (key === 'ArrowRight' && i < 3) {
                      if (i < dl - 1) inputRefs.current[i + 1]?.focus();
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData('text').replace(/\D/g, '');
                    if (!paste) return;
                    const arr = Array.from({ length: dl }).map((__, idx) => (guess[idx] ?? ''));
                    for (let j = 0; j < paste.length && i + j < dl; j += 1) {
                      arr[i + j] = paste[j];
                    }
                    onGuessChange(arr.join(''));
                    const next = Math.min(dl - 1, i + paste.length);
                    setTimeout(() => inputRefs.current[next]?.focus(), 0);
                    e.preventDefault();
                  }}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                />
              );
            })}
          </div>
          <button type="submit" disabled={disabled || Boolean(winnerMessage)}>
            Guess
          </button>
        </div>
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      <section className="history-panel" aria-label="Guess history">
        <div className="history-title">
          <h3>Guess history</h3>
          <span>{history.length} guesses</span>
        </div>

        {history.length === 0 ? (
          <p className="empty-state">No guesses yet. Try a {dl} digit number to start.</p>
        ) : (
          <ol className="history-list">
            {history.map((record) => (
              <li key={record.id}>
                <div className="guess-value">
                  {Array.from({ length: dl }).map((_, i) => (
                    <span
                      key={i}
                      className="guess-digit"
                      data-empty={record.guess[i] ? 'false' : 'true'}
                    >
                      {record.guess[i] ?? ''}
                    </span>
                  ))}
                </div>
                <div>{record.player === 'Solo' ? `Round ${record.round}` : `Player ${record.player}`}</div>
                <div className="feedback-column">
                  {!hardMode ? (
                    <div className="feedback-label" aria-hidden="true">
                      {t.feedbackLabelEasy}
                    </div>
                  ) : null}
                  <div className="feedback" aria-hidden={hardMode ? 'true' : 'false'}>
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
