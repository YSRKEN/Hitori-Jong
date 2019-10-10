import { useState, useEffect } from 'react';
import {
  getShuffledTileDeck,
  checkTempai,
  calcUnitListWithSora,
  unitListToStringArray,
  unitListToScore,
  unitListToHumansCount,
} from 'algorithm';
import {
  ApplicationMode,
  Action,
  HANDS_SIZE,
  IDOL_LIST,
} from './constant';

const useStore = () => {
  const [applicationMode, setApplicationMode] = useState<ApplicationMode>(
    'StartForm',
  );
  const [myHands, setMyHands] = useState<number[]>([]);
  const [tileDeck, setTileDeck] = useState<number[]>([]);
  const [tileDeckPointer, setTileDeckPointer] = useState<number>(0);
  const [handsBoldFlg, setHandsBoldFlg] = useState<boolean[]>([]);
  const [turnCount, setTurnCount] = useState<number>(1);
  const [checkedTileFlg, setCheckedTileFlg] = useState<boolean[]>([]);
  const [statusOfCalcTempai, setStatusOfCalcTempai] = useState<boolean>(false);

  // 牌山と手札を初期化する
  const resetTileDeck = () => {
    // 牌山
    const temp = getShuffledTileDeck();
    setTileDeck(temp);

    // 手札
    const temp2 = Array(HANDS_SIZE);
    for (let i = 0; i < HANDS_SIZE; i += 1) {
      temp2[i] = temp[i];
    }
    const temp3 = Array<boolean>(HANDS_SIZE);
    temp3.fill(false);
    setMyHands(temp2);
    setTileDeckPointer(HANDS_SIZE);
    setTurnCount(1);
    setCheckedTileFlg(temp3);
  };

  // 牌山と手札を設定する
  useEffect(() => {
    resetTileDeck();
  }, [applicationMode]);

  // 役判定とフラグ処理
  useEffect(() => {
    // 役判定
    const startTime = Date.now();
    const result = calcUnitListWithSora(myHands);
    const score = unitListToScore(result.unit);
    const humans = unitListToHumansCount(result.unit);
    console.log('成立役判定');
    console.log(result);
    console.log(`${Date.now() - startTime}[ms]`);

    // フラグ処理
    const memberSet = unitListToStringArray(result.unit);
    setHandsBoldFlg(myHands.map(hand => memberSet.has(IDOL_LIST[hand].name)));

    // ユニットの人数合計＝枚数なら上がり
    if (humans === HANDS_SIZE && applicationMode === 'GameForm') {
      window.alert(`アガリ(ミリオンライブ)！　${score}点`);
    }
  }, [applicationMode, myHands]);

  // 牌交換
  useEffect(() => {
    if (checkedTileFlg.filter(flg => flg).length >= 2) {
      const checkedTileIndex: number[] = [];
      for (let i = 0; i < checkedTileFlg.length; i += 1) {
        if (checkedTileFlg[i]) {
          checkedTileIndex.push(i);
        }
      }
      const newMyHands = [...myHands];
      const temp = newMyHands[checkedTileIndex[0]];
      newMyHands[checkedTileIndex[0]] = newMyHands[checkedTileIndex[1]];
      newMyHands[checkedTileIndex[1]] = temp;
      setMyHands(newMyHands);
      const temp2 = Array<boolean>(HANDS_SIZE);
      temp2.fill(false);
      setCheckedTileFlg(temp2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedTileFlg]);

  useEffect(() => {
    if (statusOfCalcTempai) {
      checkTempai(myHands);
      setStatusOfCalcTempai(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusOfCalcTempai]);

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'setApplicationMode':
        setApplicationMode(action.message as ApplicationMode);
        break;
      case 'resetTileDeck':
        resetTileDeck();
        break;
      case 'drawTile': {
        if (tileDeck.length <= tileDeckPointer) {
          window.alert('もうツモできません');
          break;
        }
        const clickIndex = parseInt(action.message, 10);
        const newMyHands = [...myHands];
        newMyHands[clickIndex] = tileDeck[tileDeckPointer];
        setMyHands(newMyHands);
        setTileDeckPointer(tileDeckPointer + 1);
        setTurnCount(turnCount + 1);
        break;
      }
      case 'checkTile': {
        const checkIndex = parseInt(action.message, 10);
        const newCheckedTileFlg = [...checkedTileFlg];
        newCheckedTileFlg[checkIndex] = true;
        setCheckedTileFlg(newCheckedTileFlg);
        break;
      }
      case 'calcTempai':
        setStatusOfCalcTempai(true);
        break;
      default:
        break;
    }
  };

  return {
    applicationMode,
    myHands,
    handsBoldFlg,
    turnCount,
    checkedTileFlg,
    statusOfCalcTempai,
    dispatch,
  };
};

export default useStore;
