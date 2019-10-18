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
const showMembers = (members: number[], message: string) => {
  console.log(`${message}：${members.map(i => IDOL_LIST[i].name).join('、')}`);
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

// ロンできる牌、およびチーできる牌について検索を行う
export const findWantedIdol = (hand: Hand) => {
  // 「ユニットに組み込まれていない手牌」を選択する
  const freeMembers = selectFreeMembers(hand, false);

  // 新しくユニットを構成できる最大枚数を算出する
  const maxUnitMembers = freeMembers.length + 1;

  // 既に完成しているユニット、および後1枚で完成するユニットを検索する
  const completedUnits = findUnitFromMembers(freeMembers, 0)
    .filter(record => UNIT_LIST2[record.id].memberCount <= maxUnitMembers);
  const reachedUnits = findUnitFromMembers(freeMembers, 1)
    .filter(record => UNIT_LIST2[record.id].memberCount <= maxUnitMembers);

  // 既に完成しているユニットでもとりあえず「鳴く」ことはできることを利用して、
  // 「アガリ牌の可能性がある」一覧を取り出す
  const wantedIdolCandiList = Array.from(new Set([
    ...completedUnits.map(record => record.member).flat(),
    ...reachedUnits.map(record => record.nonMember).flat()
  ]));
  
  console.log(completedUnits);
  console.log(reachedUnits);
  showMembers(wantedIdolCandiList, '候補');

  // 順に確かめる
  for (const wantedIdolCandi of wantedIdolCandiList) {
    // とりうるユニットの可能性＝既に完成しているユニット＋選択したユニット
    
  }

  console.log('完了');
/*
  // リーチ状態のユニット1つ＋完成したユニットで残りを構成できるかを調べる(ロン検索)
  const memberArray = memberListToICA(memberList);
  reachedUnitList.forEach(pair => {
    console.log(`${UNIT_LIST2[pair.id].name} ＋${IDOL_LIST[pair.nonMember].name}`);
    // 「ユニットに組み込まれていない手牌」から、「リーチ状態のユニット」を取り除いた手牌
    const newMemberArray = minusICA(memberArray, memberListToICA(pair.member));

    // newMemberArrayに含まれているユニットと、そのユニットをnewMemberArrayから何回取れるかの情報
    const unitIdAndCount = completedUnitList
      .map(i => {
        const unit = UNIT_LIST2[i];
        const count = divideICA(newMemberArray, unit.memberICA);

        return { id: i, count };
      })
      .filter(pair2 => pair2.count > 0);
    if (newMemberArray.filter(count => count !== 0).length === 0) {
      // アガリ
      console.log(`　必要牌：${IDOL_LIST[pair.nonMember].name}`);
      console.log(`　点数：${UNIT_LIST2[pair.id].score + calcPreScore(hand)}`);
      const units1 = range(hand.unitIndexes.length).map(i => {return {id: hand.unitIndexes[i], flg: hand.unitChiFlg[i]};});
      const unitsAll = [...units1, {id: pair.id, flg: false}];
      const unitsAllString = unitsAll.map(pair => `${UNIT_LIST2[pair.id].name}${pair.flg ? '(チー)' : ''}`).join(', ');
      console.log(`　ユニット：${unitsAllString}`);
      return;
    }
    if (unitIdAndCount.length === 0) {
      return;
    }

    // unitIdAndCountに含まれるユニットの組み合わせでnewMemberArrayを構成できるかを検索する
    const unitPattern: number[] = unitIdAndCount.map(pair => pair.count);
    const allPattern = unitPattern.map(count => count + 1).reduce((p, c) => p * c);
    const newMemberCount = countICA(newMemberArray);
    let maxScorePattern: number[] = [];
    let maxScore: number = 0;
    for (let count = 0; count < allPattern; count += 1) {
      // 指定したパターンにおけるスコアを計算する
      let score = 0;
      let tileCount = 0;
      for (let i = 0; i < unitIdAndCount.length; i += 1) {
        score += UNIT_LIST2[unitIdAndCount[i].id].score * unitPattern[i];
        tileCount += UNIT_LIST2[unitIdAndCount[i].id].memberCount * unitPattern[i];
      }
      if (tileCount === newMemberCount) {
        score += MILLION_SCORE;
      }

      // スコアが既存の最高点を上回らない場合は無視する
      if (maxScore < score) {
        // 指定したパターンにおける、各牌の枚数を計算する
        let unitAllICA: number[] = createFilledArray(IDOL_LIST_COUNT, 0);
        for (let i = 0; i < unitIdAndCount.length; i += 1) {
          unitAllICA = fmaICA(UNIT_LIST2[unitIdAndCount[i].id].memberICA, unitPattern[i], unitAllICA);
        }

        // 各牌の枚数が既存の枚数を上回らないことを確認する
        let flg = true;
        for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
          if (unitAllICA[i] > newMemberArray[i]) {
            flg = false;
            break;
          }
        }
        if (flg) {
          maxScore = score;
          maxScorePattern = [...unitPattern];
        }
      }

      // unitPatternをインクリメントする
      let decrementFlg = false;
      for (let i = 0; i < unitIdAndCount.length; i += 1) {
        if (unitPattern[i] > 0) {
          unitPattern[i] -= 1;
          for (let j = 0; j < i; j += 1) {
            unitPattern[j] = unitIdAndCount[j].count;
          }
          decrementFlg = true;
          break;
        }
      }
      if (!decrementFlg) {
        break;
      }
    }
    if (maxScore >= MILLION_SCORE) {
      console.log('　アガリパターン発見！');
      console.log(`　必要牌：${IDOL_LIST[pair.nonMember].name}`);
      console.log(`　点数：${(maxScore % MILLION_SCORE) + calcPreScore(hand)}`);
      const units1 = range(hand.unitIndexes.length).map(i => {return {id: hand.unitIndexes[i], flg: hand.unitChiFlg[i]};});
      const units2: {id: number, flg: boolean}[] = [];
      for (let i = 0; i < unitIdAndCount.length; i += 1) {
        for (let j = 0; j < maxScorePattern[i]; j += 1) {
          units2.push({id: unitIdAndCount[i].id, flg: false});
        }
      }
      const unitsAll = [...units1, ...units2];
      const unitsAllString = unitsAll.map(pair => `${UNIT_LIST2[pair.id].name}${pair.flg ? '(チー)' : ''}`).join(', ');
      console.log(`　ユニット：${unitsAllString}`);
    }
  });
  */
  console.log('ロン検索完了');
};
