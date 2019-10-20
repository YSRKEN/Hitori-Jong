import { KANA_LIST, IDOL_LIST } from "constant/idol";
import { range } from "service/UtilityService";

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
