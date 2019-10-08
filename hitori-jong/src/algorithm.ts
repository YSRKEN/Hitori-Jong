import {
  TILE_DECK_SIZE,
  IDOL_LIST_LENGTH,
  MAX_IDOL_COUNTS,
  IDOL_LIST,
  UNIT_LIST,
  UnitInfo,
} from 'constant';

// 牌山をシャッフルする
export const getShuffledTileDeck = () => {
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

export const calcUnitList = (myHands: number[]) => {
  // 手役をハッシュ化
  const handSet = new Set<string>();
  for (const hand of myHands) {
    handSet.add(IDOL_LIST[hand].name);
  }

  // 確認
  const output: UnitInfo[] = [];
  for (const record of UNIT_LIST) {
    let flg = true;
    for (const member of record.member) {
      if (!handSet.has(member)) {
        flg = false;
        break;
      }
    }
    if (flg) {
      const { name } = record;
      const { member } = record;
      let score = 0;
      switch (member.length) {
        case 1:
          score = 1000;
          break;
        case 2:
          score = 1000;
          break;
        case 3:
          score = 1000;
          break;
        case 4:
          score = 1000;
          break;
        case 5:
          score = 1000;
          break;
        case 13:
          // 仮決め
          score = 24000;
          break;
        default:
          score = 0;
          break;
      }
      output.push({ name, member, score });
    }
  }

  return output;
};

// ユニット一覧を文字列化する
export const unitListToString = (unitList: UnitInfo[]) => {
  return unitList
    .map(unit => `[${unit.score}点] ${unit.name} ${unit.member.join(', ')}`)
    .join('\n');
};

// ユニット一覧からスコア計算する
export const unitListToScore = (unitList: UnitInfo[]) => {
  if (unitList.length === 0) {
    return 0;
  }

  return unitList
    .map(unit => unit.score)
    .reduce((sum: number, val: number) => sum + val);
};
