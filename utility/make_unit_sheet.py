import sqlite3
from contextlib import closing

import pandas

with closing(sqlite3.connect('765pro.sqlite3')) as conn:
    df = pandas.read_sql('SELECT name FROM member ORDER BY id', con=conn)
    name_list = list(df['name'].values)

    for name in name_list:
        df = pandas.read_sql(f'SELECT unit FROM unit WHERE member=\'{name}\'', con=conn)
        print(name)
        print(df)
