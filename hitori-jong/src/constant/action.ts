// Actionの種類
export type ActionType =
  | 'changeSceneTtoG'
  | 'changeSceneTtoS'
  | 'changeSceneGtoT'
  | 'changeSceneStoT'
  | 'changeSceneStoK'
  | 'changeSceneKtoS'
  | 'changeSceneItoS'
  | 'checkIdolTile'
  | 'ejectUnit'
  | 'shiftLeft'
  | 'shiftRight'
  | 'injectUnitChi'
  | 'injectUnitFixed'
  | 'setKana'
  | 'selectIdol'
  | 'selectIdolTile';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
