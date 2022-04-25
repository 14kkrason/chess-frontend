import { createReducer, on } from '@ngrx/store';
import { endGame, refreshGame, startGame } from '../actions/game-data.action';
import { GameData } from '../models/game-data.model';

export const initialGameState: GameData = {
  isGameGoing: false,
  gameId: null,
  color: null,
};

// TODO: finish game reducer
export const gameReducer = createReducer(
  initialGameState,
  on(startGame, (_state, { isGameGoing, gameId, color }) => {
    return { isGameGoing, gameId, color };
  }),
  on(endGame, (_state) => {
    localStorage.removeItem('gameId');
    localStorage.removeItem('color');
    return initialGameState;
  }),
  on(refreshGame, (_state) => {
    const lsGameId = localStorage.getItem('gameId');
    const lsColor = localStorage.getItem('color');

    if(lsGameId && lsColor) {
      return { isGameGoing: true, gameId: lsGameId, color: lsColor };
    }

    return { isGameGoing: false, gameId: null, color: null };
  })
);
