import { range } from 'service/UtilityService';

// アイドルの属性
export type IdolType = 'Princess' | 'Fairy' | 'Angel' | 'Extra' | 'Sora';

// アイドルの情報
interface IdolInfo {
  name: string;
  kana: string;
  type: IdolType;
}

// アイドル一覧
// prettier-ignore
export const IDOL_LIST: IdolInfo[] = [
	{ 'name': '春香', 'kana': 'はるか', 'type': 'Princess' },
	{ 'name': '千早', 'kana': 'ちはや', 'type': 'Fairy' },
	{ 'name': '美希', 'kana': 'みき', 'type': 'Angel' },
	{ 'name': '雪歩', 'kana': 'ゆきほ', 'type': 'Princess' },
	{ 'name': 'やよい', 'kana': 'やよい', 'type': 'Angel' },
	{ 'name': '真', 'kana': 'まこと', 'type': 'Princess' },
	{ 'name': '伊織', 'kana': 'いおり', 'type': 'Fairy' },
	{ 'name': '貴音', 'kana': 'たかね', 'type': 'Fairy' },
	{ 'name': '律子', 'kana': 'りつこ', 'type': 'Fairy' },
	{ 'name': 'あずさ', 'kana': 'あずさ', 'type': 'Angel' },
	{ 'name': '亜美', 'kana': 'あみ', 'type': 'Angel' },
	{ 'name': '真美', 'kana': 'まみ', 'type': 'Angel' },
	{ 'name': '響', 'kana': 'ひびき', 'type': 'Princess' },
	{ 'name': '未来', 'kana': 'みらい', 'type': 'Princess' },
	{ 'name': '静香', 'kana': 'しずか', 'type': 'Fairy' },
	{ 'name': '翼', 'kana': 'つばさ', 'type': 'Angel' },
	{ 'name': '琴葉', 'kana': 'ことは', 'type': 'Princess' },
	{ 'name': 'エレナ', 'kana': 'えれな', 'type': 'Angel' },
	{ 'name': '美奈子', 'kana': 'みなこ', 'type': 'Princess' },
	{ 'name': '恵美', 'kana': 'めぐみ', 'type': 'Fairy' },
	{ 'name': 'まつり', 'kana': 'まつり', 'type': 'Princess' },
	{ 'name': '星梨花', 'kana': 'せりか', 'type': 'Angel' },
	{ 'name': '茜', 'kana': 'あかね', 'type': 'Angel' },
	{ 'name': '杏奈', 'kana': 'あんな', 'type': 'Angel' },
	{ 'name': 'ロコ', 'kana': 'ろこ', 'type': 'Fairy' },
	{ 'name': '百合子', 'kana': 'ゆりこ', 'type': 'Princess' },
	{ 'name': '紗代子', 'kana': 'さよこ', 'type': 'Princess' },
	{ 'name': '亜利沙', 'kana': 'ありさ', 'type': 'Princess' },
	{ 'name': '海美', 'kana': 'うみ', 'type': 'Princess' },
	{ 'name': '育', 'kana': 'いく', 'type': 'Princess' },
	{ 'name': '朋花', 'kana': 'ともか', 'type': 'Fairy' },
	{ 'name': 'エミリー', 'kana': 'えみりー', 'type': 'Princess' },
	{ 'name': '志保', 'kana': 'しほ', 'type': 'Fairy' },
	{ 'name': '歩', 'kana': 'あゆむ', 'type': 'Fairy' },
	{ 'name': 'ひなた', 'kana': 'ひなた', 'type': 'Angel' },
	{ 'name': '可奈', 'kana': 'かな', 'type': 'Princess' },
	{ 'name': '奈緒', 'kana': 'なお', 'type': 'Princess' },
	{ 'name': '千鶴', 'kana': 'ちづる', 'type': 'Fairy' },
	{ 'name': 'このみ', 'kana': 'このみ', 'type': 'Angel' },
	{ 'name': '環', 'kana': 'たまき', 'type': 'Angel' },
	{ 'name': '風花', 'kana': 'ふうか', 'type': 'Angel' },
	{ 'name': '美也', 'kana': 'みや', 'type': 'Angel' },
	{ 'name': 'のり子', 'kana': 'のりこ', 'type': 'Princess' },
	{ 'name': '瑞希', 'kana': 'みずき', 'type': 'Fairy' },
	{ 'name': '可憐', 'kana': 'かれん', 'type': 'Angel' },
	{ 'name': '莉緒', 'kana': 'りお', 'type': 'Fairy' },
	{ 'name': '昴', 'kana': 'すばる', 'type': 'Fairy' },
	{ 'name': '麗花', 'kana': 'れいか', 'type': 'Angel' },
	{ 'name': '桃子', 'kana': 'ももこ', 'type': 'Fairy' },
	{ 'name': 'ジュリア', 'kana': 'じゅりあ', 'type': 'Fairy' },
	{ 'name': '紬', 'kana': 'つむぎ', 'type': 'Fairy' },
	{ 'name': '歌織', 'kana': 'かおり', 'type': 'Angel' },
	{ 'name': '詩花', 'kana': 'しいか', 'type': 'Extra' },
	{ 'name': 'そら', 'kana': 'そら', 'type': 'Sora' }
];

// ひらがな1文字→アイドル名の対応表
export const KANA_LIST =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや　ゆ　よらりるれろわ　を　ん';
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
