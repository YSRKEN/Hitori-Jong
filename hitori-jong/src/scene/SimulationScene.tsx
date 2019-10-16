import React from 'react';
import StateContext from 'context';
import HandTileView from 'parts/HandTileView';
import MyIdolView from 'parts/MyIdolView';
import './SimulationScene.css';

// シミュレーション画面
const SimulationScene: React.FC = () => {
  const { simulationHand, dispatch } = React.useContext(StateContext);

  const onClickStoT = () => dispatch({ type: 'changeSceneStoT', message: '' });

  return (
    <>
      <div className="header-button-group">
        <span
          className="button back-to-title"
          role="button"
          tabIndex={0}
          onClick={onClickStoT}
          onKeyUp={onClickStoT}
        >
          タイトルに戻る
        </span>
        <MyIdolView />
      </div>
      <div className="footer-hand-tile-view">
        <HandTileView hand={simulationHand} />
      </div>
    </>
  );
};

export default SimulationScene;
