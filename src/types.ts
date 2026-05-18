export type Player = 'A' | 'B';

export type GameMode = 'solo' | 'two-player';

export interface GuessFeedback {
  presentCount: number;
  positionCount: number;
}

export interface GuessRecord extends GuessFeedback {
  id: string;
  guess: string;
  round: number;
  player: Player | 'Solo';
}
