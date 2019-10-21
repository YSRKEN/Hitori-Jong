// Actionの種類
export type ActionType =
  | 'changeSceneTtoG'
  | 'changeSceneTtoS'
  | 'changeSceneGtoT'
  | 'changeSceneStoT'
  | 'changeSceneStoK'
  | 'changeSceneToS'
  | 'checkIdolTile'
  | 'ejectUnit'
  | 'shiftLeft'
  | 'shiftRight'
  | 'injectUnitChi'
  | 'injectUnitFixed'
  | 'setKana'
  | 'selectIdol'
  | 'selectIdolTile'
  | 'findUnit'
  | 'findWantedIdol'
  | 'findDropIdol';

// Action
export interface Action {
  type: ActionType;
  message: string;
}
