import { Hand, HAND_TILE_SIZE } from 'constant/other';
import { UNIT_LIST2 } from 'constant/unit';
import { range } from './UtilityService';
import { IDOL_LIST } from 'constant/idol';

// 文字で表されたアイドル一覧を数字一覧に変換する
export const stringToNumber = (memberList: string[]) => {
	return memberList.map(member =>
		IDOL_LIST.findIndex(idol => idol.name === member),
	);
};

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
    plusMember: hand.plusMember
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
    plusMember: hand.plusMember
  };
};
