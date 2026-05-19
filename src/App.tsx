import { useState } from 'react';
import SoloMode from './components/SoloMode';
import TwoPlayerMode from './components/TwoPlayerMode';
import translations from './i18n';
import type { GameMode } from './types';

export default function App() {
  const [mode, setMode] = useState<GameMode>('solo');
  // pendingLength = what the header controls currently select
  const [pendingLength, setPendingLength] = useState(4);
  // activeLength = length used by the current running game; only updated when user starts a new game
  const [activeLength, setActiveLength] = useState(4);
  const [hardMode, setHardMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const t = translations[lang];
  const hasPendingLength = pendingLength !== activeLength;

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">{t.eyebrow(activeLength)}</p>
          <h1>{t.title}</h1>
          <p>{t.description(activeLength)}</p>
          <div className="length-status" aria-live="polite">
            <span>{t.currentLength(activeLength)}</span>
            {hasPendingLength ? (
              <>
                <span>{t.nextLength(pendingLength)}</span>
                <small>{t.lengthPending}</small>
              </>
            ) : null}
          </div>
        </div>

        <div className="hero-controls" aria-label={t.gameOptions}>
          <div className="control-row">
            <span className="control-label" id="hero-label-players">
              {t.players}
            </span>
            <div
              className="segmented segmented--players"
              role="tablist"
              aria-labelledby="hero-label-players"
            >
              <button
                className={mode === 'solo' ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={mode === 'solo'}
                onClick={() => setMode('solo')}
              >
                {t.solo}
              </button>
              <button
                className={mode === 'two-player' ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={mode === 'two-player'}
                onClick={() => setMode('two-player')}
              >
                {t.twoPlayers}
              </button>
            </div>
          </div>

          <div className="control-row">
            <span className="control-label" id="hero-label-digits">
              {t.digits}
            </span>
            <div
              className="segmented segmented--digits"
              role="radiogroup"
              aria-labelledby="hero-label-digits"
            >
              {[4, 5, 6].map((n) => (
                <button
                  key={n}
                  className={pendingLength === n ? 'active' : ''}
                  type="button"
                  role="radio"
                  aria-checked={pendingLength === n}
                  onClick={() => setPendingLength(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="control-row">
            <span className="control-label" id="hero-label-difficulty">
              {t.difficulty}
            </span>
            <div className="control-col">
              <div
                className="segmented segmented--difficulty"
                role="radiogroup"
                aria-labelledby="hero-label-difficulty"
              >
                <button
                  className={!hardMode ? 'active' : ''}
                  type="button"
                  role="radio"
                  aria-checked={!hardMode}
                  onClick={() => setHardMode(false)}
                >
                  {t.easy}
                </button>
                <button
                  className={hardMode ? 'active' : ''}
                  type="button"
                  role="radio"
                  aria-checked={hardMode}
                  onClick={() => setHardMode(true)}
                >
                  {t.hard}
                </button>
              </div>
              <p className="control-hint">{t.hardHint}</p>
            </div>
          </div>

          <div className="control-row">
            <span className="control-label" id="hero-label-language">
              {t.language}
            </span>
            <div
              className="segmented segmented--language"
              role="radiogroup"
              aria-labelledby="hero-label-language"
            >
              <button
                className={lang === 'en' ? 'active' : ''}
                type="button"
                role="radio"
                aria-checked={lang === 'en'}
                onClick={() => setLang('en')}
              >
                English
              </button>
              <button
                className={lang === 'zh' ? 'active' : ''}
                type="button"
                role="radio"
                aria-checked={lang === 'zh'}
                onClick={() => setLang('zh')}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </section>

      {mode === 'solo' ? (
        <SoloMode
          length={activeLength}
          pendingLength={pendingLength}
          hardMode={hardMode}
          lang={lang}
          onApplyLength={() => setActiveLength(pendingLength)}
        />
      ) : (
        <TwoPlayerMode
          length={activeLength}
          pendingLength={pendingLength}
          hardMode={hardMode}
          lang={lang}
          onApplyLength={() => setActiveLength(pendingLength)}
        />
      )}
    </main>
  );
}
