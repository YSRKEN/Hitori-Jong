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
  IDOL_LIST_LENGTH2,
  HANDS_SIZE,
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
export const convertUnitList = () => {
  const temp: { [key: string]: Int64 } = {};
  const temp2: { [key: string]: number } = {};
  for (let i = 0; i < IDOL_LIST_LENGTH2; i += 1) {
    temp[IDOL_LIST[i].name] = getShiftedValue(i);
    temp2[IDOL_LIST[i].name] = i;
  }

  const unitList2: UnitInfo[] = [];
  for (const record of UNIT_LIST) {
    // キーハッシュ
    let memberKey: Int64 = { upper: 0, lower: 0 };
    for (const member of record.member) {
      memberKey = orInt64(memberKey, temp[member]);
    }
    // アイドル毎の枚数
    const memberArray: number[] = Array(IDOL_LIST_LENGTH2);
    memberArray.fill(0);
    for (const member of record.member) {
      memberArray[temp2[member]] += 1;
    }
    // スコア
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
    unitList2.push({
      name: record.name,
      member: memberKey,
      member2: memberArray,
      score: gameScore,
    });
  }

  return unitList2;
};
const UNIT_LIST2 = convertUnitList();

// 手役をInt64型に変換する
const calcHandsBit = (myHands: number[]) => {
  let myHandsBit: Int64 = INT64_ZERO;
  for (const hand of myHands) {
    myHandsBit = orInt64(myHandsBit, getShiftedValue(hand));
  }

  return myHandsBit;
};

// 手役から、どのユニットが作れるかを調べる
const calcUnitListRough = (myHandsBit: Int64) => {
  // 役を確認
  const output: number[] = [];
  for (let i = 0; i < UNIT_LIST2.length; i += 1) {
    if (
      equalInt64(
        andInt64(myHandsBit, UNIT_LIST2[i].member),
        UNIT_LIST2[i].member,
      )
    ) {
      output.push(i);
    }
  }

  return output;
};

// 手役を「それぞれのアイドルが何枚あるか」の配列に変換する
const calcHandsArray = (myHands: number[]) => {
  const temp = Array<number>(IDOL_LIST_LENGTH2);
  temp.fill(0);
  for (const hand of myHands) {
    temp[hand] += 1;
  }

  return temp;
};

// 手牌に指定した手役が何回取り出せるかを調べる
const calcCount = (myHandsArray: number[], unitListX: number[]) => {
  let minCount = 9999;
  for (let i = 0; i < IDOL_LIST_LENGTH2; i += 1) {
    if (unitListX[i] > 0) {
      minCount = Math.min(minCount, myHandsArray[i]);
    }
  }

  return minCount;
};

// 手役に対して、どのユニットの組み合わせを取れば高得点かを計算する
// ・myHandsArray……要素数IDOL_LIST_LENGTH2(53)、各アイドルの枚数が記録されている
// ・unitList……適合するユニット番号が記録されている
// ・unitListから、各ユニットの「要素数IDOL_LIST_LENGTH2(53)」を取得し、
//   それをどう組み合わせれば高得点かを勘案する
const calcUnitListFine = (myHandsArray: number[], unitList: number[]) => {
  // unitListの各要素について、「それぞれのアイドルが何枚あるか」の配列に変換する
  const unitList2 = unitList.map(id => UNIT_LIST2[id].member2);

  // unitList2の各要素について、myHandsArray内で何回割り当てられるかを計算する
  const roughCount = unitList2.map(unitData =>
    calcCount(myHandsArray, unitData),
  );

  // 割当可能回数から、全割当パターンを算出する
  let patterns: number[][] = [];
  for (const count of roughCount) {
    const temp = Array(count + 1);
    for (let i = 0; i <= count; i += 1) {
      temp[i] = i;
    }
    if (patterns.length === 0) {
      for (const i of temp) {
        patterns.push([i]);
      }
    } else {
      const temp2: number[][] = [];
      for (const record of patterns) {
        for (const i of temp) {
          temp2.push(record.concat([i]));
        }
      }
      patterns = temp2;
    }
  }

  // 各割当パターンについて、実行可能性とスコア計算を実施し、最大のものを採用する
  let maxScore = 0;
  let fineList: number[] = [];
  for (let x = 0; x < patterns.length; x += 1) {
    const record = patterns[x];
    // スコアを計算
    let score = 0;
    let tileCount = 0;
    for (let i = 0; i < record.length; i += 1) {
      if (record[i] >= 1) {
        score += record[i] * UNIT_LIST2[unitList[i]].score;
        tileCount += record[i] * UNIT_LIST[unitList[i]].member.length;
      }
    }
    if (tileCount === HANDS_SIZE) {
      score += 100000000;
    }
    if (score > maxScore) {
      // 実行可能性を判断
      const temp = Array<number>(IDOL_LIST_LENGTH2);
      temp.fill(0);
      for (let i = 0; i < record.length; i += 1) {
        if (record[i] >= 1) {
          for (let j = 0; j < IDOL_LIST_LENGTH2; j += 1) {
            temp[j] += record[i] * unitList2[i][j];
          }
        }
      }
      let flg = true;
      for (let j = 0; j < IDOL_LIST_LENGTH2; j += 1) {
        if (myHandsArray[j] < temp[j]) {
          flg = false;
          break;
        }
      }
      if (flg) {
        maxScore = score;
        const temp2: number[] = [];
        for (let i = 0; i < record.length; i += 1) {
          if (record[i] >= 1) {
            temp2.push(unitList[i]);
          }
        }
        fineList = temp2;
      }
    }
  }

  return fineList;
};

// 手役から、どのユニットの組み合わせを取るべきかを調べる
let cache: { [key: string]: number[] } = {};
export const calcUnitList = (myHands: number[]) => {
  // キャッシュを確認する
  const key = [...myHands]
    .sort()
    .map(i => i.toString())
    .join(',');
  if (key in cache) {
    return cache[key];
  }

  // 可能な手役の一覧を列挙する
  const myHandsBit = calcHandsBit(myHands);
  const roughList = calcUnitListRough(myHandsBit);

  // どの手役を使うと最高得点が取れるかを判断する
  const myHandsArray = calcHandsArray(myHands);
  const fineList = calcUnitListFine(myHandsArray, roughList);

  // キャッシュに追加する
  cache[key] = [...fineList];

  return fineList;
};

// ユニット一覧からスコア計算する
export const unitListToScore = (unitList: number[]) => {
  if (unitList.length === 0) {
    return 0;
  }

  return unitList
    .map(unit => UNIT_LIST2[unit].score)
    .reduce((sum: number, val: number) => sum + val);
};

export const resetCache = () => {
  cache = {};
};

// 手役から、どのユニットが作れるかを調べる(そら考慮版)
// minSora……そらが複数枚入っていた際、それぞれS1・S2……とすると、アイドルIDが必ずS1≦S2≦……となるようにするための補正
export const calcUnitListWithSora = (
  myHands: number[],
  minSora = 0,
): { unit: number[]; hands: number[] } => {
  // そらが含まれているかどうかで場合分け
  const soraIndex = myHands.indexOf(SORA_INDEX);
  if (soraIndex >= 0) {
    // 含まれている場合は、全通り調べて最高得点のものを返す
    let maxScore = 0;
    let maxResult: { unit: number[]; hands: number[] } = {
      unit: [],
      hands: [],
    };
    for (let i = minSora; i < SORA_INDEX - 1; i += 1) {
      // そらを指定したカードの値として解釈
      const myHandsTemp = [...myHands];
      myHandsTemp[soraIndex] = i;

      // 再帰的にスコア計算
      const result = calcUnitListWithSora(myHandsTemp, i);
      const score = unitListToScore(result.unit);
      if (maxScore < score) {
        maxScore = score;
        maxResult = result;
      }
    }

    return maxResult;
  }

  return { unit: calcUnitList(myHands), hands: myHands };
};

// 表示用に、ユニットメンバーを文字列配列に変換
const unitMemberToStringArray = (members: Int64) => {
  const memberArray: number[] = [];
  for (let i = 0; i < IDOL_LIST_LENGTH2; i += 1) {
    if (!equalInt64(andInt64(members, getShiftedValue(i)), INT64_ZERO)) {
      memberArray.push(i);
    }
  }

  return memberArray.map(id => IDOL_LIST[id].name);
};

// 表示用に、ユニット一覧を文字列配列に変換
export const unitListToStringArray = (unitList: number[]) => {
  const memberSet = new Set<string>();
  for (const unitInfo of unitList) {
    for (const member of unitMemberToStringArray(UNIT_LIST2[unitInfo].member)) {
      memberSet.add(member);
    }
  }
  memberSet.add('そら');

  return memberSet;
};

// ユニット一覧を文字列化する
export const unitListToString = (unitList: number[]) => {
  return unitList
    .map(
      unit =>
        `[${UNIT_LIST2[unit].score}点] ${
          UNIT_LIST2[unit].name
        } ${unitMemberToStringArray(UNIT_LIST2[unit].member).join(',')}`,
    )
    .join('\n');
};

// ユニット一覧における人数の総数
export const unitListToHumansCount = (unitList: number[]) => {
  if (unitList.length === 0) {
    return 0;
  }

  return unitList
    .map(unitInfo => UNIT_LIST[unitInfo].member.length)
    .reduce((p, c) => p + c);
};

// テンパイしているかをチェックする
export const checkTempai = (myHands: number[]) => {
  resetCache();
  // 既にアガっているかを調べる
  console.log('既にアガっているかを調べる');
  const result = calcUnitListWithSora(myHands);
  const humans = unitListToHumansCount(result.unit);
  if (humans === HANDS_SIZE) {
    window.alert('既にアガリ形です');

    return;
  }

  // テンパイしているかを調べる
  console.log('テンパイしているかを調べる');
  const result2: {
    from: number;
    to: number;
    units: string;
    score: number;
  }[] = [];
  for (let i = 0; i < myHands.length; i += 1) {
    const newHands = [...myHands];
    for (let j = 0; j < SORA_INDEX - 1; j += 1) {
      if (myHands[i] === j) {
        continue;
      }
      newHands[i] = j;
      /* eslint no-irregular-whitespace: ["error", {"skipTemplates": true}] */
      console.log(`　${IDOL_LIST[myHands[i]].name}→${IDOL_LIST[j].name}`);
      const result3 = calcUnitListWithSora(newHands);
      const humans2 = unitListToHumansCount(result3.unit);
      if (humans2 === HANDS_SIZE) {
        result2.push({
          from: myHands[i],
          to: newHands[i],
          units: result3.unit.map(u => UNIT_LIST[u].name).join(', '),
          score: result3.unit
            .map(u => UNIT_LIST2[u].score)
            .reduce((s, v) => s + v),
        });
      }
    }
  }
  if (result2.length > 0) {
    const result4: {
      from: number;
      to: number;
      units: string;
      score: number;
    }[] = [];
    const dic: { [key: string]: number } = {};
    for (const record of result2) {
      const key = `${record.from},${record.to}`;
      if (!(key in dic)) {
        result4.push(record);
        dic[key] = 1;
      }
    }
    /* eslint no-irregular-whitespace: ["error", {"skipTemplates": true}] */
    const output = result4
      .map(
        r =>
          `・${IDOL_LIST[r.from].name}→${IDOL_LIST[r.to].name}　${r.score}\n`,
      )
      .join('');
    window.alert(`テンパイ形：\n${output}`);

    return;
  }
  window.alert('イーシャンテン以上です');
};
