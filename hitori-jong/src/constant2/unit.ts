import { IDOL_LIST, IDOL_LIST_COUNT } from "constant/idol";
import { UNIT_LIST } from "constant/unit";
import { IdolCountArray } from "./ica";

// ユニットの情報
export interface UnitInfo {
	id: number;
	name: string;
	member: number[];
	memberCount: number;
	memberICA: IdolCountArray;
	score: number;
	scoreWithChi: number;
}

// ユニット情報を、プログラム上から扱いやすい形式に変換する
const toUnitInfo = (id: number, name: string, member: string[]): UnitInfo => {
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
		id,
		name,
		member: memberIndex,
		memberCount: member.length,
		memberICA,
		score: calcScore(member.length),
		scoreWithChi: calcScore(member.length - 1),
	};
};

// ユニット一覧(整形後)
export const UNIT_LIST2: UnitInfo[] = UNIT_LIST.map((record, id) =>
	toUnitInfo(id, record.name, record.member),
);
