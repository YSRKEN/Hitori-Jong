import { UNIT_LIST2 } from "constant2/unit";
import { Hand, MILLION_SCORE } from "constant/other";
import { selectFreeMembers, getUnitsWithChiFlg } from "./HandService";
import { IdolCountArray, hasICA, isZero, minusICA, memberListToICA } from "constant2/ica";

// 後X枚あれば揃うユニットを検索する
const findUnitFromMembers = (members: number[], x: number): { id: number, member: number[], nonMember: number[] }[] => {
	const memberSet = new Set(members);
	const temp = UNIT_LIST2.map(unit => {
		return {
			id: unit.id,
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
	const memberSet = new Set(freeMembers);
	const temp = UNIT_LIST2.filter(unit => unit.memberCount <= maxUnitMembers)
		.map(unit => {
			const matchedMember = unit.member.filter(i => memberSet.has(i));
			return {
				id: unit.id,
				member: matchedMember,
				nonMemberCount: unit.memberCount - matchedMember.length
			}
		}).sort((a, b) => b.member.length - a.member.length);
	return [0, 1, 2].map(x => temp.filter(record => record.nonMemberCount === x).map(record => {
		return {id: record.id, member: record.member};
	}));
};

// 既存のユニットにおける点数を計算する
export const calcPreScore = (hand: Hand) => {
	if (hand.unitIndexes.length === 0) {
		return 0;
	}
	return getUnitsWithChiFlg(hand)
		.map(pair => pair.chiFlg ? UNIT_LIST2[pair.unit].scoreWithChi : UNIT_LIST2[pair.unit].score)
		.reduce((p, c) => p + c);
};

// メンバーから取りうるユニット一覧を算出する
const findUnitICAFromMemberICA = (
	memberICA: IdolCountArray,
	preCompletedUnits: { id: number, score: number, ica: IdolCountArray }[])
	: { id: number, score: number, ica: IdolCountArray }[] => {
	const temp: { id: number, count: number, score: number, ica: IdolCountArray }[] = [];

	const unitList = preCompletedUnits.length === 0
		? UNIT_LIST2.map(unit => { return { id: unit.id, count: unit.memberCount, score: unit.score, ica: unit.memberICA }; })
		: preCompletedUnits;

	for (const record of unitList) {
		if (!hasICA(memberICA, record.ica)) {
			continue;
		}
		temp.push({ id: record.id, count: UNIT_LIST2[record.id].memberCount, score: record.score, ica: record.ica });
	}
	return temp.sort((a, b) => b.count - a.count).map(record => {
		return { id: record.id, score: record.score, ica: record.ica };
	});
};

// 与えられた手牌から完成しているユニットの組み合わせを検索する。
// 最も高得点な組み合わせを戻り値として返す
const fBPcache: { [key: string]: { unit: number[], score: number } } = {};
export const findBestUnitPattern = (
	memberICA: IdolCountArray,
	preCompletedUnits: { id: number, score: number, ica: IdolCountArray }[] = [])
	: { unit: number[], score: number } => {
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
		const result = findBestUnitPattern(minusICA(memberICA, completedUnit.ica), completedUnits);
		if (bestResult.score < result.score + completedUnit.score) {
			bestResult = { unit: [...result.unit, completedUnit.id], score: result.score + completedUnit.score };
		}
	}
	fBPcache[key] = bestResult;
	return bestResult;
};

// ロンできる牌、およびチーできる牌について検索を行う
export const findWantedIdol = (hand: Hand): {
	ron: { member: number, unit: { id: number, chiFlg: boolean }[] }[],
	chi: { member: number, unit: number, otherMember: number[] }[]
} => {
	const startTime = Date.now();

	// 「ユニットに組み込まれていない手牌」を選択する
	const freeMembers = selectFreeMembers(hand, false);

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
	const ronList: { member: number, unit: { id: number, chiFlg: boolean }[] }[] = [];
	for (const wantedIdolCandi of wantedIdolCandiList) {
		// 手牌を完成させる
		const freeMembers2 = [...freeMembers, wantedIdolCandi];

		// 最も高得点な組み合わせを探索する
		const result: { unit: number[], score: number } = findBestUnitPattern(memberListToICA(freeMembers2));

		// ロン上がりできる＝スコアがMILLION_SCORE以上
		if (result.score >= MILLION_SCORE) {
			const handUnits = getUnitsWithChiFlg(hand).map(pair => {
				return { id: pair.unit, chiFlg: pair.chiFlg }
			});
			const resultUnits = result.unit.map(i => {
				return { id: i, chiFlg: false };
			});
			ronList.push({
				member: wantedIdolCandi,
				unit: [...handUnits, ...resultUnits]
			});
		}
	}

	// チーできる牌一覧を検索する
	const ronIdolSet = new Set(ronList.map(record => record.member));
	const chiList: { member: number, unit: number, otherMember: number[] }[] = [];
	for (const unit of UNIT_LIST2) {
		const members = unit.member.filter(i => freeMembersSet.has(i));
		const nonMembers = unit.member.filter(i => !freeMembersSet.has(i));
		if (members.length >= 2 && nonMembers.length === 1 && !ronIdolSet.has(nonMembers[0])) {
			chiList.push( { member: nonMembers[0], unit: unit.id, otherMember: members });
		}
	}
	chiList.sort((a, b) => a.member - b.member);

	console.log(`処理時間：${Date.now() - startTime}[ms]`);

	return { ron: ronList, chi: chiList };
};
