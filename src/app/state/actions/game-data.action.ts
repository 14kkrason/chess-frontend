import { createAction, props } from '@ngrx/store';
import { GameData } from '../models/game-data.model';


// TODO: finish rest of the actions on game data
// gameStarted and gameEnded should probably be enough
export const startGame = createAction(
  '[Game Data] Start game',
  props<GameData>()
);

export const endGame = createAction(
  '[Game Data] End game'
)

export const refreshGame = createAction(
  '[Game Data] Refresh game state'
)

