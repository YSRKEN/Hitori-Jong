// Actionの種類
export type ActionType = 'setApplicationMode';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
