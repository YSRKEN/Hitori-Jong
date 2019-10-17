import { useState, useEffect } from 'react';
import {
  getShuffledTileDeck,
  checkTempai,
  checkUnits,
  unitListToScore,
  unitListToHumansCount,
  unitListToHandsBoldFlg,
  sortHands,
  calcUnitList,
} from 'algorithm';
import { ApplicationMode, Action, HANDS_SIZE, nameToIndex } from './constant';

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
  const [editFlg, setEditFlg] = useState(0);
  const [selectedTileIndex, setSelectedTileIndex] = useState(0);
  const [mainIdolIndex, setMainIdolIndex] = useState(nameToIndex('静香'));
  const [infoText, setInfoText] = useState('');

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

  // 担当を事前に設定する
  useEffect(() => {
    const mainIdol = window.localStorage.getItem('MainIdol');
    if (mainIdol !== null) {
      setMainIdolIndex(parseInt(mainIdol, 10));
    }
  }, []);

  // 役判定とフラグ処理
  useEffect(() => {
    // 役判定
    const startTime = Date.now();
    const result = calcUnitList(myHands, mainIdolIndex);
    const score = unitListToScore(result, mainIdolIndex);
    const humans = unitListToHumansCount(result);
    console.log('成立役判定');
    console.log(result);
    console.log(`${Date.now() - startTime}[ms]`);

    // フラグ処理
    setHandsBoldFlg(unitListToHandsBoldFlg(myHands, result));

    // ユニットの人数合計＝枚数なら上がり
    if (humans === HANDS_SIZE && applicationMode === 'GameForm') {
      /* eslint no-irregular-whitespace: ["error", {"skipTemplates": true}] */
      window.alert(`アガリ(ミリオンライブ)！　${score}点`);
    }
  }, [applicationMode, myHands, mainIdolIndex]);

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
      checkTempai(myHands, mainIdolIndex);
      setStatusOfCalcTempai(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusOfCalcTempai]);

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'setApplicationMode':
        if (applicationMode === 'StartForm') {
          resetTileDeck();
        }
        setApplicationMode(action.message as ApplicationMode);
        break;
      case 'resetTileDeck':
        resetTileDeck();
        break;
      case 'drawTile': {
        if (editFlg === 0) {
          // 通常モードなのでドローを行う
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
        } else {
          // 編集モードなので選択画面に遷移する
          setSelectedTileIndex(parseInt(action.message, 10));
          setApplicationMode('SelectForm');
        }
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
      case 'checkUnits':
        setInfoText(checkUnits(myHands, mainIdolIndex));
        setApplicationMode('InfoForm');
        break;
      case 'requestSort':
        setMyHands(sortHands(myHands, mainIdolIndex));
        break;
      case 'setEditFlg':
        setEditFlg(action.message === 'Yes' ? 1 : 0);
        break;
      case 'setTile': {
        if (selectedTileIndex >= 0) {
          const idolIndex = parseInt(action.message, 10);
          const newMyHands = [...myHands];
          newMyHands[selectedTileIndex] = idolIndex;
          setApplicationMode('GameForm');
          setMyHands(newMyHands);
        } else {
          setMainIdolIndex(parseInt(action.message, 10));
          window.localStorage.setItem('MainIdol', action.message);
          setApplicationMode('GameForm');
        }
        break;
      }
      case 'setMIB': {
        setSelectedTileIndex(-1);
        setApplicationMode('SelectForm');
        break;
      }
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
    editFlg,
    mainIdolIndex,
    selectedTileIndex,
    infoText,
    dispatch,
  };
};

export default useStore;
