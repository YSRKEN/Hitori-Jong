import React from 'react';
import { SceneMode, Hand, HAND_TILE_SIZE } from 'constant/other';
import {
  loadSettingAsString,
  saveSettingForString,
  loadSettingAsObject,
  loadSettingAsInteger,
} from 'service/SettingService';
import { createFilledArray } from 'service/UtilityService';
import { Action } from './constant/action';

// 手牌の初期値
const DEFAULT_HAND: Hand = {
  members: [31, 41, 5, 9, 26, 5, 35, 8, 9, 7, 9, 32],
  units: createFilledArray(HAND_TILE_SIZE, -1),
  unitIndexes: [],
  plusMember: 38,
};

// アプリケーションの状態
const useStore = () => {
  // 現在の表示モード
  const [sceneMode, setSceneMode] = React.useState<SceneMode>(
    loadSettingAsString('sceneMode', 'TitleScene') as SceneMode,
  );
  // シミュレーターにおける手牌
  const [simulationHand] = React.useState<Hand>(
    loadSettingAsObject('simulationHand', DEFAULT_HAND),
  );
  // 担当
  const [myIdol] = React.useState<number>(loadSettingAsInteger('myIdol', 0));

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
    simulationHand,
    myIdol,
    dispatch,
  };
};

export default useStore;
