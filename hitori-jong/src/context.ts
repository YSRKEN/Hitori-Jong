import { createContext } from 'react';
import { SceneMode, Hand } from 'constant/other';
import { Action } from './constant/action';

// アプリケーションの状態
interface ApplicationState {
  sceneMode: SceneMode;
  simulationHand: Hand;
  myIdol: number;
  handCheckFlg: boolean[];
  dispatch: (action: Action) => void;
}

// アプリケーションの状態を伝搬させるためのContext
const StateContext = createContext<ApplicationState>({} as ApplicationState);
export default StateContext;
