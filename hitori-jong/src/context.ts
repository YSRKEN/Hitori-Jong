import { ApplicationMode, Action } from "./constant";
import { createContext } from "react";

interface ApplicationState {
	applicationMode: ApplicationMode;
  dispatch: (action: Action) => void;
}

const StateContext = createContext<ApplicationState>({} as ApplicationState);

export default StateContext;
