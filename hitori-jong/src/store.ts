import { Action } from './constant/action';
import React from 'react';
import { SceneMode } from 'constant/other';
import { loadSettingAsString, saveSetting } from 'service/SettingService';

// アプリケーションの状態
const useStore = () => {
  // 現在の表示モード
  const [sceneMode, setSceneMode] = React.useState<SceneMode>(loadSettingAsString('sceneMode', 'TitleScene') as SceneMode);

  // Reduxライクなdispatch関数
  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'changeSceneTtoG':
        setSceneMode('GameScene');
        saveSetting('sceneMode', 'GameScene');
        break;
      case 'changeSceneTtoS':
        setSceneMode('SimulationScene');
        saveSetting('sceneMode', 'SimulationScene');
        break;
      case 'changeSceneGtoT':
        setSceneMode('TitleScene');
        saveSetting('sceneMode', 'TitleScene');
        break;
      case 'changeSceneStoT':
        setSceneMode('TitleScene');
        saveSetting('sceneMode', 'TitleScene');
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
