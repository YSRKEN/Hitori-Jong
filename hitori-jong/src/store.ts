import { Action } from './constant/action';
import React from 'react';
import { SceneMode } from 'constant/other';
import { loadSettingAsString, saveSettingForString, loadSettingAsObject } from 'service/SettingService';

// アプリケーションの状態
const useStore = () => {
  // 現在の表示モード
  const [sceneMode, setSceneMode] = React.useState<SceneMode>(loadSettingAsString('sceneMode', 'TitleScene') as SceneMode);
  // シミュレーターにおける手牌
  const [handTileListS,] = React.useState<number[]>(loadSettingAsObject('handTileListS', [31, 41, 5, 9, 26, 5, 35, 8, 9, 7, 9, 32, 38]) as number[]);

    // Reduxライクなdispatch関数
  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'changeSceneTtoG':
        setSceneMode('GameScene');
        saveSettingForString('sceneMode', 'GameScene');
        break;
      case 'changeSceneTtoS':
        setSceneMode('SimulationScene');
        saveSettingForString('sceneMode', 'SimulationScene');
        break;
      case 'changeSceneGtoT':
        setSceneMode('TitleScene');
        saveSettingForString('sceneMode', 'TitleScene');
        break;
      case 'changeSceneStoT':
        setSceneMode('TitleScene');
        saveSettingForString('sceneMode', 'TitleScene');
        break;
      default:
        break;
    }
  };

  return {
    sceneMode,
    handTileListS,
    dispatch,
  };
};

export default useStore;
