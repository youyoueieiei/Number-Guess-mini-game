const translations = {
  en: {
    eyebrow: (n: number) => `${n}-digit code breaker`,
    title: 'Number Guessing Game',
    description: (n: number) => `Guess a ${n} digit secret number. Repeated digits are allowed, and every guess shows how many digits are present plus how many are in the right place.`,
    players: 'Players',
    digits: 'Digits',
    difficulty: 'Difficulty',
    hardHint: 'Hard = position count only (number of digits in the correct position).',
    feedbackLabelEasy: 'present / position',
    solo: 'Solo',
    twoPlayers: '2 players',
    easy: 'Easy',
    hard: 'Hard',
    newGame: 'New game',
    yourGuess: 'Your guess',
    playerEnterGuess: (p: string) => `Player ${p}, enter your guess`,
    guessHistory: 'Guess history',
    noGuesses: (n: number) => `No guesses yet. Try a ${n} digit number to start.`,
    secretMaskedLabel: 'Secret number (masked)',
    guessLabel: (target: string) => `Guess ${target}'s number`,
    foundSolo: (secret: string, rounds: number, lang?: string) =>
      `You found ${secret} in ${rounds} round${rounds === 1 ? '' : 's'}!`,
    foundTwoPlayer: (player: string, target: string, rounds: number) =>
      `Player ${player} guessed Player ${target}'s number in ${rounds} round${rounds === 1 ? '' : 's'}!`,
  },
  zh: {
    eyebrow: (n: number) => `${n} 位數碼破譯`,
    title: '數字猜謎遊戲',
    description: (n: number) => `猜一個 ${n} 位數的秘密數字。可重複數字，每次猜測會顯示有多少數字存在，以及多少位置正確。`,
    players: '人數',
    digits: '位數',
    difficulty: '難度',
    hardHint: 'Hard：只顯示「正確位置」的個數（在正確位置上的數字個數）。',
    feedbackLabelEasy: '存在 / 位置',
    solo: '單人',
    twoPlayers: '雙人',
    easy: '簡單',
    hard: '困難',
    newGame: '新遊戲',
    yourGuess: '你的猜測',
    playerEnterGuess: (p: string) => `玩家 ${p}，輸入你的猜測`,
    guessHistory: '猜測紀錄',
    noGuesses: (n: number) => `尚未有猜測。請輸入 ${n} 位數字開始。`,
    secretMaskedLabel: '祕密數字（隱藏）',
    guessLabel: (target: string) => `猜測 ${target} 的數字`,
    foundSolo: (secret: string, rounds: number) => `你在 ${rounds} 回合內找到了 ${secret}！`,
    foundTwoPlayer: (player: string, target: string, rounds: number) =>
      `玩家 ${player} 在 ${rounds} 回合內猜中玩家 ${target} 的數字！`,
  },
};

export default translations;

