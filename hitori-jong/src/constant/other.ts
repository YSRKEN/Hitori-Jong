import { stringToNumber } from 'service/HandService';

// アプリケーションのバージョン
export const APPLICATION_VERSION = '2.0.0';

// アプリケーションの表示モード
export type SceneMode =
  | 'TitleScene'
  | 'GameScene'
  | 'SimulationScene'
  | 'KanaKeyBoardScene'
  | 'IdolSelectScene';

// 手牌の枚数
export const HAND_TILE_SIZE = 12;

// 手牌の枚数(13枚表示用)
export const HAND_TILE_SIZE_PLUS = 13;

// 手牌
export interface Hand {
  // 手牌のメンバー(12人)
  members: number[];

  // チーなどで確定しているユニット。1つ目から順に、ユニット番号が割り振られている
  units: number[];

  // ユニット番号毎の、ユニットの種類
  unitIndexes: number[];

  // ユニット番号毎に、チーで生成されているかを表すフラグ
  unitChiFlg: boolean[];

  // 13人目のメンバー
  plusMember: number;
}

// 手牌の初期値
export const DEFAULT_HAND: Hand = {
  members: stringToNumber([
    '紗代子',
    '莉緒',
    '環',
    '風花',
    '恵美',
    '奈緒',
    '響',
    '育',
    '育',
    '千早',
    '海美',
    '朋花',
  ]),
  units: [1, -1, -1, 1, 1, 1, -1, 0, -1, -1, 1, 0],
  unitIndexes: [15, 125],
  unitChiFlg: [false, true],
  plusMember: stringToNumber(['莉緒'])[0],
};

// 担当の初期値
export const DEFAULT_NY_IDOL = stringToNumber(['静香'])[0];
