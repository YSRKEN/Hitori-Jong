import {
  TILE_DECK_SIZE,
  IDOL_LIST_LENGTH,
  MAX_IDOL_COUNTS,
  IDOL_LIST,
  UNIT_LIST,
  UnitInfo,
} from 'constant';

// [0, n)の整数一様乱数を得る。参考：MDN
const getRandomInt = (n: number) => {
  return Math.floor(Math.random() * n);
};

// [0, n)の整数一様乱数を得る。参考・MDN、cpprefjp
const getRandomIntSecure = (n: number) => {
  const rawValueLimit = Math.floor(4294967296 / n) * n;
  /* eslint no-constant-condition: ["error", {"checkLoops": false}]*/
  while (true) {
    // [0, 2^32=4294967296)の整数乱数を得る
    const rawValue = window.crypto.getRandomValues(new Uint32Array(1))[0];

    // 整数乱数がある値以上ならば、その結果を棄却して再度乱数を出させる(モジュロ問題の回避)
    if (rawValue >= rawValueLimit) {
      continue;
    } else {
      return rawValue % n;
    }
  }
};

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
  // window.crypto.getRandomValues()が実装されている際は、そちらを利用して
  // 一様整数乱数を取得し、そこから狙った幅の整数乱数にすることでシャッフルを行う。
  // 実装されてない際は、ベタにMath.random()から整数乱数を作成してシャッフルを行う
  if (typeof window.crypto.getRandomValues === 'function') {
    for (let i = TILE_DECK_SIZE - 1; i >= 1; i -= 1) {
      const j = getRandomIntSecure(i + 1);
      const a = temp[i];
      temp[i] = temp[j];
      temp[j] = a;
    }
  } else {
    for (let i = TILE_DECK_SIZE - 1; i >= 1; i -= 1) {
      const j = getRandomInt(i + 1);
      const a = temp[i];
      temp[i] = temp[j];
      temp[j] = a;
    }
  }

  return temp;
};

// 手役から、どのユニットが作れるかを調べる
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
