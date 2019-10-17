import json
import sqlite3
from contextlib import closing

import pandas

with closing(sqlite3.connect('765pro.sqlite3')) as conn:
    df = pandas.read_sql('SELECT short_name AS name, kana, type FROM member ORDER BY id', con=conn)
    with open('member.json', 'w', encoding='utf-8') as f:
        df.to_json(f, force_ascii=False, orient='records')

    df = pandas.read_sql('SELECT unit.unit, member.short_name AS member FROM unit LEFT JOIN member ON'
                         ' member.name=unit.member ORDER BY unit.id', con=conn)
    dict1 = {}
    dict2 = {}
    for record in df.to_records():
        unit = record[1]
        member = record[2]
        if unit not in dict1:
            dict1[unit] = []
            dict2[len(dict2)] = unit
        dict1[unit].append(member)
    output = []
    for i in range(0, len(dict2)):
        output.append({'name': dict2[i], 'member': dict1[dict2[i]]})
    json.dump(output, open('unit.json', mode='w', encoding='utf-8'), ensure_ascii=False)
