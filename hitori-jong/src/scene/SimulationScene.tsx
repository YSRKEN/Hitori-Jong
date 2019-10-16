import React from 'react';
import StateContext from 'context';
import HandTileView from 'parts/HandTileView';
import MyIdolView from 'parts/MyIdolView';
import './SimulationScene.css';
import Button from 'parts/Button';
import { UNIT_LIST2 } from 'constant/unit';

// シミュレーション画面
const SimulationScene: React.FC = () => {
  const { simulationHand, handCheckFlg, dispatch } = React.useContext(
    StateContext,
  );

  let commandSet: JSX.Element;
  if (handCheckFlg.findIndex(flg => flg) < 0) {
    // いずれのチェックボックスも選択していない場合
    commandSet = (
      <>
        <Button text="ユニット検索" />
        <Button text="受け入れ検索" />
      </>
    );
  } else {
    // チェック位置にいずれのユニットも存在しないか？
    const allUnitMemberCount =
      simulationHand.unitIndexes.length > 0
        ? simulationHand.unitIndexes
            .map(index => UNIT_LIST2[index].memberCount)
            .reduce((p, c) => p + c)
        : 0;
    if (handCheckFlg.slice(0, allUnitMemberCount).findIndex(flg => flg) < 0) {
      // チェック位置にいずれのユニットも存在しない
      commandSet = (
        <>
          <Button text="チー" />
          <Button text="ユニット固定" />
          <Button text="左シフト" />
          <Button text="右シフト" />
        </>
      );
    } else {
      // チェック位置にいずれかのユニットが存在する
      commandSet = (
        <>
          <Button text="チー解除" />
          <Button text="ユニット固定解除" />
        </>
      );
    }
  }

  const onClickStoT = () => dispatch({ type: 'changeSceneStoT', message: '' });

  return (
    <>
      <div className="header-button-group">
        <Button
          text="タイトルに戻る"
          className="back-to-title"
          onClick={onClickStoT}
        />
        <MyIdolView />
      </div>
      <div className="command-button-group">{commandSet}</div>
      <div className="footer-hand-tile-view">
        <HandTileView hand={simulationHand} />
      </div>
    </>
  );
};

export default SimulationScene;
