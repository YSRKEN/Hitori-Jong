import { useState, useEffect } from 'react';
import {
  getShuffledTileDeck,
  calcUnitListWithSora,
  unitListToString,
  unitListToScore,
  unitListToStringArray,
  unitListToHumansCount,
} from 'algorithm';
import { ApplicationMode, Action, HANDS_SIZE, IDOL_LIST } from './constant';

const useStore = () => {
  const [applicationMode, setApplicationMode] = useState<ApplicationMode>(
    'GameForm',
  );
  const [myHands, setMyHands] = useState<number[]>([]);
  const [tileDeck, setTileDeck] = useState<number[]>([]);
  const [tileDeckPointer, setTileDeckPointer] = useState<number>(0);
  const [unitText, setUnitText] = useState<string>('');
  const [handsBoldFlg, setHandsBoldFlg] = useState<boolean[]>([]);

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
    setMyHands(temp2);
    setTileDeckPointer(HANDS_SIZE);
  };

  // 牌山と手札を設定する
  useEffect(() => {
    resetTileDeck();
  }, [applicationMode]);

  // 役判定とフラグ処理
  useEffect(() => {
    // 役判定
    const result = calcUnitListWithSora(myHands);
    const score = unitListToScore(result.unit);
    const humans = unitListToHumansCount(result.unit);
    const soraChangeList: string[] = [];
    for (let i = 0; i < myHands.length; i += 1) {
      if (result.hands[i] !== myHands[i]) {
        soraChangeList.push(IDOL_LIST[result.hands[i]].name);
      }
    }
    if (soraChangeList.length > 0) {
      setUnitText(
        `【成立役(そら→${soraChangeList.join(
          '、',
        )})】合計＝${score}点、人数＝${humans}人\n${unitListToString(
          result.unit,
        )}`,
      );
    } else {
      setUnitText(
        `【成立役】合計＝${score}点、人数＝${humans}人\n${unitListToString(
          result.unit,
        )}`,
      );
    }

    // フラグ処理
    const memberSet = unitListToStringArray(result.unit);
    setHandsBoldFlg(myHands.map(hand => memberSet.has(IDOL_LIST[hand].name)));

    // ユニットの人数合計＝枚数なら上がり
    if (humans === HANDS_SIZE) {
      window.alert('おめでとう！上がりです！');
    }
  }, [myHands]);

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'setApplicationMode':
        setApplicationMode(action.message as ApplicationMode);
        break;
      case 'resetTileDeck':
        resetTileDeck();
        break;
      case 'drawTile': {
        const clickIndex = parseInt(action.message, 10);
        const newMyHands = [...myHands];
        newMyHands[clickIndex] = tileDeck[tileDeckPointer];
        setMyHands(newMyHands);
        setTileDeckPointer(tileDeckPointer + 1);
        break;
      }
      default:
        break;
    }
  };

  return { applicationMode, myHands, unitText, handsBoldFlg, dispatch };
};

export default useStore;
