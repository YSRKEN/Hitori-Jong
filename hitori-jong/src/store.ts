import { useState, useEffect } from 'react';
import {
  ApplicationMode,
  Action,
  HANDS_SIZE,
  TILE_DECK_SIZE,
  IDOL_LIST_LENGTH,
  MAX_IDOL_COUNTS,
  IDOL_LIST,
  UNIT_LIST,
} from './constant';

const getShuffledTileDeck = () => {
  // 初期化
  const temp = Array<number>(TILE_DECK_SIZE);
  for (let i = 0; i < IDOL_LIST_LENGTH; i += 1) {
    for (let j = 0; j < MAX_IDOL_COUNTS; j += 1) {
      temp[i * MAX_IDOL_COUNTS + j] = i;
    }
  }

  // シャッフル
  // TODO：アルゴリズムを変更する。Math.random()はどのアルゴリズムを使うか保証されておらず、
  // またミリジャンの牌山は162!÷3!^54≒1.17e+247≒2^821通りの組み合わせがある。
  // つまり、乱数生成をメルセンヌ・ツイスタ(周期2^19937-1)など長周期のもので行うとしても、
  // シードを2^821通り以上の組み合わせが保証されるように取る必要がある。
  // しかし、window.crypto.getRandomValues()が使えたとしても、1要素につき2^32のランダム性しかないため、
  // 厳密に行おうとすると、getRandomValuesで26要素用意し、26個の乱数生成器を用意し、
  // 1回乱数を使用する毎に乱数生成器を取り替えるような実装が必要となる。
  //
  // あまりに大変なので、とりあえずMath.random()でお茶を濁すことにする
  for (let i = TILE_DECK_SIZE - 1; i >= 1; i -= 1) {
    const j = Math.floor(Math.random() * Math.floor(i + 1));
    const a = temp[i];
    temp[i] = temp[j];
    temp[j] = a;
  }

  return temp;
};

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
    // 手役をハッシュ化
    const handSet = new Set<string>();
    for (let hand of myHands) {
      handSet.add(IDOL_LIST[hand].name);
    }

    // 確認
    let output: string = '';
    for (let record of UNIT_LIST) {
      let flg = true;
      for (let member of record.member) {
        if (!(handSet.has(member))) {
          flg = false;
          break;
        }
      }
      if (flg) {
        output += record.name + ' : ' + record.member[0];
        for (let i = 1; i < record.member.length; ++i) {
          output += ', ' + record.member[i];
        }
        output += "\n";
      }
    }
    output = '【成立役】' + "\n" + output;
    setUnitText(output);
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
        const clickIndex = parseInt(action.message);
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
