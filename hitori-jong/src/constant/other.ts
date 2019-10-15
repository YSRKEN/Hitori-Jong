// アプリケーションのバージョン
export const APPLICATION_VERSION = '2.0.0';

// アプリケーションの表示モード
export type SceneMode = 'TitleScene' | 'GameScene' | 'SimulationScene';

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

  // ユニット番号毎の、ユニットの種類。負数だとチーで生成されている
  unitIndexes: number[];

  // 13人目のメンバー
  plusMember: number;
}
