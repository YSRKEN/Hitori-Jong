import { UNIT_LIST2 } from 'constant2/unit';
import { Hand, MILLION_SCORE, HAND_TILE_SIZE_PLUS } from 'constant/other';
import {
  IdolCountArray,
  hasICA,
  isZero,
  minusICA,
  memberListToICA,
} from 'constant2/ica';
import { IDOL_LIST, IDOL_LIST_COUNT } from 'constant/idol';
import {
  selectFreeMembers,
  getUnitsWithChiFlg,
  toStringList,
  calcHandUnitLengthSum,
  dropTile,
  drawTile,
  calcShowMembers,
} from './HandService';

// 後0・1・2枚あれば完成するユニット一覧を生成する
// ただし、既にユニットを組んでいる牌は使えないとする。
// また、残数がX枚の時、(X+1)人以上のユニットは選択しないとする
export const findUnit = (hand: Hand): { id: number; member: number[] }[][] => {
  // 「ユニットに組み込まれていない手牌＋ツモ牌」を選択する
  const freeMembers = selectFreeMembers(hand, true);

  // 新しくユニットを構成できる最大枚数を算出する
  const maxUnitMembers = freeMembers.length;

  // ユニットを検索する
  const memberSet = new Set(freeMembers);
  const temp = UNIT_LIST2.filter(unit => unit.memberCount <= maxUnitMembers)
    .map(unit => {
      const matchedMember = unit.member.filter(i => memberSet.has(i));

      return {
        id: unit.id,
        member: matchedMember,
        nonMemberCount: unit.memberCount - matchedMember.length,
      };
    })
    .sort((a, b) => b.member.length - a.member.length);

  return [0, 1, 2].map(x =>
    temp
      .filter(record => record.nonMemberCount === x)
      .map(record => {
        return { id: record.id, member: record.member };
      }),
  );
};

// 既存のユニットにおける点数を計算する
export const calcPreScore = (hand: Hand) => {
  if (hand.unitIndexes.length === 0) {
    return 0;
  }

  return getUnitsWithChiFlg(hand)
    .map(pair =>
      pair.chiFlg
        ? UNIT_LIST2[pair.unit].scoreWithChi
        : UNIT_LIST2[pair.unit].score,
    )
    .reduce((p, c) => p + c);
};

// メンバーから取りうるユニット一覧を算出する
const findUnitICAFromMemberICA = (
  memberICA: IdolCountArray,
  preCompletedUnits: { id: number; score: number; ica: IdolCountArray }[],
): { id: number; score: number; ica: IdolCountArray }[] => {
  const temp: {
    id: number;
    count: number;
    score: number;
    ica: IdolCountArray;
  }[] = [];

  const unitList =
    preCompletedUnits.length === 0
      ? UNIT_LIST2.map(unit => {
          return {
            id: unit.id,
            count: unit.memberCount,
            score: unit.score,
            ica: unit.memberICA,
          };
        })
      : preCompletedUnits;

  for (const record of unitList) {
    if (!hasICA(memberICA, record.ica)) {
      continue;
    }
    temp.push({
      id: record.id,
      count: UNIT_LIST2[record.id].memberCount,
      score: record.score,
      ica: record.ica,
    });
  }

  return temp
    .sort((a, b) => b.count - a.count)
    .map(record => {
      return { id: record.id, score: record.score, ica: record.ica };
    });
};

// 与えられた手牌から完成しているユニットの組み合わせを検索する。
// 最も高得点な組み合わせを戻り値として返す
const fBPcache: { [key: string]: { unit: number[]; score: number } } = {};
export const findBestUnitPattern = (
  memberICA: IdolCountArray,
  preCompletedUnits: { id: number; score: number; ica: IdolCountArray }[] = [],
): { unit: number[]; score: number } => {
  const key = memberICA.map(i => `${i}`).join(',');
  if (key in fBPcache) {
    return fBPcache[key];
  }

  // 手牌を使い切った＝アガリなのでボーナスを付与する
  if (isZero(memberICA)) {
    fBPcache[key] = { unit: Array<number>(), score: MILLION_SCORE };

    return { unit: Array<number>(), score: MILLION_SCORE };
  }

  // 考えられるユニットの候補を検索する
  const completedUnits = findUnitICAFromMemberICA(memberICA, preCompletedUnits);

  // いずれかのユニットを選択する
  let bestResult = { unit: Array<number>(), score: 0 };
  for (const completedUnit of completedUnits) {
    const result = findBestUnitPattern(
      minusICA(memberICA, completedUnit.ica),
      completedUnits,
    );
    if (bestResult.score < result.score + completedUnit.score) {
      bestResult = {
        unit: [...result.unit, completedUnit.id],
        score: result.score + completedUnit.score,
      };
    }
  }
  fBPcache[key] = bestResult;

  return bestResult;
};

// ロンできる牌一覧を検索する
const findRonList = (
  hand: Hand,
): { member: number; unit: { id: number; chiFlg: boolean }[] }[] => {
  // 「ユニットに組み込まれていない手牌」を選択する
  const freeMembers = selectFreeMembers(hand, false);

  // 既存のユニットとチーフラグを取得する
  const unitsWithChiFlg = getUnitsWithChiFlg(hand);

  // 既に完成しているユニットでもとりあえず「鳴く」ことはできることを利用して、
  // 「アガリ牌の可能性がある」一覧を取り出す
  const freeMembersSet = new Set(freeMembers);
  const wantedIdolCandiSet = new Set<number>();
  for (const unit of UNIT_LIST2) {
    const nonMembers = unit.member.filter(i => !freeMembersSet.has(i));
    switch (nonMembers.length) {
      case 0:
        for (const member of unit.member) {
          wantedIdolCandiSet.add(member);
        }
        break;
      case 1:
        wantedIdolCandiSet.add(nonMembers[0]);
        break;
      default:
        break;
    }
  }
  const wantedIdolCandiList = Array.from(wantedIdolCandiSet);

  // 順に確かめる
  const ronList: {
    member: number;
    unit: { id: number; chiFlg: boolean }[];
  }[] = [];
  for (const wantedIdolCandi of wantedIdolCandiList) {
    // 手牌を完成させる
    const freeMembers2 = [...freeMembers, wantedIdolCandi];

    // 最も高得点な組み合わせを探索する
    const result: { unit: number[]; score: number } = findBestUnitPattern(
      memberListToICA(freeMembers2),
    );

    // ロン上がりできる＝スコアがMILLION_SCORE以上
    if (result.score >= MILLION_SCORE) {
      const handUnits = unitsWithChiFlg.map(pair => {
        return { id: pair.unit, chiFlg: pair.chiFlg };
      });
      const resultUnits = result.unit.map(i => {
        return { id: i, chiFlg: false };
      });
      ronList.push({
        member: wantedIdolCandi,
        unit: [...handUnits, ...resultUnits],
      });
    }
  }

  return ronList;
};

// チーできる牌一覧を検索する
export const findChiList = (
  hand: Hand,
  ronList: { member: number; unit: { id: number; chiFlg: boolean }[] }[],
): { member: number; unit: number; otherMember: number[] }[] => {
  // ユニットに組み込まれていないアイドルの一覧を取得する
  const freeMembersSet = new Set(selectFreeMembers(hand, false));

  // ロン牌の一覧を算出する
  const ronIdolSet = new Set(ronList.map(record => record.member));

  // 検索開始
  const chiList: { member: number; unit: number; otherMember: number[] }[] = [];
  for (const unit of UNIT_LIST2) {
    // freeMembersSetに含まれるメンバーと含まれないメンバーを、ユニットごとに検索
    const members = unit.member.filter(i => freeMembersSet.has(i));
    const nonMembers = unit.member.filter(i => !freeMembersSet.has(i));

    // チーできるのは3人ユニット以上であり、また足りないのが1枚だけのもの。
    // さらにロン牌は含まないルールとして取得する
    if (
      members.length >= 2 &&
      nonMembers.length === 1 &&
      !ronIdolSet.has(nonMembers[0])
    ) {
      chiList.push({
        member: nonMembers[0],
        unit: unit.id,
        otherMember: members,
      });
    }
  }
  // チーで引き込む牌のメンバー名で並び替え
  chiList.sort((a, b) => a.member - b.member);

  return chiList;
};

// ロンできる牌、およびチーできる牌について検索を行う
export const findWantedIdol = (
  hand: Hand,
): {
  ron: { member: number; unit: { id: number; chiFlg: boolean }[] }[];
  chi: { member: number; unit: number; otherMember: number[] }[];
} => {
  const startTime = Date.now();

  // ロンできる牌一覧を検索する
  const ronList = findRonList(hand);

  // チーできる牌一覧を検索する
  const chiList = findChiList(hand, ronList);

  console.log(`処理時間：${Date.now() - startTime}[ms]`);

  return { ron: ronList, chi: chiList };
};

// ツモ牌含めた13枚での点数を計算する。アガリ形だと、定数MILLION_SCOREがプラスされている
const calcScore = (hand: Hand, myIdol: number) => {
  const freeMembers = selectFreeMembers(hand, true);
  const result = findBestUnitPattern(memberListToICA(freeMembers));
  let score = calcPreScore(hand) + result.score;
  if (hand.members.includes(myIdol) || hand.plusMember === myIdol) {
    score += 2000;
  }

  return score;
};

// ダミー
let calcExpectdValue12 = (
  hand: Hand,
  myIdol: number,
  maxDepth: number,
  depth = 0,
) => {
  const hoge = myIdol * maxDepth * depth * hand.members.length >= 0 ? 0 : 0;

  return hoge;
};

// 手牌13枚の期待値を計算する。期待値は、
// アガリ形である：そのアガリ形におけるスコア
// アガリ形でない：max(xを打牌した際の12枚における期待値)
const calcExpectdValue13 = (
  hand: Hand,
  myIdol: number,
  maxDepth: number,
  depth = 0,
) => {
  // 打ち切り判定
  if (depth === maxDepth) {
    return 0.0;
  }

  // スコアを計算し、アガリ形と判断されたらその値を期待値として返す
  const rawScore = calcScore(hand, myIdol);
  if (rawScore >= MILLION_SCORE) {
    // 結果を返す
    const score = rawScore % MILLION_SCORE;
    if (depth === 0) {
      console.log(
        `期待値＝${score}点 ${toStringList(hand, true)}+${
          IDOL_LIST[myIdol].name
        }担当`,
      );
    }

    return score;
  }
  // アガリ形でないので、打牌してそれぞれの期待値を出す
  // 各打牌における期待値を計算する
  const temp: number[] = [];
  for (let i = calcHandUnitLengthSum(hand); i < HAND_TILE_SIZE_PLUS; i += 1) {
    const newHand = dropTile(hand, i);
    const eValue = calcExpectdValue12(newHand, myIdol, maxDepth, depth + 1);
    temp.push(eValue);
  }
  // 最も良かったものを結果として返す
  const score = Math.max(...temp);
  if (depth === 0) {
    console.log(
      `期待値＝${score}点 ${toStringList(hand, true)}+${
        IDOL_LIST[myIdol].name
      }担当`,
    );
  }

  return score;
};

// 手牌12枚の期待値を計算する。期待値は、
// テンパイ形である：Σ(アガリ牌xのツモ確率×アガリ形の点数)
// テンパイ形でない：Σ(ツモ牌xのツモ確率×13枚における期待値)
calcExpectdValue12 = (
  hand: Hand,
  myIdol: number,
  maxDepth: number,
  depth = 0,
) => {
  if (depth === maxDepth) {
    return 0.0;
  }

  // 期待値を計算する
  let expectedScore = 0.0;
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    // 新たな牌をツモった際の手牌を算出する
    const newHand = drawTile(hand, i);

    // 手牌に対する期待値を計算して加算する
    expectedScore +=
      (1.0 * calcExpectdValue13(newHand, myIdol, maxDepth, depth + 1)) /
      IDOL_LIST_COUNT;
  }

  if (depth <= 1) {
    console.log(
      `期待値(12枚)＝${expectedScore}点 ${toStringList(hand, false)}+${
        IDOL_LIST[myIdol].name
      }担当`,
    );
  }

  return expectedScore;
};

// どの牌を切るのが良いか・鳴くべきか鳴かざるべきかを判断する
// evDepth……探索深さ。深いほど正確になるが処理が重くなる
export const findTradingIdol = (hand: Hand, myIdol: number, evDepth = 3) => {
  // 既にアガリ形でないかを調べる
  const rawScore = calcScore(hand, myIdol);
  if (rawScore >= MILLION_SCORE) {
    const score = rawScore % MILLION_SCORE;
    window.alert(`既にアガリ形です。点数：${score}点`);

    return;
  }

  // アガリ形ではないので、各手牌を打牌した際の期待値を計算する
  const temp: { name: string; eValue: number }[] = [];
  for (let i = calcHandUnitLengthSum(hand); i < HAND_TILE_SIZE_PLUS; i += 1) {
    const { name } = IDOL_LIST[calcShowMembers(hand)[i]];
    if (temp.filter(pair => pair.name === name).length === 0) {
      const newHand = dropTile(hand, i);
      const eValue = calcExpectdValue12(newHand, myIdol, evDepth);
      temp.push({ name, eValue });
    }
  }
  temp.sort((a, b) => b.eValue - a.eValue);
  const temp2 = temp.map(pair => `・${pair.name}―${pair.eValue}`).join('\n');
  const output = `アガリ形ではありません。\n期待値探索深さ：${evDepth}\n打牌―得点期待値：\n${temp2}`;
  window.alert(output);
};