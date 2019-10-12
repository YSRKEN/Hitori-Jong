// Actionの種類
export type ActionType = 'changeSceneTtoG' | 'changeSceneTtoS' | 'changeSceneGtoT' | 'changeSceneStoT';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
