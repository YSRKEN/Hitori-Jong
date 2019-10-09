import { createContext } from 'react';
import { ApplicationMode, Action } from './constant';

interface ApplicationState {
  applicationMode: ApplicationMode;
  myHands: number[];
  unitText: string;
  handsBoldFlg: boolean[];
  turnCount: number;
  checkedTileFlg: boolean[];
  statusOfCalcTempai: boolean;
  dispatch: (action: Action) => void;
}

const StateContext = createContext<ApplicationState>({} as ApplicationState);

export default StateContext;
