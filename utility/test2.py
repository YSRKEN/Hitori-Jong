import time
from pprint import pprint
from typing import List, Dict, Union, Set, Tuple

UNIT_LIST: List[Dict[str, Union[str, Set[str]]]] = [
    {"name": "(詩花)", "member": {"詩花"}},
    {"name": "マイティセーラーズ(2人)", "member": {"海美", "翼"}},
    {"name": "恋するTwist&Shout", "member": {"やよい", "律子"}},
    {"name": "inferno SQUARING", "member": {"千早", "雪歩"}},
    {"name": "ハルカナミライ", "member": {"春香", "未来"}},
    {"name": "成長Chu→LOVER!!", "member": {"杏奈", "百合子"}},
    {"name": "エスケープ", "member": {"ジュリア", "恵美"}},
    {"name": "Eternal Spiral", "member": {"やよい", "可奈"}},
    {"name": "piece of cake", "member": {"麗花", "志保"}},
    {"name": "アライブファクター", "member": {"千早", "静香"}},
    {"name": "Persona Voice", "member": {"千鶴", "雪歩"}},
    {"name": "Cut. Cut. Cut.", "member": {"桃子", "瑞希"}},
    {"name": "Smiling Crescent", "member": {"星梨花", "美也"}},
    {"name": "Decided", "member": {"まつり", "このみ"}},
    {"name": "深層マーメイド", "member": {"翼", "響"}},
    {"name": "HELLO, YOUR ANGEL♪", "member": {"朋花", "育"}},
    {"name": "G♡F", "member": {"律子", "可憐"}},
    {"name": "little trip around the world", "member": {"エミリー", "伊織"}},
    {"name": "Melody in scape", "member": {"紗代子", "美奈子"}},
    {"name": "Your HOME TOWN", "member": {"ひなた", "亜美"}},
    {"name": "fruity love", "member": {"茜", "ロコ"}},
    {"name": "夜に輝く星座のように", "member": {"亜利沙", "奈緒"}},
    {"name": "秘密のメモリーズ", "member": {"貴音", "風花"}},
    {"name": "たしかな足跡", "member": {"あずさ", "莉緒"}},
    {"name": "Understand? Understand!", "member": {"海美", "琴葉"}},
    {"name": "ジャングル☆パーティー", "member": {"環", "真美"}},
    {"name": "Beat the World!!", "member": {"真", "歩"}},
    {"name": "Emergence Vibe", "member": {"エレナ", "美希"}},
    {"name": "Dreamscape", "member": {"昴", "のり子"}},
    {"name": "Cleasky", "member": {"美也", "エレナ"}},
    {"name": "D/Zeal", "member": {"ジュリア", "静香"}},
    {"name": "Charlotte・Charlotte", "member": {"まつり", "エミリー"}},
    {"name": "メリー(デュオ)", "member": {"可奈", "志保"}},
    {"name": "GO MY WAY!!(カバー)", "member": {"未来", "静香"}},
    {"name": "ビジョナリー(カバー)", "member": {"星梨花", "杏奈"}},
    {"name": "Do-Dai(カバー)", "member": {"星梨花", "海美"}},
    {"name": "i(カバー)", "member": {"星梨花", "亜利沙"}},
    {"name": "神SUMMER!!(カバー)", "member": {"奈緒", "美奈子"}},
    {"name": "キラメキラリ(カバー)", "member": {"茜", "紬"}},
    {"name": "わんつ→ているず", "member": {"真美", "やよい"}},
    {"name": "CRIMSON LOVERS", "member": {"春香", "千早"}},
    {"name": "聖炎の女神", "member": {"貴音", "律子"}},
    {"name": "ブルウ・スタア", "member": {"真", "響"}},
    {"name": "始めのDon't worry", "member": {"美希", "伊織"}},
    {"name": "LEMONADE", "member": {"雪歩", "あずさ"}},
    {"name": "FleurS", "member": {"百合子", "桃子", "このみ"}},
    {"name": "マイティセーラーズ", "member": {"百合子", "海美", "翼"}},
    {"name": "ミリオンシグナル", "member": {"未来", "静香", "翼"}},
    {"name": "きゅんっ！ヴァンパイアガール", "member": {"伊織", "育", "桃子"}},
    {"name": "待ち受けプリンス", "member": {"やよい", "真", "伊織"}},
    {"name": "99 Nights", "member": {"美希", "伊織", "貴音"}},
    {"name": "咲きませ！！乙女塾", "member": {"春香", "真", "真美"}},
    {"name": "キミチャンネル", "member": {"春香", "響", "真"}},
    {"name": "Fate of the World", "member": {"春香", "千早", "美希"}},
    {"name": "レオ", "member": {"エレナ", "育", "ロコ"}},
    {"name": "キャンサー", "member": {"エミリー", "ひなた", "奈緒"}},
    {"name": "リブラ", "member": {"翼", "美奈子", "のり子"}},
    {"name": "カプリコーン", "member": {"杏奈", "莉緒", "可奈"}},
    {"name": "ウィルゴ", "member": {"昴", "百合子", "静香"}},
    {"name": "サジタリアス", "member": {"恵美", "歩", "瑞希"}},
    {"name": "ピスケス", "member": {"可憐", "朋花", "千鶴"}},
    {"name": "アクアリウス", "member": {"麗花", "ジュリア", "紗代子"}},
    {"name": "アリエス", "member": {"環", "茜", "星梨花"}},
    {"name": "タウラス", "member": {"未来", "まつり", "美也"}},
    {"name": "ジェミニ", "member": {"桃子", "風花", "このみ"}},
    {"name": "トゥインクルリズム", "member": {"育", "百合子", "亜利沙"}},
    {"name": "EScape", "member": {"瑞希", "志保", "紬"}},
    {"name": "りるきゃん ～3 little candy～", "member": {"可憐", "茜", "翼"}},
    {"name": "STAR ELEMENTS", "member": {"未来", "可奈", "琴葉"}},
    {"name": "ミリラジ組", "member": {"未来", "静香", "星梨花"}},
    {"name": "アイル", "member": {"翼", "ジュリア", "瑞希"}},
    {"name": "トライスタービジョン", "member": {"琴葉", "恵美", "エレナ"}},
    {"name": "ONLY MY NOTE(カバー)", "member": {"春香", "未来", "可奈"}},
    {"name": "MUSIC♪(カバー)", "member": {"歌織", "紗代子", "可奈"}},
    {"name": "Dreaming!(カバー)", "member": {"可奈", "星梨花", "海美"}},
    {"name": "プロジェクト・フェアリー", "member": {"響", "貴音", "美希"}},
    {"name": "SprouT", "member": {"春香", "雪歩", "響"}},
    {"name": "Funny Logic", "member": {"やよい", "亜美", "真美"}},
    {"name": "竜宮小町", "member": {"亜美", "あずさ", "伊織", "律子"}},
    {"name": "Good-Byes", "member": {"やよい", "あずさ", "律子", "亜美"}},
    {"name": "星彩ステッパー", "member": {"美希", "伊織", "亜美", "真美"}},
    {"name": "虹のデスティネーション", "member": {"美希", "伊織", "雪歩", "あずさ"}},
    {"name": "edeN", "member": {"美希", "雪歩", "真", "貴音"}},
    {"name": "静かな夜に願いを…", "member": {"千早", "雪歩", "真美"}},
    {"name": "そして僕らは旅にでる", "member": {"春香", "雪歩", "やよい", "あずさ"}},
    {"name": "Vault That Borderline!", "member": {"春香", "千早", "あずさ", "律子"}},
    {"name": "Blue Symphony", "member": {"千早", "志保", "琴葉", "恵美"}},
    {"name": "Sentimental Venus", "member": {"伊織", "エミリー", "莉緒", "瑞希"}},
    {"name": "Marionetteは眠らない", "member": {"美希", "翼", "麗花", "ジュリア"}},
    {"name": "カワラナイモノ", "member": {"あずさ", "可憐", "紗代子", "のり子"}},
    {"name": "Good-Sleep, Baby♡", "member": {"やよい", "環", "育", "可奈"}},
    {"name": "Helloコンチェルト", "member": {"律子", "ひなた", "美奈子", "亜利沙"}},
    {"name": "瞳の中のシリウス", "member": {"貴音", "海美", "まつり", "美也"}},
    {"name": "Fu-Wa-Du-Wa", "member": {"真", "真美", "エレナ", "歩"}},
    {"name": "ココロがかえる場所", "member": {"雪歩", "桃子", "千鶴", "ロコ"}},
    {"name": "Bigバルーン◎", "member": {"亜美", "昴", "このみ", "茜"}},
    {"name": "スコーピオ", "member": {"志保", "海美", "亜利沙", "琴葉"}},
    {"name": "夜想令嬢-GRAC&E_NOCTURNE-", "member": {"朋花", "恵美", "千鶴", "莉緒"}},
    {"name": "4Luxury", "member": {"歌織", "風花", "麗花", "このみ"}},
    {"name": "Jelly PoP Beans", "member": {"ロコ", "歩", "昴", "桃子"}},
    {"name": "ピコピコプラネッツ", "member": {"星梨花", "環", "ひなた", "杏奈"}},
    {"name": "Clover", "member": {"可奈", "志保", "星梨花", "海美"}},
    {"name": "Xs", "member": {"美希", "雪歩", "真", "伊織"}},
    {"name": "僕たちのResistance", "member": {"美希", "千早", "やよい", "響"}},
    {"name": "アマテラス", "member": {"雪歩", "あずさ", "貴音", "律子"}},
    {"name": "BRAVE STAR", "member": {"春香", "千早", "貴音", "律子"}},
    {"name": "Thank You!", "member": {"百合子", "志保", "杏奈", "このみ", "エミリー"}},
    {"name": "Vertex Meister", "member": {"千早", "律子", "真", "貴音", "響"}},
    {"name": "メリー", "member": {"春香", "千早", "美希", "やよい", "真"}},
    {"name": "Legend Girls!!", "member": {"春香", "朋花", "百合子", "星梨花", "静香"}},
    {"name": "PRETTY DREAMER", "member": {"響", "未来", "風花", "杏奈", "奈緒"}},
    {"name": "レジェンドデイズ", "member": {"響", "律子", "亜美", "伊織", "やよい"}},
    {"name": "乙女ストーム！", "member": {"未来", "翼", "百合子", "瑞希", "杏奈"}},
    {"name": "クレシェンドブルー", "member": {"静香", "麗花", "志保", "茜", "星梨花"}},
    {"name": "Eternal Harmony", "member": {"千早", "エミリー", "ジュリア", "まつり", "風花"}},
    {"name": "リコッタ", "member": {"春香", "桃子", "のり子", "亜利沙", "奈緒"}},
    {"name": "灼熱少女", "member": {"琴葉", "環", "海美", "恵美", "美也"}},
    {"name": "BIRTH", "member": {"真", "雪歩", "歩", "あずさ", "可奈"}},
    {"name": "ミックスナッツ", "member": {"このみ", "ひなた", "美奈子", "育", "真美"}},
    {"name": "ミルキーウェイ", "member": {"美希", "紗代子", "朋花", "昴", "千鶴"}},
    {"name": "ARRIVE", "member": {"可憐", "貴音", "エレナ", "莉緒", "ロコ"}},
    {"name": "創造は始まりの風を連れて", "member": {"百合子", "朋花", "星梨花", "亜利沙", "ロコ"}},
    {"name": "侠気乱舞", "member": {"ジュリア", "桃子", "環", "ひなた", "のり子"}},
    {"name": "赤い世界が消える頃", "member": {"可奈", "美奈子", "可憐", "瑞希", "麗花"}},
    {"name": "閃光☆HANABI団", "member": {"紗代子", "奈緒", "海美", "美奈子", "のり子"}},
    {"name": "ビッグバンズバリボー!!!!!", "member": {"海美", "恵美", "紗代子", "風花", "奈緒"}},
    {"name": "オーディナリィ・クローバー", "member": {"歌織", "静香", "杏奈", "莉緒", "美也"}},
    {"name": "ラスト・アクトレス", "member": {"琴葉", "桃子", "このみ", "紬", "瑞希"}},
    {"name": "Justice OR Voice", "member": {"紬", "歌織", "ジュリア", "真", "茜"}},
    {"name": "White Vows", "member": {"風花", "莉緒", "このみ", "歌織", "千鶴"}},
    {"name": "Chrono-Lexica", "member": {"百合子", "昴", "ロコ", "杏奈", "瑞希"}},
    {"name": "(TC 孤島サスペンスホラー)", "member": {"茜", "エレナ", "歌織", "千鶴", "志保"}},
    {"name": "World changer", "member": {"千早", "美希", "エミリー", "真", "春香"}},
    {"name": "Girl meets Wonder", "member": {"星梨花", "桃子", "まつり", "響", "昴"}},
    {"name": "Vault That Borderline!(カバー)", "member": {"翼", "ジュリア", "百合子", "紗代子", "瑞希"}},
    {"name": "私はアイドル♡(カバー)", "member": {"瑞希", "恵美", "美也", "桃子", "まつり"}},
    {"name": "ビジョナリー", "member": {"やよい", "響", "伊織", "亜美", "真美"}},
    {"name": "Miracle Night", "member": {"春香", "真", "亜美", "真美", "伊織"}},
    {"name": "Light Year Song", "member": {"やよい", "真", "亜美", "真美", "響"}},
    {"name": "ザ・ライブ革命でSHOW!", "member": {"美希", "やよい", "真", "亜美", "真美", "貴音"}},
    {"name": "Happy!", "member": {"春香", "千早", "雪歩", "伊織", "あずさ", "響", "律子"}},
    {"name": "PRINCESS STARS", "member": {"未来", "まつり", "百合子", "可奈", "エミリー"}},
    {"name": "FAIRY STARS", "member": {"静香", "紬", "恵美", "ジュリア", "志保"}},
    {"name": "ANGEL STARS", "member": {"翼", "歌織", "麗花", "杏奈", "星梨花"}},
    {"name": "サンリズム・オーケストラ♪", "member": {"エレナ", "可奈", "翼", "ひなた", "美奈子"}},
    {"name": "brave HARMONY", "member": {"歩", "紗代子", "朋花", "麗花", "静香"}},
    {"name": "Starry Melody", "member": {"亜利沙", "未来", "星梨花", "琴葉", "風花"}},
    {"name": "765 ALL STARS", "member": {"春香", "千早", "美希", "雪歩", "やよい", "真", "伊織", "貴音", "律子", "あずさ", "亜美", "真美", "響"}},
    {"name": "PRINCESS STARS(13人)",
     "member": {"未来", "琴葉", "美奈子", "まつり", "百合子", "紗代子", "亜利沙", "海美", "育", "エミリー", "可奈", "奈緒", "のり子"}},
    {"name": "FAIRY STARS(13人)",
     "member": {"静香", "恵美", "ロコ", "朋花", "志保", "歩", "千鶴", "瑞希", "莉緒", "昴", "桃子", "ジュリア", "紬"}},
    {"name": "ANGEL STARS(13人)",
     "member": {"翼", "エレナ", "星梨花", "茜", "杏奈", "ひなた", "このみ", "環", "風花", "美也", "可憐", "麗花", "歌織"}},
    {"name": "Sunshine Rhythm(13人)",
     "member": {"エレナ", "育", "ロコ", "エミリー", "ひなた", "奈緒", "翼", "美奈子", "のり子", "杏奈", "莉緒", "可奈", "歌織"}},
    {"name": "BlueMoon Harmony(13人)",
     "member": {"昴", "百合子", "静香", "恵美", "歩", "瑞希", "可憐", "朋花", "千鶴", "麗花", "ジュリア", "紗代子", "紬"}},
    {"name": "Starlight Melody(13人)",
     "member": {"未来", "まつり", "美也", "桃子", "風花", "このみ", "星梨花", "茜", "環", "志保", "琴葉", "海美", "亜利沙"}}
]

SCORE_DICT: Dict[int, int] = {1: 1000, 2: 2000, 3: 4000, 4: 6000, 5: 8000, 6: 10000, 7: 12000, 13: 24000}


def tile_info(hands: List[str]) -> Dict[str, int]:
    count: Dict[str, int] = {}
    for hand in hands:
        if hand not in count:
            count[hand] = 0
            count[hand] += 1
    return count


def unit_count_in_hands(hands_info: Dict[str, int], unit_info: Dict[str, int]) -> int:
    list_h = []
    list_u = []
    for key in unit_info:
        list_h.append(hands_info[key])
        list_u.append(unit_info[key])
    max_count = 1
    for count in range(2, 4):
        list_u2 = [x * count for x in list_u]
        if list_h >= list_u2:
            max_count = count
        else:
            break
    return max_count


# 組み合わせunit_patternを用いてunit_info_listから役を決定した一覧(各アイドルの枚数)
def calc_units_info(unit_info_list: List[Dict[str, int]], unit_pattern: List[int]) -> Dict[str, int]:
    output: Dict[str, int] = {}
    for i in range(0, len(unit_info_list)):
        if unit_pattern[i] > 0:
            for key, val in unit_info_list[i].items():
                if key not in output:
                    output[key] = 0
                output[key] += val * unit_pattern[i]
    return output


# 手牌と役の組み合わせとを比較して、その組み合わせが妥当かを判断する
def judge_info(hands_info: Dict[str, int], units_info: Dict[str, int]) -> bool:
    for key, val in units_info.items():
        if key not in hands_info:
            return False
        if hands_info[key] < val:
            return False
    return True


def find_best_unit_pattern_old(hands: List[str]) -> Tuple[List[Dict[str, Union[str, Set[str]]]], int]:
    # 手牌をあらかじめSetしたものを用意する
    hands_set = set(hands)

    # 役のそれぞれにアクセスし、当てはまるものを抽出する
    hand_unit_list = [x for x in UNIT_LIST if len(x['member'] & hands_set) == len(x['member'])]

    # 手牌におけるカウント
    hands_info = tile_info(hands)

    # 役それぞれのカウント
    unit_info_list = [tile_info(list(x['member'])) for x in hand_unit_list]

    # 役それぞれの点数
    unit_score_list = [SCORE_DICT[len(x['member'])] for x in hand_unit_list]

    # 含まれる役の個数
    unit_count_list = [unit_count_in_hands(hands_info, x) for x in unit_info_list]

    # 組み合わせを展開
    unit_patterns: List[List[int]] = []
    for count_size in unit_count_list:
        temp = list(range(0, count_size + 1))
        if len(unit_patterns) == 0:
            unit_patterns = [[x] for x in temp]
        else:
            new_unit_patterns = []
            for unit_pattern in unit_patterns:
                for val in temp:
                    temp2 = [x for x in unit_pattern]
                    temp2.append(val)
                    new_unit_patterns.append(temp2)
            unit_patterns = new_unit_patterns

    # 各組み合わせについて、実現可能かを判定し、最大スコアのものを選択する
    # ただしアガリ(ミリオンライブ)の場合はそちらを優先させる
    max_score = 0
    max_unit_pattern = []
    for unit_pattern in unit_patterns:
        selected_units_info = calc_units_info(unit_info_list, unit_pattern)
        if judge_info(hands_info, selected_units_info):
            score = 0
            tile_count = 0
            index = 0
            for p, s in zip(unit_score_list, unit_pattern):
                score += p * s
                tile_count += s * len(hand_unit_list[index]['member'])
                index += 1
            if tile_count == 13:
                score += 10000000
            if score > max_score:
                max_score = score
                max_unit_pattern = unit_pattern
    max_unit_pattern2 = []
    for pattern, unit in zip(max_unit_pattern, hand_unit_list):
        if pattern > 0:
            for k in range(0, pattern):
                max_unit_pattern2.append(unit)
    return max_unit_pattern2, max_score


def find_best_unit_pattern(hands: List[str]) -> Tuple[List[Dict[str, Union[str, Set[str]]]], int]:

    # 手牌がない＝使い切れたのでアガリとみなす
    if len(hands) == 0:
        return [], 1000000

    # 手牌をあらかじめSetしたものを用意する
    hands_set = set(hands)

    # 役のそれぞれにアクセスし、当てはまるものを抽出する
    hand_unit_list = [x for x in UNIT_LIST if len(x['member'] & hands_set) == len(x['member'])]

    # 役を1つ選択し、それを取り去った残りで探索
    best_pattern = ([], 0)
    for unit in hand_unit_list:
        temp = set()
        new_hands = []
        for hand in hands:
            if hand in unit['member'] and hand not in temp:
                temp.add(hand)
                continue
            new_hands.append(hand)
        result = find_best_unit_pattern(new_hands)
        unit_score = SCORE_DICT[len(unit['member'])]
        if result[1] + unit_score > best_pattern[1]:
            best_pattern = (result[0] + [unit], result[1] + unit_score)
    return best_pattern


cache: Dict[str, Tuple[List[Dict[str, Union[str, Set[str]]]], int]] = {}


def find_best_unit_pattern_2(hands: List[str], pre_unit_list=None) -> Tuple[List[Dict[str, Union[str, Set[str]]]], int]:
    hands_key = ','.join(hands)
    if hands_key in cache:
        return cache[hands_key]

    if pre_unit_list is None:
        pre_unit_list = UNIT_LIST

    # 手牌がない＝使い切れたのでアガリとみなす
    if len(hands) == 0:
        return [], 1000000

    # 手牌をあらかじめSetしたものを用意する
    hands_set = set(hands)

    # 役のそれぞれにアクセスし、当てはまるものを抽出する
    hand_unit_list = [x for x in pre_unit_list if len(x['member'] & hands_set) == len(x['member'])]

    # 役を1つ選択し、それを取り去った残りで探索
    best_pattern = ([], 0)
    for unit in hand_unit_list:
        temp = set()
        new_hands = []
        for hand in hands:
            if hand in unit['member'] and hand not in temp:
                temp.add(hand)
                continue
            new_hands.append(hand)
        result = find_best_unit_pattern_2(new_hands, hand_unit_list)
        unit_score = SCORE_DICT[len(unit['member'])]
        if result[1] + unit_score > best_pattern[1]:
            best_pattern = (result[0] + [unit], result[1] + unit_score)

    cache[hands_key] = best_pattern
    return best_pattern


def main():
    # 手牌
    # hands = ['志保', '星梨花', '海美', '可奈', 'まつり', 'このみ', '瑞希', '翼', 'ジュリア', '律子', '春香', '千早', 'あずさ']
    hands = ['春香', '千早', '美希', '真', '貴音', 'やよい', 'まつり', '真美', 'エミリー', '亜美', '桃子', '伊織', '育']

    """
    start_time = time.perf_counter()
    for i in range(0, 10):
        find_best_unit_pattern_old(hands)
    elapsed_time = time.perf_counter() - start_time
    print(elapsed_time / 10)
    """

    start_time = time.perf_counter()
    for i in range(0, 100):
        find_best_unit_pattern(hands)
    elapsed_time = time.perf_counter() - start_time
    print(elapsed_time / 100)

    start_time = time.perf_counter()
    global cache
    for i in range(0, 1000):
        find_best_unit_pattern_2(hands)
        cache = {}
    elapsed_time = time.perf_counter() - start_time
    print(elapsed_time / 1000)
    pprint(find_best_unit_pattern_2(hands))


if __name__ == '__main__':
    main()
