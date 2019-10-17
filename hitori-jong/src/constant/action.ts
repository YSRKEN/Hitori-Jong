// Actionの種類
export type ActionType =
  | 'changeSceneTtoG'
  | 'changeSceneTtoS'
  | 'changeSceneGtoT'
  | 'changeSceneStoT'
  | 'changeSceneStoK'
  | 'changeSceneKtoS'
  | 'checkIdolTile'
  | 'ejectUnit'
  | 'shiftLeft'
  | 'shiftRight'
  | 'injectUnitChi'
  | 'injectUnitFixed';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
