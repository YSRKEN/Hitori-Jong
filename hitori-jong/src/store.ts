import React from 'react';
import {
  SceneMode,
  Hand,
  DEFAULT_HAND,
  DEFAULT_NY_IDOL,
  HAND_TILE_SIZE,
} from 'constant/other';
import {
  loadSettingAsString,
  saveSettingForString,
  loadSettingAsObject,
  loadSettingAsInteger,
} from 'service/SettingService';
import { createFilledArray } from 'service/UtilityService';
import { Action } from './constant/action';

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
  const [myIdol] = React.useState<number>(
    loadSettingAsInteger('myIdol', DEFAULT_NY_IDOL),
  );
  // 手牌のチェックフラグ
  const [handCheckFlg, setHandCheckFlg] = React.useState<boolean[]>(
    createFilledArray(HAND_TILE_SIZE, false),
  );

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
      case 'checkIdolTile': {
        const tileIndex = parseInt(action.message, 10);
        const temp = [...handCheckFlg];
        temp[tileIndex] = !temp[tileIndex];
        setHandCheckFlg(temp);
        break;
      }
      default:
        break;
    }
  };

  return {
    sceneMode,
    simulationHand,
    myIdol,
    handCheckFlg,
    dispatch,
  };
};

export default useStore;
