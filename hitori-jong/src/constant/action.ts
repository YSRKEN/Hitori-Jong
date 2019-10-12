// Actionの種類
export type ActionType = 'changeSceneTtoG' | 'changeSceneTtoS';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
