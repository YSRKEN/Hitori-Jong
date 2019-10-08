import sqlite3
import json
from contextlib import closing

import pandas
from pandas import DataFrame

# データ読み込み
data1 = pandas.DataFrame.from_records(json.load(open('idol_list.json', encoding='utf-8')))
data2 = pandas.DataFrame.from_records(json.load(open('idol_list2.json', encoding='utf-8')))
data3 = pandas.read_csv('raw_list.tsv', sep='\t', encoding='utf-8')

# 結合して整形(メンバーリスト)
member_df: DataFrame = data1.merge(data2, on='name', how='right')[['id', 'name', 'short_name', 'kana', 'type', 'color']]
member_df['id'] = range(1, len(member_df) + 1)
member_df.set_index(keys='id', inplace=True)
member_df.at[53, 'type'] = 'Extra'
member_df.at[54, 'type'] = 'Sora'
member_df.at[53, 'color'] = '#85ac84'  # ステラステージのキャラ紹介における名前色
member_df.at[54, 'color'] = '#00b450'  # グリマスカードのアイコン色
member_df.reset_index(inplace=True)

# 整形(ユニットリスト)
new_list = []
for record in data3.to_records():
    unit = record[2]
    members = record[3].split(' ')
    for member in members:
        new_list.append({'unit': unit, 'member': member})
unit_df = pandas.DataFrame.from_records(new_list)
unit_df['id'] = range(1, len(unit_df) + 1)
unit_df = unit_df[['id', 'unit', 'member']]

# 出力
with closing(sqlite3.connect('765pro.sqlite3')) as conn:
    member_df.to_sql('member', conn, if_exists='replace', index=False)
    unit_df.to_sql('unit', conn, if_exists='replace', index=False)
