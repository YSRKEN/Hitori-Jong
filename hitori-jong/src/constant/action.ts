// Actionの種類
export type ActionType = 'changeSceneTtoS';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
