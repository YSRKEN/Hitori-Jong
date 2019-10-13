import { createContext } from 'react';
import { Action } from './constant/action';
import { SceneMode } from 'constant/other';

// アプリケーションの状態
interface ApplicationState {
  sceneMode: SceneMode;
  handTileListS: number[];
  myIdol: number;
  dispatch: (action: Action) => void;
}

// アプリケーションの状態を伝搬させるためのContext
const StateContext = createContext<ApplicationState>({} as ApplicationState);
export default StateContext;
