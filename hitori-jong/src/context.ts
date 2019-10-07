import { createContext } from 'react';
import { ApplicationMode, Action } from './constant';

interface ApplicationState {
  applicationMode: ApplicationMode;
  myHands: number[];
  unitText: string;
  dispatch: (action: Action) => void;
}

const StateContext = createContext<ApplicationState>({} as ApplicationState);

export default StateContext;
