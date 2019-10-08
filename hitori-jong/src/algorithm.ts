import {
  TILE_DECK_SIZE,
  IDOL_LIST_LENGTH,
  MAX_IDOL_COUNTS,
  UnitInfo,
  IDOL_LIST,
  UNIT_LIST,
  Int64,
  INT64_ZERO,
  SORA_INDEX,
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

// 1をshift個だけ左シフト後の値
const getShiftedValue = (shift: number): Int64 => {
  if (shift < 32) {
    return { upper: 0, lower: 1 << shift };
  }

  return { upper: 1 << (shift - 32), lower: 0 };
};

// Int64型変数のOR演算を行う
const orInt64 = (a: Int64, b: Int64) => {
  return { upper: a.upper | b.upper, lower: a.lower | b.lower };
};

// Int64型変数のAND演算を行う
const andInt64 = (a: Int64, b: Int64) => {
  return { upper: a.upper & b.upper, lower: a.lower & b.lower };
};

// Int64型変数の比較演算を行う
const equalInt64 = (a: Int64, b: Int64) => {
  return a.upper === b.upper && a.lower === b.lower;
};

// 手役一覧における人名部分を、比較演算しやすいように変換する
// とても都合がいいことに、JavaScriptのnumber型で正確に表せる整数は53bitまでなので、
// そのままキーとして使用できる
export const convertUnitList = () => {
  const temp: { [key: string]: Int64 } = {};
  for (let i = 0; i < 53; i += 1) {
    temp[IDOL_LIST[i].name] = getShiftedValue(i);
  }

  const unitList2: UnitInfo[] = [];
  for (const record of UNIT_LIST) {
    let memberKey: Int64 = { upper: 0, lower: 0 };
    for (const member of record.member) {
      memberKey = orInt64(memberKey, temp[member]);
    }
    let gameScore = 0;
    switch (record.member.length) {
      case 1:
        gameScore = 1000;
        break;
      case 2:
        gameScore = 2000;
        break;
      case 3:
        gameScore = 4000;
        break;
      case 4:
        gameScore = 6000;
        break;
      case 5:
        gameScore = 8000;
        break;
      case 13:
        // 仮決め
        gameScore = 24000;
        break;
      default:
        gameScore = 0;
        break;
    }
    unitList2.push({ name: record.name, member: memberKey, score: gameScore });
  }

  return unitList2;
};
const UNIT_LIST2 = convertUnitList();

// 手役から、どのユニットが作れるかを調べる
let cache: { [key: string]: UnitInfo[] } = {};
export const calcUnitListImpl = (myHands: number[]) => {
  // 手役をビット化
  let myHandsBit: Int64 = INT64_ZERO;
  for (const hand of myHands) {
    myHandsBit = orInt64(myHandsBit, getShiftedValue(hand));
  }
  const key = `${myHandsBit.upper},${myHandsBit.lower}`;
  if (key in cache) {
    return cache[key];
  }

  // 役を確認
  const output: UnitInfo[] = [];
  for (const record of UNIT_LIST2) {
    if (equalInt64(andInt64(myHandsBit, record.member), record.member)) {
      output.push({
        name: record.name,
        member: record.member,
        score: record.score,
      });
    }
  }

  cache[key] = output;

  return output;
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

// 手役から、どのユニットが作れるかを調べる(そら考慮版)
// minSora……そらが複数枚入っていた際、それぞれS1・S2……とすると、アイドルIDが必ずS1≦S2≦……となるようにするための補正
export const calcUnitList = (
  myHands: number[],
  minSora = 0,
): { unit: UnitInfo[]; hands: number[] } => {
  cache = {};
  // そらが含まれているかどうかで場合分け
  const soraIndex = myHands.indexOf(SORA_INDEX);
  if (soraIndex >= 0) {
    // 含まれている場合は、全通り調べて最高得点のものを返す
    let maxScore = 0;
    let maxResult: { unit: UnitInfo[]; hands: number[] } = {
      unit: [],
      hands: [],
    };
    for (let i = minSora; i < SORA_INDEX - 1; i += 1) {
      // そらを指定したカードの値として解釈
      const myHandsTemp = [...myHands];
      myHandsTemp[soraIndex] = i;

      // 再帰的にスコア計算
      const result = calcUnitList(myHandsTemp, i);
      const score = unitListToScore(result.unit);
      if (maxScore < score) {
        maxScore = score;
        maxResult = result;
      }
    }

    return maxResult;
  }

  return { unit: calcUnitListImpl(myHands), hands: myHands };
};

// 表示用に、ユニットメンバーを文字列配列に変換
export const unitMemberToStringArray = (members: Int64) => {
  const memberArray: number[] = [];
  for (let i = 0; i < 53; i += 1) {
    if (!equalInt64(andInt64(members, getShiftedValue(i)), INT64_ZERO)) {
      memberArray.push(i);
    }
  }

  return memberArray.map(id => IDOL_LIST[id].name);
};

// ユニット一覧を文字列化する
export const unitListToString = (unitList: UnitInfo[]) => {
  return unitList
    .map(
      unit =>
        `[${unit.score}点] ${unit.name} ${unitMemberToStringArray(
          unit.member,
        ).join(',')}`,
    )
    .join('\n');
};
