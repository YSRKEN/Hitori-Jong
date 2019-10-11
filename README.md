# Hitori-Jong(ヒトリジャン)
ミリジャンを一人用スマホWebゲーにしてみました。
Webサイト→ https://hitori-jong.firebaseapp.com

## 導入方法

- 単純に、[Webサイト](https://hitori-jong.firebaseapp.com)をWebブラウザで開けばそのまま使用できます
- 当アプリはPWA技術に対応しています。Webブラウザのメニューから「ホーム画面に追加」or「デスクトップに追加」を選択することにより、まるで普通のスマホアプリ・PCアプリのようにアイコンを登録して使用できます

## 使い方

- サイトに入って「スタート」ボタンを押すと、すぐさまゲーム画面に移行します
- ゲーム画面では、ひたすら牌を捨てる(そして自動的にツモる)ことを繰り返します。牌は名前が書かれた長方形で表現されており、クリックもしくはタップして捨てることができます
- 牌の中で太字になっているのは、最高得点となるように自動判定したユニットに組み込まれているものです
- どのユニットが自動判定されたかは、「役？」ボタンをタップすると表示されます
  - ついでに、後1枚何を入れるとどんな役ができるかも表示されます
- 全ての牌をユニットで使い切った＝アガリ(「ミリオンライブ」))の状態になった際は、その旨を知らせるダイアログが表示されます
- 牌の下のチェックボックスを2箇所選択すると、その2箇所の牌の位置が入れ替わります
- 「テンパイ？」ボタンを押すと、アガリまで残り1枚の状態なのかどうかを判定してくれます
- 「リセット」ボタンを押すと、手牌と順目がリセットされます

## バージョン履歴

- Ver.1.4.0
  - UI周りを大幅に変更
    - 手牌は指で押しやすいように画面下部に配置した
    - 成立役・リーチ役の情報はボタンを押して表示するようにした
    - これに伴い、「X順目」ボタンが再び「押しても意味のないボタン」になった
  - 牌の強調ルーチンを修正した
  - リーチ役の表示時に、できる予定の役のユニット構成も表示するようにした
  - 同じ役が複数手牌の中にあった際に認識できていなかった問題を修正した
  - 認識した成立役を元に、手牌を自動で理牌する機能を追加した

- Ver.1.3.0
  -  テンパイチェック機能について、パフォーマンスを更に向上させた
  - ユニット情報として、ラスアク・プリンセススターズ(5人)・フェアリースターズ(5人)・エンジェルスターズ(5人)を追加

- Ver.1.2.0
  - テンパイチェック機能について、パフォーマンスを向上させた。また、結果をより見やすくした
  - 現在成立している役(成立役)と、後1枚入れれば完成する役(リーチ役)との表示切り替え機能を追加

- Ver.1.1.0
  - 牌を交換できるようにした
  - 手役を追加した
  - 牌山以上にツモれてしまう問題を修正した
  - 画面中央上のボタンを押すと、テンパイ時はどの牌を交換すればいいかを計算して表示するようにした(テンパイチェック機能)
  - 画面の方向を、強制的に横向きレイアウトにした

- Ver.1.0.0
  - アガリ(「ミリオンライブ」)の判定に問題があったので修正
    - アガれる場合は優先してアガるようにした

- Ver.0.9.0
  - 初版
