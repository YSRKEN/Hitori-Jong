// Actionの種類
export type ActionType =
  | 'setApplicationMode'
  | 'resetTileDeck'
  | 'drawTile'
  | 'checkTile'
  | 'calcTempai'
  | 'checkUnits'
  | 'requestSort'
  | 'setEditFlg';

// アプリケーションの動作モード
export type ApplicationMode = 'StartForm' | 'GameForm' | 'SelectForm';

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
export const SORA_INDEX = IDOL_LIST.findIndex(record => record.type === 'Sora');
export const nameToIndex = (name: string) => {
  return IDOL_LIST.findIndex((record: IdolInfo) => record.name === name);
};

// 手役一覧
// prettier-ignore
export const UNIT_LIST: { name: string; member: string[] }[] = [
  { name: '(詩花)', member: ['詩花'] },
  { name: 'ハルカナミライ', member: ['春香', '未来'] },
  { name: '成長Chu→LOVER!!', member: ['杏奈', '百合子'] },
  { name: 'エスケープ', member: ['ジュリア', '恵美'] },
  { name: 'Eternal Spiral', member: ['やよい', '可奈'] },
  { name: 'piece of cake', member: ['麗花', '志保'] },
  { name: 'アライブファクター', member: ['千早', '静香'] },
  { name: 'Persona Voice', member: ['千鶴', '雪歩'] },
  { name: 'Cut. Cut. Cut.', member: ['桃子', '瑞希'] },
  { name: 'Smiling Crescent', member: ['星梨花', '美也'] },
  { name: 'Decided', member: ['まつり', 'このみ'] },
  { name: '深層マーメイド', member: ['翼', '響'] },
  { name: 'HELLO, YOUR ANGEL♪', member: ['朋花', '育'] },
  { name: 'G♡F', member: ['律子', '可憐'] },
  { name: 'little trip around the world', member: ['エミリー', '伊織'] },
  { name: 'Melody in scape', member: ['紗代子', '美奈子'] },
  { name: 'Your HOME TOWN', member: ['ひなた', '亜美'] },
  { name: 'fruity love', member: ['茜', 'ロコ'] },
  { name: '夜に輝く星座のように', member: ['亜利沙', '奈緒'] },
  { name: '秘密のメモリーズ', member: ['貴音', '風花'] },
  { name: 'たしかな足跡', member: ['あずさ', '莉緒'] },
  { name: 'Understand? Understand!', member: ['海美', '琴葉'] },
  { name: 'ジャングル☆パーティー', member: ['環', '真美'] },
  { name: 'Beat the World!!', member: ['真', '歩'] },
  { name: 'Emergence Vibe', member: ['エレナ', '美希'] },
  { name: 'Dreamscape', member: ['昴', 'のり子'] },
  { name: 'Cleasky', member: ['美也', 'エレナ'] },
  { name: 'D/Zeal', member: ['ジュリア', '静香'] },
  { name: 'Charlotte・Charlotte', member: ['まつり', 'エミリー'] },
  { name: 'メリー', member: ['可奈', '志保'] },
  { name: 'マイティセーラーズ', member: ['海美', '翼'] },
  { name: 'GO MY WAY!!(カバー)', member: ['未来', '静香'] },
  { name: 'ビジョナリー(カバー)', member: ['星梨花', '杏奈'] },
  { name: 'Do-Dai(カバー)', member: ['星梨花', '海美'] },
  { name: 'i(カバー)', member: ['星梨花', '亜利沙'] },
  { name: 'ダブルエース', member: ['奈緒', '美奈子'] },
  { name: 'キラメキラリ(カバー)', member: ['茜', '紬'] },
  { name: 'わんつ→ているず', member: ['真美', 'やよい'] },
  { name: '花鳥風月', member: ['千早', '貴音'] },
  { name: 'D・LOVE', member: ['雪歩', '伊織'] },
  { name: 'BLACK PRINCESS', member: ['春香', 'あずさ'] },
  { name: 'CRIMSON LOVERS', member: ['春香', '千早'] },
  { name: '聖炎の女神', member: ['貴音', '律子'] },
  { name: 'ブルウ・スタア', member: ['真', '響'] },
  { name: "始めのDon't worry", member: ['美希', '伊織'] },
  { name: 'LEMONADE', member: ['雪歩', 'あずさ'] },
  { name: 'レオ', member: ['エレナ', '育', 'ロコ'] },
  { name: 'キャンサー', member: ['エミリー', 'ひなた', '奈緒'] },
  { name: 'リブラ', member: ['翼', '美奈子', 'のり子'] },
  { name: 'カプリコーン', member: ['杏奈', '莉緒', '可奈'] },
  { name: 'ウィルゴ', member: ['昴', '百合子', '静香'] },
  { name: 'サジタリアス', member: ['恵美', '歩', '瑞希'] },
  { name: 'ピスケス', member: ['可憐', '朋花', '千鶴'] },
  { name: 'アクアリウス', member: ['麗花', 'ジュリア', '紗代子'] },
  { name: 'アリエス', member: ['環', '茜', '星梨花'] },
  { name: 'タウラス', member: ['未来', 'まつり', '美也'] },
  { name: 'ジェミニ', member: ['桃子', '風花', 'このみ'] },
  { name: 'トゥインクルリズム', member: ['育', '百合子', '亜利沙'] },
  { name: 'EScape', member: ['瑞希', '志保', '紬'] },
  { name: 'りるきゃん ～3 little candy～', member: ['可憐', '茜', '翼'] },
  { name: 'STAR ELEMENTS', member: ['未来', '可奈', '琴葉'] },
  { name: 'U・N・M・E・I ライブ', member: ['未来', '静香', '星梨花'] },
  { name: 'シグナル', member: ['未来', '静香', '翼'] },
  { name: 'アイル', member: ['翼', 'ジュリア', '瑞希'] },
  { name: 'トライスタービジョン', member: ['琴葉', '恵美', 'エレナ'] },
  { name: 'ONLY MY NOTE(カバー)', member: ['春香', '未来', '可奈'] },
  { name: 'MUSIC♪(BCカバー)', member: ['歌織', '紗代子', '可奈'] },
  { name: 'Dreaming!(カバー)', member: ['可奈', '星梨花', '海美'] },
  { name: 'パーフェクトサン', member: ['春香', 'やよい', '真'] },
  { name: 'ミッシングムーン', member: ['千早', '律子', 'あずさ'] },
  { name: 'プロジェクト・フェアリー', member: ['響', '貴音', '美希'] },
  { name: '竜宮小町', member: ['亜美', 'あずさ', '伊織'] },
  { name: 'SprouT', member: ['春香', '雪歩', '響'] },
  { name: 'SLEEPING BEAUTY', member: ['千早', '春香', '美希'] },
  { name: 'Engage!/you-i', member: ['春香', '千早', 'やよい'] },
  { name: 'TORICO', member: ['春香', '千早', '雪歩'] },
  { name: 'Funny Logic', member: ['やよい', '亜美', '真美'] },
  { name: 'Blue Symphony', member: ['千早', '志保', '琴葉', '恵美'] },
  { name: 'Sentimental Venus', member: ['伊織', 'エミリー', '莉緒', '瑞希'] },
  { name: 'Marionetteは眠らない', member: ['美希', '翼', '麗花', 'ジュリア'] },
  { name: 'カワラナイモノ', member: ['あずさ', '可憐', '紗代子', 'のり子'] },
  { name: 'Good-Sleep, Baby♡', member: ['やよい', '環', '育', '可奈'] },
  { name: 'Helloコンチェルト', member: ['律子', 'ひなた', '美奈子', '亜利沙'] },
  { name: '瞳の中のシリウス', member: ['貴音', '海美', 'まつり', '美也'] },
  { name: 'Fu-Wa-Du-Wa', member: ['真', '真美', 'エレナ', '歩'] },
  { name: 'ココロがかえる場所', member: ['雪歩', '桃子', '千鶴', 'ロコ'] },
  { name: 'Bigバルーン◎', member: ['亜美', '昴', 'このみ', '茜'] },
  { name: 'スコーピオ', member: ['志保', '海美', '亜利沙', '琴葉'] },
  { name: '夜想令嬢-GRAC&E_NOCTURNE-', member: ['朋花', '恵美', '千鶴', '莉緒'] },
  { name: '4Luxury', member: ['歌織', '風花', '麗花', 'このみ'] },
  { name: 'Jelly PoP Beans', member: ['ロコ', '歩', '昴', '桃子'] },
  { name: 'ピコピコプラネッツ', member: ['星梨花', '環', 'ひなた', '杏奈'] },
  { name: 'Clover', member: ['可奈', '志保', '星梨花', '海美'] },
  { name: 'Xs', member: ['美希', '雪歩', '真', '伊織'] },
  { name: 'ワンダリングスター', member: ['亜美', '真美', '雪歩', '伊織'] },
  { name: 'ハニーサウンド', member: ['春香', '千早', '律子', 'あずさ'] },
  { name: 'グルーヴィーチューン', member: ['美希', '雪歩', '真', '貴音'] },
  { name: '僕たちのResistance', member: ['美希', '千早', 'やよい', '響'] },
  { name: 'アマテラス', member: ['雪歩', 'あずさ', '貴音', '律子'] },
  { name: 'BRAVE STAR', member: ['春香', '千早', '貴音', '律子'] },
  { name: '虹のデスティネーション', member: ['美希', '雪歩', '伊織', 'あずさ'] },
  { name: 'Legend Girls!!', member: ['春香', '朋花', '百合子', '星梨花', '静香'] },
  { name: 'PRETTY DREAMER', member: ['響', '未来', '風花', '杏奈', '奈緒'] },
  { name: 'レジェンドデイズ', member: ['響', '律子', '亜美', '伊織', 'やよい'] },
  { name: '乙女ストーム！', member: ['未来', '翼', '百合子', '瑞希', '杏奈'] },
  { name: 'クレシェンドブルー', member: ['静香', '麗花', '志保', '茜', '星梨花'] },
  { name: 'エターナルハーモニー', member: ['千早', 'エミリー', 'ジュリア', 'まつり', '風花'] },
  { name: 'リコッタ', member: ['春香', '桃子', 'のり子', '亜利沙', '奈緒'] },
  { name: '灼熱少女', member: ['琴葉', '環', '海美', '恵美', '美也'] },
  { name: 'BIRTH', member: ['真', '雪歩', '歩', 'あずさ', '可奈'] },
  { name: 'ミックスナッツ', member: ['このみ', 'ひなた', '美奈子', '育', '真美'] },
  { name: 'ミルキーウェイ', member: ['美希', '紗代子', '朋花', '昴', '千鶴'] },
  { name: 'ARRIVE', member: ['可憐', '貴音', 'エレナ', '莉緒', 'ロコ'] },
  { name: '創造は始まりの風を連れて', member: ['百合子', '朋花', '星梨花', '亜利沙', 'ロコ'] },
  { name: '侠気乱舞', member: ['ジュリア', '桃子', '環', 'ひなた', 'のり子'] },
  { name: '赤い世界が消える頃', member: ['可奈', '美奈子', '可憐', '瑞希', '麗花'] },
  { name: '閃光☆HANABI団', member: ['紗代子', '奈緒', '海美', '美奈子', 'のり子'] },
  { name: 'ビッグバンズバリボー!!!!!', member: ['海美', '恵美', '紗代子', '風花', '奈緒'] },
  { name: 'オーディナリィ・クローバー', member: ['歌織', '静香', '杏奈', '莉緒', '美也'] },
  { name: 'ラスト・アクトレス', member: ['琴葉', '桃子', 'このみ', '紬', '瑞希'] },
  { name: 'ジェネシス×ネメシス', member: ['紬', '歌織', 'ジュリア', '真', '茜'] },
  { name: 'White Vows', member: ['風花', '莉緒', 'このみ', '歌織', '千鶴'] },
  { name: 'Chrono-Lexica', member: ['百合子', '昴', 'ロコ', '杏奈', '瑞希'] },
  { name: '(TC 孤島サスペンスホラー)', member: ['茜', 'エレナ', '歌織', '千鶴', '志保'] },
  { name: '(TC 近未来アウトサイダー)', member: ['千早', '美希', 'エミリー', '真', '春香'] },
  { name: 'Girl meets Wonder', member: ['星梨花', '桃子', 'まつり', '響', '昴'] },
  { name: 'Vault That Borderline!(カバー)', member: ['翼', 'ジュリア', '百合子', '紗代子', '瑞希'] },
  { name: '私はアイドル♡(カバー)', member: ['瑞希', '恵美', '美也', '桃子', 'まつり'] },
  { name: 'ファンキーノート', member: ['やよい', '響', '伊織', '亜美', '真美'] },
  { name: 'Miracle Night', member: ['春香', '真', '亜美', '真美', '伊織'] },
  { name: 'Light Year Song', member: ['やよい', '真', '亜美', '真美', '響'] },
  { name: 'プリンセススターズ(5人)', member: [ '未来', 'まつり', '百合子', '可奈', 'エミリー'] },
  { name: 'フェアリースターズ(5人)', member: [ '静香', '紬', '恵美', 'ジュリア', '志保' ] },
  { name: 'エンジェルスターズ(5人)', member: [ '翼', '歌織', '麗花', '杏奈', '星梨花' ] },
  { name: 'Sunshine Rhythm(5人)', member: [ 'エレナ', '可奈', '翼', 'ひなた', '美奈子'] },
  { name: 'BlueMoon Harmony(5人)', member: [ '歩', '紗代子', '朋花', '麗花', '静香'] },
  { name: 'Starlight Melody(5人)', member: [ '亜利沙', '未来', '星梨花', '琴葉', '風花'] },
  { name: '765 ALL STARS', member: [ '春香', '千早', '美希', '雪歩', 'やよい', '真', '伊織', '貴音', '律子', 'あずさ', '亜美', '真美', '響'] },
  { name: 'プリンセススターズ', member: [ '未来', '琴葉', '美奈子', 'まつり', '百合子', '紗代子', '亜利沙', '海美', '育', 'エミリー', '可奈', '奈緒', 'のり子'] },
  { name: 'フェアリースターズ', member: [ '静香', '恵美', 'ロコ', '朋花', '志保', '歩', '千鶴', '瑞希', '莉緒', '昴', '桃子', 'ジュリア', '紬' ] },
  { name: 'エンジェルスターズ', member: [ '翼', 'エレナ', '星梨花', '茜', '杏奈', 'ひなた', 'このみ', '環', '風花', '美也', '可憐', '麗花', '歌織' ] },
  { name: 'Sunshine Rhythm', member: [ 'エレナ', '育', 'ロコ', 'エミリー', 'ひなた', '奈緒', '翼', '美奈子', 'のり子', '杏奈', '莉緒', '可奈', '歌織' ] },
  { name: 'BlueMoon Harmony', member: [ '昴', '百合子', '静香', '恵美', '歩', '瑞希', '可憐', '朋花', '千鶴', '麗花', 'ジュリア', '紗代子', '紬' ] },
  { name: 'Starlight Melody', member: [ '未来', 'まつり', '美也', '桃子', '風花', 'このみ', '星梨花', '茜', '環', '志保', '琴葉', '海美', '亜利沙' ] },
];

// アイドルの種類数
export const IDOL_LIST_LENGTH = IDOL_LIST.length;

// そらを除いた、アイドルの種類数
export const IDOL_LIST_LENGTH2 = IDOL_LIST_LENGTH - 1;

// アイドル毎の枚数
export const MAX_IDOL_COUNTS = 3;

// 牌山の枚数
export const TILE_DECK_SIZE = IDOL_LIST_LENGTH * MAX_IDOL_COUNTS;

// 手札の枚数
export const HANDS_SIZE = 13;

// 64bit整数
export interface Int64 {
  upper: number;
  lower: number;
}

// ゼロ
export const INT64_ZERO: Int64 = { upper: 0, lower: 0 };

// ユニット情報
export interface UnitInfo {
  name: string;
  member: Int64;
  member2: number[];
  score: number;
}

// Action
export interface Action {
  type: ActionType;
  message: string;
}
