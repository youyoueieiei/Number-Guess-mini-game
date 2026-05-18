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

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">{translations[lang].eyebrow(length)}</p>
          <h1>{translations[lang].title}</h1>
          <p>{translations[lang].description(length)}</p>
        </div>

        <div className="hero-controls" aria-label="Game options">
          <div className="control-row">
            <span className="control-label" id="hero-label-players">
              Players
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
                {translations[lang].solo}
              </button>
              <button
                className={mode === 'two-player' ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={mode === 'two-player'}
                onClick={() => setMode('two-player')}
              >
                {translations[lang].twoPlayers}
              </button>
            </div>
          </div>

          <div className="control-row">
                <span className="control-label" id="hero-label-digits">
              {translations[lang].digits}
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
              Difficulty
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
                  {translations[lang].easy}
                </button>
                <button
                  className={hardMode ? 'active' : ''}
                  type="button"
                  role="radio"
                  aria-checked={hardMode}
                  onClick={() => setHardMode(true)}
                >
                  {translations[lang].hard}
                </button>
              </div>
              <p className="control-hint">{translations[lang].hardHint}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="top-right-lang">
        <label htmlFor="lang-select" className="control-label" style={{ marginRight: 8 }}>
          Lang
        </label>
        <select
          id="lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value as 'en' | 'zh')}
          aria-label="Language"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>

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
