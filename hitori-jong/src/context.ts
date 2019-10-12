import { createContext } from 'react';
import { Action } from './constant';

interface ApplicationState {
  dispatch: (action: Action) => void;
}

const StateContext = createContext<ApplicationState>({} as ApplicationState);

export default StateContext;
