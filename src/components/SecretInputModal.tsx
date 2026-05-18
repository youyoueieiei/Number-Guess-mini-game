import type { FormEvent } from 'react';
import type { Player } from '../types';
import translations from '../i18n';

interface SecretInputModalProps {
  player: Player;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  lang?: 'en' | 'zh';
}

export default function SecretInputModal({
  player,
  value,
  error,
  onChange,
  onSubmit,
  lang = 'en',
}: SecretInputModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="secret-modal" role="dialog" aria-modal="true" aria-labelledby="secret-title">
        <p className="eyebrow">{translations[lang].difficulty}</p>
        <h2 id="secret-title">{translations[lang].playerEnterGuess(`${player}`)}</h2>
        <p>
          {lang === 'en'
            ? 'Ask the other player to look away. Enter digits from 0-9. Repeated digits are allowed.'
            : '請讓其他玩家移開視線。輸入 0-9 的數字，允許重複。'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="secret-input">Secret number</label>
          <div className="guess-row">
            <input
              id="secret-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              pattern="[0-9]{4}"
              placeholder="0000"
              value={value}
              autoFocus
              onChange={(event) => onChange(event.target.value)}
            />
            <button type="submit">Save secret</button>
          </div>
          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
