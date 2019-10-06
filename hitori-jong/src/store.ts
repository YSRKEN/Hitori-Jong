import { useState } from "react";
import { ApplicationMode, Action } from "./constant";

const useStore = () => {
  const [applicationMode, setApplicationMode] = useState<ApplicationMode>('StartForm');

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'setApplicationMode':
        setApplicationMode(action.message as ApplicationMode);
        break;
      default:
        break;
    }
  };

  return { applicationMode, dispatch };
};

export default useStore;
