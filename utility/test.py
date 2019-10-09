from pprint import pprint
from typing import List, Dict, Union, Set

UNIT_LIST: List[Dict[str, Union[str, Set[str]]]] = [
    {'name': '(詩花)', 'member': {'詩花'}},
    {'name': 'ハルカナミライ', 'member': {'春香', '未来'}},
    {'name': '成長Chu→LOVER!!', 'member': {'杏奈', '百合子'}},
    {'name': 'Light Year Song', 'member': {'やよい', '真', '亜美', '真美', '響'}},
]


SCORE_DICT: Dict[int, int] = {1: 1000, 2: 2000, 3: 4000, 4: 6000, 5: 8000}


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


def main():
    # 手牌
    hands = ['春香', '未来', '杏奈', '百合子', 'やよい', '真', '亜美', '真美', '響', '詩花', 'あずさ', '伊織', '貴音']

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
            for p, s in zip(unit_score_list, unit_pattern):
                score += p * s
                tile_count += s
            if tile_count == 13:
                score += 100000000
            if score > max_score:
                max_score = score
                max_unit_pattern = unit_pattern
    max_score = max_score % 100000000

    # 結果を出力する
    print(f'点数：{max_score}点')
    for pattern, unit in zip(max_unit_pattern, hand_unit_list):
        if pattern > 0:
            print(f'[{pattern}回] {unit["name"]} {unit["member"]}')


if __name__ == '__main__':
    main()
