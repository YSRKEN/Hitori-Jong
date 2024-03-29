import {
  TILE_DECK_SIZE,
  IDOL_LIST_LENGTH,
  MAX_IDOL_COUNTS,
  UnitInfo,
  IDOL_LIST,
  Int64,
  INT64_ZERO,
  SORA_INDEX,
  IDOL_LIST_LENGTH2,
  HANDS_SIZE,
  nameToIndex,
} from 'constant';
import { UNIT_LIST } from 'unit_list';

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
    let gameScore2 = 0;
    if (record.member.length === 1) {
      gameScore = 1000;
      gameScore2 = 1000;
    } else if (record.member.length === 2) {
      gameScore = 2000;
      gameScore2 = 1000;
    } else {
      gameScore = (record.member.length - 1) * 2000;
      gameScore2 = (record.member.length - 2) * 2000;
    }
    unitList2.push({
      name: record.name,
      member: memberKey,
      member2: memberArray,
      score: gameScore,
      score2: gameScore2,
    });
  }

  return unitList2;
};
export const UNIT_LIST2 = convertUnitList();

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

// 候補の組み合わせについて調べる
const cache: { [key: string]: number[][] } = {};
const calcUnitPatterns = (roughCount: number[]) => {
  const key = roughCount.map(i => i.toString()).join(',');
  if (key in cache) {
    return cache[key];
  }

  let patterns: number[][] = [];
  for (const count of roughCount) {
    const temp = Array(count + 1);
    for (let i = 0; i <= count; i += 1) {
      temp[i] = count - i;
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

  cache[key] = patterns;

  return patterns;
};

// スコア計算
const calcScore = (pattern: number[], unitList: number[], mainIdolIndex: number) => {
  // スコアを計算
  let score = 0;
  let score2 = 0;
  let tileCount = 0;
  let mainIdolFlg = false;
  for (let i = 0; i < pattern.length; i += 1) {
    if (UNIT_LIST2[unitList[i]].member2[mainIdolIndex] === 1) {
      mainIdolFlg = true;
    }
    score += pattern[i] * UNIT_LIST2[unitList[i]].score;
    score2 += pattern[i] * UNIT_LIST2[unitList[i]].score2;
    tileCount += pattern[i] * UNIT_LIST[unitList[i]].member.length;
  }
  if (mainIdolFlg) {
    score += 2000;
    score2 += 2000;
  }
  if (tileCount === HANDS_SIZE) {
    return score;
  } else {
    return score2;
  }
};

// アイドル53種それぞれについて、ユニット毎の採用数×ユニット毎の指定アイドルの枚数の総和と、手牌とを比較する
const isValidPattern = (
  pattern: number[],
  myHandsArray: number[],
  unitList2: number[][],
) => {
  for (let ti = 0; ti < IDOL_LIST_LENGTH2; ti += 1) {
    let sum = 0;
    for (let pi = 0; pi < pattern.length; pi += 1) {
      sum += pattern[pi] * unitList2[pi][ti];
    }
    if (sum > myHandsArray[ti]) {
      return false;
    }
  }

  return true;
};

// 手役に対して、どのユニットの組み合わせを取れば高得点かを計算する
// ・myHandsArray……要素数IDOL_LIST_LENGTH2(53)、各アイドルの枚数が記録されている
// ・unitList……適合するユニット番号が記録されている
// ・unitListから、各ユニットの「要素数IDOL_LIST_LENGTH2(53)」を取得し、
//   それをどう組み合わせれば高得点かを勘案する
const calcUnitListFine = (myHandsArray: number[], unitList: number[], mainIdolIndex: number) => {
  // unitListの各要素について、「それぞれのアイドルが何枚あるか」の配列に変換する
  const unitList2 = unitList.map(id => UNIT_LIST2[id].member2);

  // unitList2の各要素について、myHandsArray内で何回割り当てられるかを計算する
  const roughCount = unitList2.map(unitData =>
    calcCount(myHandsArray, unitData),
  );

  // 割当可能回数から、全割当パターンを算出する
  const patterns = calcUnitPatterns(roughCount);

  // 各割当パターンについて、実行可能性とスコア計算を実施し、最大のものを採用する
  let maxScore = 0;
  let fineList: number[] = [];
  for (let x = 0; x < patterns.length; x += 1) {
    const record = patterns[x];
    // スコアを計算
    const score = calcScore(record, unitList, mainIdolIndex);
    if (score > maxScore) {
      // 実行可能性を判断
      if (isValidPattern(record, myHandsArray, unitList2)) {
        maxScore = score;
        const temp2: number[] = [];
        for (let i = 0; i < record.length; i += 1) {
          for (let j = 0; j < record[i]; j += 1) {
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
const cache2: { [key: string]: number[] } = {};
export const calcUnitList = (myHands: number[], mainIdolIndex: number) => {
  const key = myHands.map(i => i.toString()).join(',') + `,${mainIdolIndex}`;
  if (key in cache2) {
    return cache2[key];
  }

  // 可能な手役の一覧を列挙する
  const myHandsBit = calcHandsBit(myHands);
  const roughList = calcUnitListRough(myHandsBit);

  // どの手役を使うと最高得点が取れるかを判断する
  const myHandsArray = calcHandsArray(myHands);
  const fineList = calcUnitListFine(myHandsArray, roughList, mainIdolIndex);

  cache2[key] = fineList;

  return fineList;
};

// ユニット一覧からスコア計算する
export const unitListToScore = (unitList: number[], mainIdolIndex: number) => {
  if (unitList.length === 0) {
    return 0;
  }

  return unitList
    .map(unit => {
      if (UNIT_LIST2[unit].member2[mainIdolIndex] === 1) {
        return UNIT_LIST2[unit].score * 2;
      } else {
        return UNIT_LIST2[unit].score;
      }
    })
    .reduce((sum: number, val: number) => sum + val);
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
export const checkTempai = (myHands: number[], mainIdolIndex: number) => {
  console.log('テンパイ判定');
  const startTime = Date.now();
  // 既にアガっているかを調べる
  console.log('既にアガっているかを調べる');
  const result = calcUnitList(myHands, mainIdolIndex);
  const humans = unitListToHumansCount(result);
  if (humans === HANDS_SIZE) {
    console.log(`${Date.now() - startTime}[ms]`);
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

      const result3 = calcUnitList(newHands, mainIdolIndex);
      const humans2 = unitListToHumansCount(result3);
      if (humans2 === HANDS_SIZE) {
        result2.push({
          from: myHands[i],
          to: newHands[i],
          units: result3.map(u => UNIT_LIST[u].name).join(', '),
          score: result3
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
    const dic2: { [key: string]: string } = {};
    for (const r of result4) {
      const key = IDOL_LIST[r.from].name;
      if (!(key in dic2)) {
        dic2[key] = '';
      }
      dic2[key] = `${dic2[key]}${IDOL_LIST[r.to].name}(${r.score}) `;
    }
    console.log(`${Date.now() - startTime}[ms]`);
    let output = '';
    for (const key of Object.keys(dic2)) {
      /* eslint no-irregular-whitespace: ["error", {"skipTemplates": true}] */
      output += `・${key}→\n　${dic2[key]}\n`;
    }
    window.alert(`テンパイ形：\n${output}`);

    return;
  }
  console.log(`${Date.now() - startTime}[ms]`);
  window.alert('イーシャンテン以上です');
};

export const calcReachUnitList = (myHands: number[]) => {
  // リーチ役＝素の配牌＋1枚で完成する役。言い換えると、
  // 「元の手牌では作れないが1枚追加すると作れる」という意味

  // 素の配牌でとりえる役を列挙する
  const myHandsBit = calcHandsBit(myHands);
  const roughList = calcUnitListRough(myHandsBit);

  // 1枚追加した配牌でとり得る役を列挙する
  const appendUnitDict: { [key: number]: number[] } = {};
  for (let i = 0; i < SORA_INDEX - 1; i += 1) {
    const temp = [...myHands];
    temp.push(i);
    const tempHandsBit = calcHandsBit(temp);
    const tempRoughList = calcUnitListRough(tempHandsBit);
    for (const unitIndex of tempRoughList) {
      if (!roughList.includes(unitIndex)) {
        if (!(i in appendUnitDict)) {
          appendUnitDict[i] = [];
        }
        if (!appendUnitDict[i].includes(unitIndex)) {
          appendUnitDict[i].push(unitIndex);
        }
      }
    }
  }

  return appendUnitDict;
};

export const calcReachUnitListWithSora = (myHands: number[]) => {
  return calcReachUnitList(myHands);
};

// どの牌にチェックを入れるかを表示する
export const unitListToHandsBoldFlg = (
  myHands: number[],
  unitList: number[],
) => {
  const handsBoldFlg = Array(myHands.length);
  handsBoldFlg.fill(false);
  for (const unitIndex of unitList) {
    const unitMembers = UNIT_LIST[unitIndex].member;
    const unitMemberIndex = unitMembers.map((name: string) =>
      nameToIndex(name),
    );
    for (const unitMember of unitMemberIndex) {
      for (let i = 0; i < myHands.length; i += 1) {
        if (handsBoldFlg[i] === false && myHands[i] === unitMember) {
          handsBoldFlg[i] = true;
          break;
        }
      }
    }
  }

  return handsBoldFlg;
};

// 成立役とリーチ役の成立状況を調べる
export const checkUnits = (myHands: number[], mainIdolIndex: number) => {
  let output = '【成立役】\n';
  const result1 = calcUnitList(myHands, mainIdolIndex);
  let mainIdolFlg = false;
  const millionLiveFlg = result1.length > 0 && result1.map(u => UNIT_LIST[u].member.length).reduce((s, v) => s + v) === HANDS_SIZE;
  for (const unitIndex of result1) {
    const unit = UNIT_LIST[unitIndex];
    if (UNIT_LIST2[unitIndex].member2[mainIdolIndex] === 1) {
      mainIdolFlg = true;
    }
    if (millionLiveFlg) {
      output += `${unit.name}　${unit.member.join(', ')}　${UNIT_LIST2[unitIndex].score}点\n`;
    } else {
      output += `${unit.name}　${unit.member.join(', ')}　${UNIT_LIST2[unitIndex].score2}点\n`;
    }
  }
  if (mainIdolFlg) {
    output += '＋担当ボーナス　2000点\n';
  }

  output += '\n【担当役】\n';
  for (let unitIndex = 0; unitIndex < UNIT_LIST.length; unitIndex += 1) {
    if (UNIT_LIST2[unitIndex].member2[mainIdolIndex] === 1) {
      const unitMemberIndex = UNIT_LIST[unitIndex].member.map((name: string) =>
        nameToIndex(name),
      );
      let count = 0;
      for (const unitMember of unitMemberIndex) {
        if (myHands.includes(unitMember)) {
          count += 1;
        }
      }
      output += `${count === unitMemberIndex.length ? '☆' : '　'}[${count}/${unitMemberIndex.length}]　${UNIT_LIST[unitIndex].member.length}人　${UNIT_LIST[unitIndex].name}　${UNIT_LIST[unitIndex].member.join(', ')}　${UNIT_LIST2[unitIndex].score}点\n`;
    }
  }

  output += '\n【リーチ役(鳴けるもののみ)】\n';
  const result2 = calcReachUnitListWithSora(myHands);
  for (const memberIndexStr of Object.keys(result2)) {
    const memberIndex = parseInt(memberIndexStr, 10);
    const member = IDOL_LIST[memberIndex].name;
    const temp = result2[memberIndex]
      .map(unitIndex => UNIT_LIST[unitIndex])
      .filter(unit => unit.member.length >= 3);
    if (temp.length >= 1) {
      /* eslint no-irregular-whitespace: ["error", {"skipTemplates": true}] */
      output += `＋${member}　${temp
        .map(unit => `\n　${unit.member.length}人 ${unit.name}(${unit.member.join(', ')})`)
        .join('')}\n`;
    }
  }

  output += '\n【リーチ役(その他)】\n';
  for (const memberIndexStr of Object.keys(result2)) {
    const memberIndex = parseInt(memberIndexStr, 10);
    const member = IDOL_LIST[memberIndex].name;
    const temp = result2[memberIndex]
      .map(unitIndex => UNIT_LIST[unitIndex])
      .filter(unit => unit.member.length <= 2);
    if (temp.length >= 1) {
      /* eslint no-irregular-whitespace: ["error", {"skipTemplates": true}] */
      output += `＋${member}　${temp
        .map(unit => `\n　${unit.name}(${unit.member.join(', ')})`)
        .join('')}\n`;
    }
  }
  return output;
};

// 成立役に従い自動で理牌する
export const sortHands = (myHands: number[], mainIdolIndex: number) => {
  // 成立役を調べる
  const result = calcUnitList(myHands, mainIdolIndex);

  // 成立役に従い理牌を実施。手順としては、
  // ・そらさん補完後の手牌(result.hands)に対して、手役(result.unit)でラベリングを実施
  // ・ラベリング結果に従い、通常手牌(myHands)をソート
  //  ソート結果を新たな手牌とする
  const newMyHandsIndex = Array(myHands.length);
  newMyHandsIndex.fill(-1);
  let index = 0;
  for (const unitIndex of result) {
    const unitMemberIndex = UNIT_LIST[unitIndex].member.map((name: string) =>
      nameToIndex(name),
    );
    for (const mi of unitMemberIndex) {
      for (let hi = 0; hi < myHands.length; hi += 1) {
        if (myHands[hi] === mi && newMyHandsIndex[hi] < 0) {
          newMyHandsIndex[hi] = index;
          index += 1;
          break;
        }
      }
    }
  }
  for (let hi = 0; hi < myHands.length; hi += 1) {
    if (newMyHandsIndex[hi] < 0) {
      newMyHandsIndex[hi] = index;
      index += 1;
    }
  }

  const newMyHands = Array(myHands.length);
  for (let hi = 0; hi < myHands.length; hi += 1) {
    newMyHands[newMyHandsIndex[hi]] = myHands[hi];
  }

  return newMyHands;
};
