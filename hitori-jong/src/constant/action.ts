// Actionの種類
export type ActionType =
  | 'changeSceneTtoG'
  | 'changeSceneTtoS'
  | 'changeSceneGtoT'
  | 'changeSceneStoT'
  | 'checkIdolTile';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
