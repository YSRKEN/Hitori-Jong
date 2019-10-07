import { useState, useEffect } from 'react';
import {
  ApplicationMode,
  Action,
  HANDS_SIZE,
  TILE_DECK_SIZE,
  IDOL_LIST_LENGTH,
  MAX_IDOL_COUNTS,
} from './constant';

const useStore = () => {
  const [applicationMode, setApplicationMode] = useState<ApplicationMode>(
    'GameForm',
  );
  const [myHands, setMyHands] = useState<number[]>([]);
  const [tileDeck, setTileDeck] = useState<number[]>([]);
  const [, setTileDeckPointer] = useState<number>(0);

  // 牌山を設定する
  useEffect(() => {
    // 初期化
    const temp = Array<number>(TILE_DECK_SIZE);
    for (let i = 0; i < IDOL_LIST_LENGTH; i += 1) {
      for (let j = 0; j < MAX_IDOL_COUNTS; j += 1) {
        temp[i * MAX_IDOL_COUNTS + j] = i;
      }
    }

    // シャッフル
    for (let i = TILE_DECK_SIZE - 1; i >= 1; i -= 1) {
      const j = Math.floor(Math.random() * Math.floor(i + 1));
      const a = temp[i];
      temp[i] = temp[j];
      temp[j] = a;
    }
    setTileDeck(temp);
  }, []);

  // 手札を設定する
  useEffect(() => {
    const temp = Array(HANDS_SIZE);
    for (let i = 0; i < HANDS_SIZE; i += 1) {
      temp[i] = tileDeck[i];
    }
    setMyHands(temp);
    setTileDeckPointer(HANDS_SIZE);
  }, [tileDeck]);

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'setApplicationMode':
        setApplicationMode(action.message as ApplicationMode);
        break;
      default:
        break;
    }
  };

  return { applicationMode, myHands, dispatch };
};

export default useStore;
