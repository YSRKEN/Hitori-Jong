import { Action } from './constant/action';
import React from 'react';
import { SceneMode } from 'constant/other';

// アプリケーションの状態
const useStore = () => {
  // 現在の表示モード
  const [sceneMode, setSceneMode] = React.useState<SceneMode>('TitleScene');

  // Reduxライクなdispatch関数
  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'changeSceneTtoG':
        setSceneMode('GameScene');
        break;
      case 'changeSceneTtoS':
        setSceneMode('SimulationScene');
        break;
      default:
        break;
    }
  };

  return {
    sceneMode,
    dispatch,
  };
};

export default useStore;
