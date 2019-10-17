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
  saveSettingForObject,
} from 'service/SettingService';
import { createFilledArray } from 'service/UtilityService';
import {
  ejectUnit,
  shiftTileLeft,
  shiftTileRight,
  injectUnit,
  calcHandUnitLengthSum,
  changeMember,
} from 'service/HandService';
import { Action } from './constant/action';

// アプリケーションの状態
const useStore = () => {
  // 現在の表示モード
  const [sceneMode, setSceneMode] = React.useState<SceneMode>(
    loadSettingAsString('sceneMode', 'TitleScene') as SceneMode,
  );
  const setSceneMode2 = (s: SceneMode) => {
    setSceneMode(s);
    saveSettingForString('sceneMode', s);
  };
  // シミュレーターにおける手牌
  const [simulationHand, setSimulationHand] = React.useState<Hand>(
    loadSettingAsObject('simulationHand', DEFAULT_HAND),
  );
  const setSimulationHand2 = (h: Hand) => {
    setSimulationHand(h);
    saveSettingForObject('simulationHand', h);
  };
  // 担当
  const [myIdol] = React.useState<number>(
    loadSettingAsInteger('myIdol', DEFAULT_NY_IDOL),
  );
  // 手牌のチェックフラグ
  const [handCheckFlg, setHandCheckFlg] = React.useState<boolean[]>(
    createFilledArray(HAND_TILE_SIZE, false),
  );
  // アイドル選択における変更対象
  const [selectedIdolSortedIndex, setSelectedIdolSortedIndex] = React.useState(
    0,
  );
  // アイドル選択におけるカナ
  const [selectedKana, setSelectedKana] = React.useState('');

  // Reduxライクなdispatch関数
  const dispatch = (action: Action) => {
    switch (action.type) {
      // タイトル画面→ゲーム画面への遷移
      case 'changeSceneTtoG':
        setSceneMode2('GameScene');
        break;
      // タイトル画面→シミュレーション画面への遷移
      case 'changeSceneTtoS':
        setSceneMode2('SimulationScene');
        break;
      // ゲーム画面→タイトル画面への遷移
      case 'changeSceneGtoT':
        setSceneMode2('TitleScene');
        break;
      // シミュレーション画面→タイトル画面への遷移
      case 'changeSceneStoT':
        setSceneMode2('TitleScene');
        break;
      // シミュレーション画面→キーボード画面への遷移
      case 'changeSceneStoK': {
        const selectIdolIndex = parseInt(action.message, 10);
        if (calcHandUnitLengthSum(simulationHand) > selectIdolIndex) {
          break;
        }
        setSelectedIdolSortedIndex(selectIdolIndex);
        setSceneMode('KanaKeyBoardScene');
        break;
      }
      // キーボード画面→シミュレーション画面への遷移
      case 'changeSceneKtoS':
        setSceneMode2('SimulationScene');
        break;
      // アイドル選択画面→シミュレーション画面への遷移
      case 'changeSceneItoS':
        setSceneMode2('SimulationScene');
        break;
      // 牌をチェックボックスで選択
      case 'checkIdolTile': {
        const tileIndex = parseInt(action.message, 10);
        const temp = [...handCheckFlg];
        temp[tileIndex] = !temp[tileIndex];
        setHandCheckFlg(temp);
        break;
      }
      // チェックされた牌を含むユニットを解除
      case 'ejectUnit': {
        // 解除後の手牌を生成する
        const newHand = ejectUnit(simulationHand, handCheckFlg);

        // 解除後の手牌をセットする
        setSimulationHand2(newHand);
        setHandCheckFlg(createFilledArray(HAND_TILE_SIZE, false));
        break;
      }
      // 選択された(ユニットを組んでない)手牌を左シフト
      case 'shiftLeft': {
        // シフト後の手牌を生成する
        const newHand = shiftTileLeft(simulationHand, handCheckFlg);

        // 解除後の手牌をセットする
        setSimulationHand2(newHand);
        setHandCheckFlg(createFilledArray(HAND_TILE_SIZE, false));
        break;
      }
      // 選択された(ユニットを組んでない)手牌を右シフト
      case 'shiftRight': {
        // シフト後の手牌を生成する
        const newHand = shiftTileRight(simulationHand, handCheckFlg);

        // 解除後の手牌をセットする
        setSimulationHand2(newHand);
        setHandCheckFlg(createFilledArray(HAND_TILE_SIZE, false));
        break;
      }
      // 選択された(ユニットを組んでない)手牌でチー(ティーンと来た)する
      case 'injectUnitChi': {
        // チー後の手牌を生成する
        const newHand = injectUnit(simulationHand, handCheckFlg, true);

        // 解除後の手牌をセットする
        setSimulationHand2(newHand);
        setHandCheckFlg(createFilledArray(HAND_TILE_SIZE, false));
        break;
      }
      // 選択された(ユニットを組んでない)手牌を固める
      case 'injectUnitFixed': {
        // 固めた後の手牌を生成する
        const newHand = injectUnit(simulationHand, handCheckFlg, false);

        // 解除後の手牌をセットする
        setSimulationHand2(newHand);
        setHandCheckFlg(createFilledArray(HAND_TILE_SIZE, false));
        break;
      }
      case 'setKana':
        setSelectedKana(action.message);
        setSceneMode('IdolSelectScene');
        break;
      case 'selectIdol': {
        const selectIdolIndex = parseInt(action.message, 10);

        // 交換後の手牌を生成する
        const newHand = changeMember(
          simulationHand,
          selectedIdolSortedIndex,
          selectIdolIndex,
        );

        // 解除後の手牌をセットする
        setSimulationHand2(newHand);
        setSceneMode2('SimulationScene');
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
    selectedKana,
    dispatch,
  };
};

export default useStore;
