// Actionの種類
export type ActionType = 'setApplicationMode';

// アプリケーションの動作モード
export type ApplicationMode = 'StartForm' | 'GameForm';

// アイドル名一覧
export const IDOL_LIST = [
  '春香',
  '千早',
  '美希',
  '雪歩',
  'やよ',
  '真　',
  '伊織',
  '貴音',
  '律子',
  'あず',
  '亜美',
  '真美',
  '響　',
  '未来',
  '静香',
  '翼　',
  '琴葉',
  'エレ',
  '美奈',
  '恵美',
  'まつ',
  '星梨',
  '茜　',
  '杏奈',
  'ロコ',
  '百合',
  '紗代',
  '亜利',
  '海美',
  '育　',
  '朋花',
  'エミ',
  '志保',
  '歩　',
  'ひな',
  '可奈',
  '奈緒',
  '千鶴',
  'この',
  '環　',
  '風花',
  '美也',
  'のり',
  '瑞希',
  '可憐',
  '莉緒',
  '昴　',
  '麗花',
  '桃子',
  'ジュ',
  '紬　',
  '歌織',
  '詩花',
  'そら',
];

// アイドルの種類数
export const IDOL_LIST_LENGTH = IDOL_LIST.length;

// アイドル毎の枚数
export const MAX_IDOL_COUNTS = 3;

// 牌山の枚数
export const TILE_DECK_SIZE = IDOL_LIST_LENGTH * MAX_IDOL_COUNTS;

// 手札の枚数
export const HANDS_SIZE = 13;

// Action
export interface Action {
  type: ActionType;
  message: string;
}
