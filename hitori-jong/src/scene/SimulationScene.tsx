import React from 'react';
import StateContext from 'context';
import HandTileView from 'parts/HandTileView';
import MyIdolView from 'parts/MyIdolView';
import './SimulationScene.css';
import Button from 'parts/Button';
import { calcHandUnitLengthSum } from 'service/HandService';

// シミュレーション画面
const SimulationScene: React.FC = () => {
  const { simulationHand, handCheckFlg, dispatch } = React.useContext(
    StateContext,
  );

  // 各種コマンド
  const onClickStoT = () => dispatch({ type: 'changeSceneStoT', message: '' });
  const ejectUnit = () => dispatch({ type: 'ejectUnit', message: '' });
  const shiftLeft = () => dispatch({ type: 'shiftLeft', message: '' });
  const shiftRight = () => dispatch({ type: 'shiftRight', message: '' });

  // コマンドパレットを動的生成
  const calcCommandJsxElement = (): JSX.Element => {
    // いずれのチェックボックスも選択していない場合
    if (handCheckFlg.findIndex(flg => flg) < 0) {
      return (
        <>
          <Button text="ユニット検索" />
          <Button text="受け入れ検索" />
          <Button text="自動理牌" />
        </>
      );
    }

    // チェック位置にいずれのユニットも存在しない場合
    const handUnitLengthSum = calcHandUnitLengthSum(simulationHand);
    if (handUnitLengthSum === 0 || handCheckFlg.slice(0, handUnitLengthSum).findIndex(flg => flg) < 0) {
      // チェック位置にいずれのユニットも存在しない
      return (
        <>
          <Button text="チー" />
          <Button text="ユニット固定" />
          <Button text="左シフト" onClick={shiftLeft} />
          <Button text="右シフト" onClick={shiftRight} />
        </>
      );
    }

    // チェック位置にいずれかのユニットが存在する場合
    return (
      <>
        <Button text="チー・ユニット固定解除" onClick={ejectUnit} />
      </>
    );
  };

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
      <div className="command-button-group">{calcCommandJsxElement()}</div>
      <div className="footer-hand-tile-view">
        <HandTileView hand={simulationHand} />
      </div>
    </>
  );
};

export default SimulationScene;
