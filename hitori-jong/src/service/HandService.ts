import { Hand, HAND_TILE_SIZE_PLUS } from 'constant/other';
import { IDOL_LIST } from 'constant/idol';
import { UnitInfo } from 'constant/unit';

// 文字で表されたアイドル一覧を数字一覧に変換する
export const stringToNumber = (memberList: string[]) => {
  return memberList.map(member =>
    IDOL_LIST.findIndex(idol => idol.name === member),
  );
};

// ユニット情報を、プログラム上から扱いやすい形式に変換する
export const toUnitInfo = (name: string, member: string[]): UnitInfo => {
  const calcScore = (length: number) => {
    if (length <= 1) {
      return 1000;
    }

    return (length - 1) * 2000;
  };

  return {
    name,
    member: stringToNumber(member),
    memberCount: member.length,
    score: calcScore(member.length),
    scoreWithChi: calcScore(member.length - 1),
  };
};

// 表示用に並び替えた手牌一覧を返す
export const calcShowMembers = (hand: Hand): number[] => {
  // ソートのための準備
  const newMemberIndexes: number[] = Array(HAND_TILE_SIZE_PLUS);
  for (let i = 0; i < HAND_TILE_SIZE_PLUS; i += 1) {
    newMemberIndexes[i] = i;
  }

  // ソートを行うための比較用関数を定義する。定義としては、
  // 1. 13番目の要素は固定
  // 2. 役が確定しているものを手前、確定していないものを奥に
  // 3. 確定しているもの同士なら、「役の種類の数字の絶対値」が小さいものを手前に
  const compareMemberIndex = (a: number, b: number) => {
    // 1. 13番目の要素は固定
    if (a === HAND_TILE_SIZE_PLUS - 1) {
      return 1;
    }
    if (b === HAND_TILE_SIZE_PLUS - 1) {
      return -1;
    }

    // 2. 役が確定しているものを手前、確定していないものを奥に
    const unitIndexA = hand.units[a];
    const unitIndexB = hand.units[b];
    if (unitIndexA >= 0 && unitIndexB < 0) {
      return -1;
    }
    if (unitIndexB >= 0 && unitIndexA < 0) {
      return 1;
    }

    // 3. 確定しているもの同士なら、「役の種類の数字」が小さいものを手前に
    const unitA = hand.unitIndexes[unitIndexA];
    const unitB = hand.unitIndexes[unitIndexB];
    if (unitA < unitB) {
      return -1;
    }
    if (unitA > unitB) {
      return 1;
    }

    return 0;
  };

  // ソート
  newMemberIndexes.sort(compareMemberIndex);

  // 結果を出力
  const output: number[] = [];
  for (const memberIndex of newMemberIndexes) {
    if (memberIndex === HAND_TILE_SIZE_PLUS - 1) {
      output.push(hand.plusMember);
    } else {
      output.push(hand.members[memberIndex]);
    }
  }

  return output;
};
