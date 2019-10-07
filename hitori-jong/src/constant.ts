// Actionの種類
export type ActionType = 'setApplicationMode' | 'resetTileDeck';

// アプリケーションの動作モード
export type ApplicationMode = 'StartForm' | 'GameForm';

// アイドルの属性
export type IdolType = 'Princess' | 'Fairy' | 'Angel' | 'Extra' | 'Sora';

// アイドルの情報
export interface IdolInfo {
  name: string;
  type: IdolType;
}

// アイドル名一覧
export const IDOL_LIST: IdolInfo[] = [
  { name: '春香', type: 'Princess' },
  { name: '千早', type: 'Fairy' },
  { name: '美希', type: 'Angel' },
  { name: '雪歩', type: 'Princess' },
  { name: 'やよい', type: 'Angel' },
  { name: '真', type: 'Princess' },
  { name: '伊織', type: 'Fairy' },
  { name: '貴音', type: 'Fairy' },
  { name: '律子', type: 'Fairy' },
  { name: 'あずさ', type: 'Angel' },
  { name: '亜美', type: 'Angel' },
  { name: '真美', type: 'Angel' },
  { name: '響', type: 'Princess' },
  { name: '未来', type: 'Princess' },
  { name: '静香', type: 'Fairy' },
  { name: '翼', type: 'Angel' },
  { name: '琴葉', type: 'Princess' },
  { name: 'エレナ', type: 'Angel' },
  { name: '美奈子', type: 'Princess' },
  { name: '恵美', type: 'Fairy' },
  { name: 'まつり', type: 'Princess' },
  { name: '星梨花', type: 'Angel' },
  { name: '茜', type: 'Angel' },
  { name: '杏奈', type: 'Angel' },
  { name: 'ロコ', type: 'Fairy' },
  { name: '百合子', type: 'Princess' },
  { name: '紗代子', type: 'Princess' },
  { name: '亜利沙', type: 'Princess' },
  { name: '海美', type: 'Princess' },
  { name: '育', type: 'Princess' },
  { name: '朋花', type: 'Fairy' },
  { name: 'エミリー', type: 'Princess' },
  { name: '志保', type: 'Fairy' },
  { name: '歩', type: 'Fairy' },
  { name: 'ひなた', type: 'Angel' },
  { name: '可奈', type: 'Princess' },
  { name: '奈緒', type: 'Princess' },
  { name: '千鶴', type: 'Fairy' },
  { name: 'このみ', type: 'Angel' },
  { name: '環', type: 'Angel' },
  { name: '風花', type: 'Angel' },
  { name: '美也', type: 'Angel' },
  { name: 'のり子', type: 'Princess' },
  { name: '瑞希', type: 'Fairy' },
  { name: '可憐', type: 'Angel' },
  { name: '莉緒', type: 'Fairy' },
  { name: '昴', type: 'Fairy' },
  { name: '麗花', type: 'Angel' },
  { name: '桃子', type: 'Fairy' },
  { name: 'ジュリア', type: 'Fairy' },
  { name: '紬', type: 'Fairy' },
  { name: '歌織', type: 'Angel' },
  { name: '詩花', type: 'Extra' },
  { name: 'そら', type: 'Sora' },
];

// 手役一覧
export const UNIT_LIST: { name: string; member: string[] }[] = [
  { name: '', member: [] },
  { name: '', member: [] },
  { name: '', member: [] },
  { name: '', member: [] },
  { name: '', member: [] },
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
