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

// 後0・1・2枚あれば完成するユニット一覧を生成する
// ただし、既にユニットを組んでいる牌は使えないとする。
// また、残数がX枚の時、(X+1)人以上のユニットは選択しないとする
export const findUnit = (hand: Hand): { id: number; member: number[] }[][] => {
  // 「ユニットに組み込まれていない手牌＋ツモ牌」を選択する
  const memberSet = new Set([
    ...range(HAND_TILE_SIZE)
      .filter(i => hand.units[i] < 0)
      .map(i => hand.members[i]),
    hand.plusMember,
  ]);
  // 新しくユニットを構成できる最大枚数
  const maxUnitMembers = HAND_TILE_SIZE_PLUS - calcHandUnitLengthSum(hand);

  // ユニットを検索する
  const output: { id: number; member: number[] }[][] = [[], [], []];
  UNIT_LIST2.forEach((unitInfo, index) => {
    // ユニットの枚数が多すぎるものは無視する
    if (unitInfo.member.length > maxUnitMembers) {
      return;
    }

    // 追加したいメンバーを割り出す
    const nonMatchMember = unitInfo.member.filter(i => !memberSet.has(i));

    // 追加したいメンバーの人数が2枚以下ならば、出力結果に追加する
    const memberCountDiff = nonMatchMember.length;
    if (memberCountDiff < output.length) {
      output[memberCountDiff].push({ id: index, member: nonMatchMember });
    }
  });

  // 「追加したいメンバーの人数」が同じ場合、ユニットにおけるメンバー数が多いもの順に並び替える
  for (let countDiff = 0; countDiff < output.length; countDiff += 1) {
    output[countDiff].sort(
      (a, b) => UNIT_LIST2[b.id].memberCount - UNIT_LIST2[a.id].memberCount,
    );
  }

  return output;
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
  return range(IDOL_LIST_COUNT).map(i => a[i] - b[i]);
};

// ICA型の値でA // Bを計算する
export const divideICA = (a: IdolCountArray, b: IdolCountArray): number => {
  let output = 3;
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    if (a[i] === 0) {
      if (b[i] > 0) {
        return 0;
      }
    } else if (b[i] > 0) {
      output = Math.min(output, Math.floor(a[i] / b[i]));
    }
  }

  return output;
};

// ICA型の値でA * x + Bを計算する
export const fmaICA = (a: IdolCountArray, x: number, b: IdolCountArray): IdolCountArray => {
  return range(IDOL_LIST_COUNT).map(i => a[i] * x + b[i]);
};

// ICA型の値について、そのタイルの枚数を計算する
export const countICA = (a: IdolCountArray): number => {
  return a.reduce((p, v) => p + v);
};

// 既存のユニットにおける点数を計算する
export const calcPreScore = (hand: Hand) => {
  let sum = 0;
  for (let i = 0; i < hand.unitIndexes.length; i += 1) {
    const unit = UNIT_LIST2[hand.unitIndexes[i]];
    sum += hand.unitChiFlg[i] ? unit.scoreWithChi : unit.score;
  }
  return sum;
};

// ロンできる牌、およびチーできる牌について検索を行う
export const findWantedIdol = (hand: Hand) => {
  // 「ユニットに組み込まれていない手牌」を選択する
  const memberList = [
    ...range(HAND_TILE_SIZE)
      .filter(i => hand.units[i] < 0)
      .map(i => hand.members[i]),
  ];
  const memberSet = new Set(memberList);

  // 新しくユニットを構成できる最大枚数
  const maxUnitMembers = memberList.length + 1;
  // 完成したユニット
  const completedUnitList: number[] = [];
  // リーチ状態のユニット(※処理の都合上、完成したユニットから1枚を取り去ったものも含む)
  const reachedUnitList: {
    id: number;
    member: number[];
    nonMember: number;
  }[] = [];
  UNIT_LIST2.forEach((unitInfo, index) => {
    // ユニットの枚数が多すぎるものは無視する
    if (unitInfo.member.length > maxUnitMembers) {
      return;
    }

    // 追加したいメンバーを割り出す
    const matchMember = unitInfo.member.filter(i => memberSet.has(i));
    const nonMatchMember = unitInfo.member.filter(i => !memberSet.has(i));

    // 追加したいメンバーの人数によって分岐
    if (nonMatchMember.length === 0) {
      completedUnitList.push(index);
      for (const nonMember of matchMember) {
        reachedUnitList.push({
          id: index,
          member: matchMember.filter(i => i !== nonMember),
          nonMember,
        });
      }
    } else if (nonMatchMember.length === 1) {
      reachedUnitList.push({
        id: index,
        member: matchMember,
        nonMember: nonMatchMember[0],
      });
    }
  });

  // リーチ状態のユニット1つ＋完成したユニットで残りを構成できるかを調べる(ロン検索)
  const memberArray = memberListToICA(memberList);
  console.log(reachedUnitList);
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
      console.log('アガリパターン発見！');
      console.log(`必要牌：${IDOL_LIST[pair.nonMember].name}`);
      console.log(`点数：${(maxScore % MILLION_SCORE) + calcPreScore(hand)}`);
      const units1 = range(hand.unitIndexes.length).map(i => {return {id: hand.unitIndexes[i], flg: hand.unitChiFlg[i]};});
      const units2: {id: number, flg: boolean}[] = [];
      for (let i = 0; i < unitIdAndCount.length; i += 1) {
        for (let j = 0; j < maxScorePattern[i]; j += 1) {
          units2.push({id: unitIdAndCount[i].id, flg: false});
        }
      }
      const unitsAll = [...units1, ...units2];
      const unitsAllString = unitsAll.map(pair => `${UNIT_LIST2[pair.id].name}${pair.flg ? '(チー)' : ''}`).join(', ');
      console.log(`ユニット：${unitsAllString}`);
    }
  });
  console.log('ロン検索完了');
};
