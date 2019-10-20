import {
  Hand,
  HAND_TILE_SIZE,
  HAND_TILE_SIZE_PLUS,
  IdolCountArray,
  MILLION_SCORE,
} from 'constant/other';
import { IDOL_LIST, IDOL_LIST_COUNT, KANA_LIST } from 'constant/idol';
import { UNIT_LIST } from 'constant/unit';
import { range, createFilledArray } from './UtilityService';

// 文字で表されたアイドル一覧を数字一覧に変換する
export const stringToNumber = (memberList: string[]) => {
  return memberList.map(member =>
    IDOL_LIST.findIndex(idol => idol.name === member),
  );
};

// かなとアイドルの対応表を作成する
const calcKanaToIdol = (): { kana: string; idol: number[] }[] => {
  return KANA_LIST.split('').map(kana => {
    return {
      kana,
      idol: range(IDOL_LIST.length).filter(
        i => IDOL_LIST[i].kana.substring(0, 1).replace('じ', 'し') === kana,
      ),
    };
  });
};
export const KANA_TO_IDOL_LIST: {
  kana: string;
  idol: number[];
}[] = calcKanaToIdol();

// ユニットの情報
export interface UnitInfo {
  name: string;
  member: number[];
  memberCount: number;
  memberICA: IdolCountArray;
  score: number;
  scoreWithChi: number;
}

// ユニット情報を、プログラム上から扱いやすい形式に変換する
const toUnitInfo = (name: string, member: string[]): UnitInfo => {
  const calcScore = (length: number) => {
    if (length <= 1) {
      return 1000;
    }

    return (length - 1) * 2000;
  };
  const memberIndex = member.map(m =>
    IDOL_LIST.findIndex(idol => idol.name === m),
  );
  const memberICA: IdolCountArray = Array<number>(IDOL_LIST_COUNT);
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    memberICA[i] = 0;
  }
  for (const member2 of memberIndex) {
    memberICA[member2] += 1;
  }

  return {
    name,
    member: memberIndex,
    memberCount: member.length,
    memberICA,
    score: calcScore(member.length),
    scoreWithChi: calcScore(member.length - 1),
  };
};

// ユニット一覧(整形後)
export const UNIT_LIST2: UnitInfo[] = UNIT_LIST.map(record =>
  toUnitInfo(record.name, record.member),
);

// ソート前の手牌Aとソート後の手牌Bとの対応を調べる。
// 引数のunitsがA、戻り値outputがBに対応する。
// output[X] = iならば、B[X] = A[i]となる
const calcSortedIndex = (units: number[], unitCount: number) => {
  const output = Array<number>(units.length);
  let index = 0;
  for (let i = 0; i < unitCount; i += 1) {
    for (let j = 0; j < units.length; j += 1) {
      if (units[j] === i) {
        output[index] = j;
        index += 1;
      }
    }
  }
  for (let j = 0; j < units.length; j += 1) {
    if (units[j] === -1) {
      output[index] = j;
      index += 1;
    }
  }

  return output;
};

// 表示用に並び替えた手牌一覧を返す
export const calcShowMembers = (hand: Hand): number[] => {
  // ソート前の手牌Aとソート後の手牌Bとの対応を調べる
  const sortedIndex = calcSortedIndex(hand.units, hand.unitIndexes.length);

  // sortedIndexを利用してソートを行う
  return [...sortedIndex.map(index => hand.members[index]), hand.plusMember];
};

// チェックされた牌を含むユニットを解除した後の手牌を生成する
export const ejectUnit = (hand: Hand, handCheckFlg: boolean[]): Hand => {
  // ソート前の手牌Aとソート後の手牌Bとの対応を調べる
  const sortedIndex = calcSortedIndex(hand.units, hand.unitIndexes.length);

  // ↑から、ソート前のどの位置の牌を選択されているかを調べ、それからどの種類のユニットを選択されているかを調べる
  const checkedUnitSet = new Set(
    range(HAND_TILE_SIZE)
      .filter(i => handCheckFlg[i])
      .map(i => hand.units[sortedIndex[i]])
      .filter(unitIndex => unitIndex >= 0),
  );

  // 選択されたユニットを解除した、新たなHandを生成する
  const unitConvertionDict: { [key: number]: number } = {};
  unitConvertionDict[-1] = -1;
  let newUnitIndex = 0;
  for (let i = 0; i < hand.unitIndexes.length; i += 1) {
    if (checkedUnitSet.has(i)) {
      unitConvertionDict[i] = -1;
    } else {
      unitConvertionDict[i] = newUnitIndex;
      newUnitIndex += 1;
    }
  }
  const newUnitIndexes: number[] = [];
  const newUnitChiFlg: boolean[] = [];
  for (let i = 0; i < hand.unitIndexes.length; i += 1) {
    if (!checkedUnitSet.has(i)) {
      newUnitIndexes.push(hand.unitIndexes[i]);
      newUnitChiFlg.push(hand.unitChiFlg[i]);
    }
  }

  return {
    members: [...hand.members],
    units: hand.units.map(i => unitConvertionDict[i]),
    unitIndexes: newUnitIndexes,
    unitChiFlg: newUnitChiFlg,
    plusMember: hand.plusMember,
  };
};

// ユニットを組んでいるメンバーの総数を数える
export const calcHandUnitLengthSum = (hand: Hand) => {
  if (hand.unitIndexes.length === 0) {
    return 0;
  }

  return hand.unitIndexes
    .map(index => UNIT_LIST2[index].memberCount)
    .reduce((p, c) => p + c);
};

// チェックされた牌を左にシフトした後の手牌を生成する
export const shiftTileLeft = (hand: Hand, handCheckFlg: boolean[]): Hand => {
  // ソート前の手牌Aとソート後の手牌Bとの対応を調べる
  // sortedIndex[X] = i ⇔ B[X] = A[i]
  const sortedIndex = calcSortedIndex(hand.units, hand.unitIndexes.length);

  // ソート後の手牌Bとシフト後の手牌Cとの対応を調べ、交換を実施する
  const handUnitLengthSum = calcHandUnitLengthSum(hand);
  const shiftedmembers = [...hand.members];
  for (let i = handUnitLengthSum + 1; i < HAND_TILE_SIZE; i += 1) {
    if (handCheckFlg[i]) {
      const temp = shiftedmembers[sortedIndex[i]];
      shiftedmembers[sortedIndex[i]] = shiftedmembers[sortedIndex[i - 1]];
      shiftedmembers[sortedIndex[i - 1]] = temp;
    }
  }

  return {
    members: shiftedmembers,
    units: [...hand.units],
    unitIndexes: [...hand.unitIndexes],
    unitChiFlg: [...hand.unitChiFlg],
    plusMember: hand.plusMember,
  };
};

// チェックされた牌を右にシフトした後の手牌を生成する
export const shiftTileRight = (hand: Hand, handCheckFlg: boolean[]): Hand => {
  // ソート前の手牌Aとソート後の手牌Bとの対応を調べる
  // sortedIndex[X] = i ⇔ B[X] = A[i]
  const sortedIndex = calcSortedIndex(hand.units, hand.unitIndexes.length);

  // ソート後の手牌Bとシフト後の手牌Cとの対応を調べ、交換を実施する
  const handUnitLengthSum = calcHandUnitLengthSum(hand);
  const shiftedmembers = [...hand.members];
  for (let i = handUnitLengthSum; i < HAND_TILE_SIZE - 1; i += 1) {
    if (handCheckFlg[i]) {
      const temp = shiftedmembers[sortedIndex[i]];
      shiftedmembers[sortedIndex[i]] = shiftedmembers[sortedIndex[i + 1]];
      shiftedmembers[sortedIndex[i + 1]] = temp;
    }
  }

  return {
    members: shiftedmembers,
    units: [...hand.units],
    unitIndexes: [...hand.unitIndexes],
    unitChiFlg: [...hand.unitChiFlg],
    plusMember: hand.plusMember,
  };
};

// チェックされた牌で構成されたユニットを追加した後の手牌を生成する
export const injectUnit = (
  hand: Hand,
  handCheckFlg: boolean[],
  chiFlg: boolean,
): Hand => {
  // ソート前の手牌Aとソート後の手牌Bとの対応を調べる
  // sortedIndex[X] = i ⇔ B[X] = A[i]
  const sortedIndex = calcSortedIndex(hand.units, hand.unitIndexes.length);

  // チェックした位置の牌の一覧を取り出す
  const idolList = range(HAND_TILE_SIZE)
    .filter(i => handCheckFlg[i])
    .map(i => hand.members[sortedIndex[i]]);
  const idolSet = new Set(idolList);

  // 完全に一致するユニットを検索する
  let unitIndex = -1;
  for (let i = 0; i < UNIT_LIST2.length; i += 1) {
    const unit = UNIT_LIST2[i];
    if (unit.memberCount !== idolList.length) {
      continue;
    }
    let flg = true;
    for (const member of unit.member) {
      if (!idolSet.has(member)) {
        flg = false;
        break;
      }
    }
    if (flg) {
      unitIndex = i;
      break;
    }
  }

  // 一致するユニットがいれば、そのユニットを割り当てる
  if (unitIndex >= 0) {
    const unitId = hand.unitIndexes.length;
    const newUnits = [...hand.units];
    range(HAND_TILE_SIZE)
      .filter(i => handCheckFlg[i])
      .forEach(i => {
        newUnits[sortedIndex[i]] = unitId;
      });

    return {
      members: [...hand.members],
      units: newUnits,
      unitIndexes: [...hand.unitIndexes, unitIndex],
      unitChiFlg: [...hand.unitChiFlg, chiFlg],
      plusMember: hand.plusMember,
    };
  }

  return {
    members: [...hand.members],
    units: [...hand.units],
    unitIndexes: [...hand.unitIndexes],
    unitChiFlg: [...hand.unitChiFlg],
    plusMember: hand.plusMember,
  };
};

// 選択した手牌を指定したメンバーと置き換えた後の手牌を生成する
export const changeMember = (
  hand: Hand,
  selectedIdolSortedIndex: number,
  selectIdolIndex: number,
): Hand => {
  if (selectedIdolSortedIndex === HAND_TILE_SIZE_PLUS - 1) {
    return {
      members: [...hand.members],
      units: [...hand.units],
      unitIndexes: [...hand.unitIndexes],
      unitChiFlg: [...hand.unitChiFlg],
      plusMember: selectIdolIndex,
    };
  }
  // ソート前の手牌Aとソート後の手牌Bとの対応を調べる
  // sortedIndex[X] = i ⇔ B[X] = A[i]
  const sortedIndex = calcSortedIndex(hand.units, hand.unitIndexes.length);

  // 新しい手牌を生成する
  const newMembers = [...hand.members];
  newMembers[sortedIndex[selectedIdolSortedIndex]] = selectIdolIndex;

  return {
    members: newMembers,
    units: [...hand.units],
    unitIndexes: [...hand.unitIndexes],
    unitChiFlg: [...hand.unitChiFlg],
    plusMember: hand.plusMember,
  };
};

// zip関数
const zip = <T, U>(t: T[], u: U[]) => {
  return range(t.length).map(i => {
    return { first: t[i], second: u[i] };
  });
};

// ユニットに組み込まれていない手牌を選択する
// addFlg = trueならツモ牌も選択する
const selectFreeMembers = (hand: Hand, addFlg: boolean): number[] => {
  if (addFlg) {
    return [...zip(hand.members, hand.units).filter(pair => pair.second < 0).map(pair => pair.first), hand.plusMember];
  } else {
    return zip(hand.members, hand.units).filter(pair => pair.second < 0).map(pair => pair.first);
  }
}

// メンバーを表示(デバッグ用)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showMembers = (members: number[], message: string) => {
  console.log(`${message}：${members.map(i => IDOL_LIST[i].name).join('、')}`);
};

// ユニットを表示(デバッグ用)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showUnits = (unitIndexes: number[], message: string, unitChiFlg: boolean[] = []) => {
  if (unitChiFlg.length === 0) {
    console.log(`${message}：${unitIndexes.map(i => UNIT_LIST2[i].name).join('、')}`);
  } else {
    console.log(`${message}：${zip(unitIndexes, unitChiFlg).map(pair => UNIT_LIST2[pair.first].name + (pair.second ? '(チー)' : '')).join('、')}`);
  }
};

// 後X枚あれば揃うユニットを検索する
const findUnitFromMembers = (members: number[], x: number): { id: number, member: number[], nonMember: number[] }[] => {
  const memberSet = new Set(members);
  const temp = UNIT_LIST2.map((unit, index) => {
    return {
      id: index,
      member: unit.member.filter(i => memberSet.has(i)),
      nonMember: unit.member.filter(i => !memberSet.has(i))
    }
  }).filter(record => record.nonMember.length === x);
  return temp.sort((a, b) => b.member.length - a.member.length);
};

// 後0・1・2枚あれば完成するユニット一覧を生成する
// ただし、既にユニットを組んでいる牌は使えないとする。
// また、残数がX枚の時、(X+1)人以上のユニットは選択しないとする
export const findUnit = (hand: Hand): { id: number; member: number[] }[][] => {
  // 「ユニットに組み込まれていない手牌＋ツモ牌」を選択する
  const freeMembers = selectFreeMembers(hand, true);

  // 新しくユニットを構成できる最大枚数を算出する
  const maxUnitMembers = freeMembers.length;

  // ユニットを検索する
  return [0, 1, 2].map(x => {
    return findUnitFromMembers(freeMembers, x)
      .filter(record => UNIT_LIST2[record.id].memberCount <= maxUnitMembers);
  });
};

// アイドルIDの配列を、各アイドルの枚数の配列(ICA)に変換する。
// 前者をA、後者をBとした場合、アイドルID=iがA内にj件あると、B[i] = j
export const memberListToICA = (memberList: number[]) => {
  const idolCountArray: IdolCountArray = createFilledArray(IDOL_LIST_COUNT, 0);
  for (const member of memberList) {
    idolCountArray[member] += 1;
  }

  return idolCountArray;
};

// ICA型の値でA - Bを計算する
export const minusICA = (
  a: IdolCountArray,
  b: IdolCountArray,
): IdolCountArray => {
  return zip(a, b).map(pair => pair.first - pair.second);
};

// ICA型の値でA // Bを計算する
export const divideICA = (a: IdolCountArray, b: IdolCountArray): number => {
  let output = 3;
  zip(a, b).forEach(pair => {
    if (pair.second > 0) {
      if (pair.first === 0) {
        return 0;
      } else {
        output = Math.min(output, Math.floor(pair.first / pair.second));
      }
    }
  });
  return output;
};

// ICA型の値でA * x + Bを計算する
export const fmaICA = (a: IdolCountArray, x: number, b: IdolCountArray): IdolCountArray => {
  return zip(a, b).map(pair => pair.first * x + pair.second);
};

// ICA型の値について、そのタイルの枚数を計算する
export const countICA = (a: IdolCountArray): number => {
  return a.reduce((p, v) => p + v);
};

// 既存のユニットにおける点数を計算する
export const calcPreScore = (hand: Hand) => {
  if (hand.unitIndexes.length === 0) {
    return 0;
  }
  return zip(hand.unitIndexes, hand.unitChiFlg)
    .map(pair => pair.second ? UNIT_LIST2[pair.first].scoreWithChi : UNIT_LIST2[pair.first].score)
    .reduce((p, c) => p + c);
};

// a>=bならtrue
export const hasICA = (a: IdolCountArray, b: IdolCountArray): boolean => {
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    if (a[i] < b[i]) {
      return false;
    }
  }
  return true;
};

// メンバーから取りうるユニット一覧を算出する
const findUnitICAFromMemberICA = (
  memberICA: IdolCountArray,
  preCompletedUnits: { id: number, score: number, ica: IdolCountArray }[])
  : { id: number, score: number, ica: IdolCountArray }[] => {
  const temp: { id: number, count: number, score: number, ica: IdolCountArray }[] = [];

  const unitList = preCompletedUnits.length === 0
    ? UNIT_LIST2.map((unit, index) => { return {id: index, count: unit.memberCount, score: unit.score, ica: unit.memberICA}; })
    : preCompletedUnits;

  for (const record of unitList) {
    if (!hasICA(memberICA, record.ica)) {
      continue;
    }
    temp.push({ id: record.id, count: UNIT_LIST2[record.id].memberCount, score: record.score, ica: record.ica });
  }
  return temp.sort((a, b) => b.count - a.count).map(record => {
    return {id: record.id, score: record.score, ica: record.ica};
  });
};

// 全ての要素の値が0か？
const isZero = (a: IdolCountArray) => {
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    if (a[i] > 0) {
      return false;
    }
  }
  return true;
}

// 与えられた手牌から完成しているユニットの組み合わせを検索する。
// 最も高得点な組み合わせを戻り値として返す
const fBPcache: {[key: string]: {unit: number[], score: number}} = {};
export const findBestUnitPattern = (
  memberICA: IdolCountArray,
  preCompletedUnits: { id: number, score: number, ica: IdolCountArray }[] = [])
  : {unit: number[], score: number} => {
  const key = memberICA.map(i => `${i}`).join(',');
  if (key in fBPcache) {
    return fBPcache[key];
  }

    // 手牌を使い切った＝アガリなのでボーナスを付与する
  if (isZero(memberICA)) {
    fBPcache[key] = {unit: Array<number>(), score: MILLION_SCORE};
    return {unit: Array<number>(), score: MILLION_SCORE};
  }

  // 考えられるユニットの候補を検索する
  const completedUnits = findUnitICAFromMemberICA(memberICA, preCompletedUnits);

  // いずれかのユニットを選択する
  let bestResult = {unit: Array<number>(), score: 0};
  for (const completedUnit of completedUnits) {
    const result = findBestUnitPattern(minusICA(memberICA, completedUnit.ica), completedUnits);
    if (bestResult.score < result.score + completedUnit.score) {
      bestResult = {unit: [...result.unit, completedUnit.id], score: result.score + completedUnit.score};
    }
  }
  fBPcache[key] = bestResult;
  return bestResult;
};

// ロンできる牌、およびチーできる牌について検索を行う
export const findWantedIdol = (hand: Hand): {
  ron: {member: number, unit: {id: number, chiFlg: boolean}[]}[],
  chi: {member: number, unit: number, otherMember: number[]}[]} => {
  const startTime = Date.now();
  
  // 「ユニットに組み込まれていない手牌」を選択する
  const freeMembers = selectFreeMembers(hand, false);

  // 既に完成しているユニット、および後1枚で完成するユニットを検索する
  const completedUnits = findUnitFromMembers(freeMembers, 0);
  const reachedUnits = findUnitFromMembers(freeMembers, 1);

  // 既に完成しているユニットでもとりあえず「鳴く」ことはできることを利用して、
  // 「アガリ牌の可能性がある」一覧を取り出す
  const wantedIdolCandiList = Array.from(new Set(reachedUnits.map(record => record.nonMember).flat()));
  completedUnits.forEach(record => {
    record.member.forEach(member => {
      if (!wantedIdolCandiList.includes(member)) {
        wantedIdolCandiList.push(member);
      }
    });
  });

  // 順に確かめる
  const ronList: {member: number, unit: {id: number, chiFlg: boolean}[]}[] = [];
  for (const wantedIdolCandi of wantedIdolCandiList) {
    // 手牌を完成させる
    const freeMembers2 = [...freeMembers, wantedIdolCandi];

    // 最も高得点な組み合わせを探索する
    const result: {unit: number[], score: number} = findBestUnitPattern(memberListToICA(freeMembers2));

    // ロン上がりできる＝スコアがMILLION_SCORE以上
    if (result.score >= MILLION_SCORE) {
      const handUnits = zip(hand.unitIndexes, hand.unitChiFlg).map(pair => {
        return {id: pair.first, chiFlg: pair.second}
      });
      const resultUnits = result.unit.map(i => {
        return {id: i, chiFlg: false};
      });
      ronList.push({
        member: wantedIdolCandi,
        unit: [...handUnits, ...resultUnits]
      });
    }
  }

  const ronIdolSet = new Set(ronList.map(record => record.member));
  const chiList: {member: number, unit: number, otherMember: number[]}[] = reachedUnits.map(record => {
    return {member: record.nonMember[0], unit: record.id, otherMember: record.member};
  }).filter(record => !ronIdolSet.has(record.member) && record.otherMember.length >= 2)
  .sort((a, b) => a.member - b.member);

  console.log(`処理時間：${Date.now() - startTime}[ms]`);

  return {ron: ronList, chi: chiList};
};
