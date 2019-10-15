import React from 'react';
import { SceneMode, Hand } from 'constant/other';
import {
  loadSettingAsString,
  saveSettingForString,
  loadSettingAsObject,
  loadSettingAsInteger,
} from 'service/SettingService';
import { stringToNumber } from 'service/HandService';
import { Action } from './constant/action';

// 手牌の初期値
const DEFAULT_HAND: Hand = {
  members: stringToNumber([
    '紗代子',
    '莉緒',
    '環',
    '風花',
    '恵美',
    '奈緒',
    '響',
    '育',
    '育',
    '千早',
    '海美',
    '朋花',
  ]),
  units: [1, -1, -1, 1, 1, 1, -1, 0, -1, -1, 1, 0],
  unitIndexes: [12, 34],
  unitChiFlg: [false, true],
  plusMember: stringToNumber(['莉緒'])[0],
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
