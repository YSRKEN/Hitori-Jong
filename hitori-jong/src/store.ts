import { useState, useEffect } from 'react';
import {
  getShuffledTileDeck,
  calcUnitList,
  unitListToString,
  unitListToScore,
} from 'algorithm';
import {
  ApplicationMode,
  Action,
  HANDS_SIZE,
  SORA_INDEX,
  IDOL_LIST,
} from './constant';

const useStore = () => {
  const [applicationMode, setApplicationMode] = useState<ApplicationMode>(
    'GameForm',
  );
  const [myHands, setMyHands] = useState<number[]>([]);
  const [tileDeck, setTileDeck] = useState<number[]>([]);
  const [tileDeckPointer, setTileDeckPointer] = useState<number>(0);
  const [unitText, setUnitText] = useState<string>('');

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

  // 役判定
  useEffect(() => {
    if (myHands.includes(SORA_INDEX)) {
      // 簡易的なスコア計算
      // (そらが1枚だけだと仮定し、それを53通りに展開して最高得点のものを返す)
      const soraIndex = myHands.indexOf(SORA_INDEX);
      let maxScore = 0;
      let maxScoreOutput = '';
      for (let i = 0; i < SORA_INDEX - 1; i += 1) {
        const myHands2 = [...myHands];
        myHands2[soraIndex] = i;
        const unitList = calcUnitList(myHands2);
        const unitScore = unitListToScore(unitList);
        if (unitScore > maxScore) {
          maxScore = unitScore;
          maxScoreOutput = `【成立役(そら→${
            IDOL_LIST[i].name
          })】合計＝${unitScore}点\n${unitListToString(unitList)}`;
        }
      }
      setUnitText(maxScoreOutput);
    } else {
      const unitList = calcUnitList(myHands);
      const score = unitListToScore(unitList);
      setUnitText(`【成立役】合計＝${score}点\n${unitListToString(unitList)}`);
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

  return { applicationMode, myHands, unitText, dispatch };
};

export default useStore;
