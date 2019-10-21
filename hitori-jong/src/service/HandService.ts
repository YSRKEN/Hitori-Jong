import { Hand, HAND_TILE_SIZE, HAND_TILE_SIZE_PLUS } from 'constant/other';
import { UNIT_LIST2 } from 'constant2/unit';
import { IDOL_LIST } from 'constant/idol';
import { range } from './UtilityService';

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
  for (const unit of UNIT_LIST2) {
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
      unitIndex = unit.id;
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

// メンバーと担当ユニットとのペアを取り出す
export const getMembersWithUnit = (hand: Hand) => {
  const result = Array<{ member: number; unit: number }>(HAND_TILE_SIZE);
  for (let i = 0; i < HAND_TILE_SIZE; i += 1) {
    result.push({ member: hand.members[i], unit: hand.units[i] });
  }

  return result;
};

// ユニットとチー判定のペアを取り出す
export const getUnitsWithChiFlg = (hand: Hand) => {
  const result: { unit: number; chiFlg: boolean }[] = [];
  for (let i = 0; i < hand.unitIndexes.length; i += 1) {
    result.push({ unit: hand.unitIndexes[i], chiFlg: hand.unitChiFlg[i] });
  }

  return result;
};

// ユニットに組み込まれていない手牌を選択する
// addFlg = trueならツモ牌も選択する
export const selectFreeMembers = (hand: Hand, addFlg: boolean): number[] => {
  const output: number[] = [];
  const members = hand.members;
  const units = hand.units;
  for (let i = 0; i < HAND_TILE_SIZE; i += 1) {
    if (units[i] < 0) {
      output.push(members[i]);
    }
  }
  if (addFlg) {
    output.push(hand.plusMember);
  }
  return output;
};

// 手牌を文字列化する
export const toStringList = (hand: Hand, plusFlg: boolean): string => {
  return [
    ...getUnitsWithChiFlg(hand).map(
      pair => UNIT_LIST2[pair.unit].name + (pair.chiFlg ? '(チー)' : ''),
    ),
    ...selectFreeMembers(hand, plusFlg).map(id => IDOL_LIST[id].name),
  ].join(', ');
};

// 指定した位置の牌を切る
// ただしユニットが組まれているところの牌は切られないものとする
export const dropTile = (hand: Hand, index: number, nextTile = 0): Hand => {
  // ツモ切りの場合の処理
  if (index === HAND_TILE_SIZE_PLUS - 1) {
    return {
      members: [...hand.members],
      units: [...hand.units],
      unitIndexes: [...hand.unitIndexes],
      unitChiFlg: [...hand.unitChiFlg],
      plusMember: nextTile,
    };
  }

  // いずれかのユニットが組まれているところの牌は切られないものとする
  const sortedIndex = calcSortedIndex(hand.units, hand.unitIndexes.length);
  const handUnitLengthSum = calcHandUnitLengthSum(hand);
  if (handUnitLengthSum > index) {
    throw new Error('ユニットが組まれているところの牌が切られました');
  }

  // 指定した位置の牌を切り、それ以外の手牌を左にシフトさせる
  const shiftedmembers = [...hand.members];
  const shiftedunits = [...hand.units];
  for (let i = index + 1; i < HAND_TILE_SIZE; i += 1) {
    const temp = shiftedmembers[sortedIndex[i]];
    shiftedmembers[sortedIndex[i]] = shiftedmembers[sortedIndex[i - 1]];
    shiftedmembers[sortedIndex[i - 1]] = temp;
    const temp2 = shiftedunits[sortedIndex[i]];
    shiftedunits[sortedIndex[i]] = shiftedunits[sortedIndex[i - 1]];
    shiftedunits[sortedIndex[i - 1]] = temp2;
  }
  shiftedmembers[HAND_TILE_SIZE - 1] = hand.plusMember;
  shiftedunits[HAND_TILE_SIZE - 1] = -1;

  return {
    members: shiftedmembers,
    units: shiftedunits,
    unitIndexes: [...hand.unitIndexes],
    unitChiFlg: [...hand.unitChiFlg],
    plusMember: nextTile,
  };
};

// 牌をツモる
export const drawTile = (hand: Hand, nextTile: number): Hand => {
  return {
    members: [...hand.members],
    units: [...hand.units],
    unitIndexes: [...hand.unitIndexes],
    unitChiFlg: [...hand.unitChiFlg],
    plusMember: nextTile,
  };
};

// 手牌をハッシュ化する
export const toHash = (hand: Hand, plusFlg: boolean): string => {
  const units = getUnitsWithChiFlg(hand)
    .map(pair => (pair.chiFlg ? -pair.unit : pair.unit))
    .sort((a, b) => a - b);
  const members = selectFreeMembers(hand, plusFlg).sort((a, b) => a - b);
  const hash = [...units, 10000, ...members];

  return hash.map(i => `${i}`).join(',');
};
