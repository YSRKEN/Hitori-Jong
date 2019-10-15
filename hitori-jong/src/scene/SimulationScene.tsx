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
        <div className="back-to-title-button">
          <span
            role="button"
            tabIndex={0}
            onClick={onClickStoT}
            onKeyUp={onClickStoT}
          >
            タイトルに戻る
          </span>
        </div>
        <MyIdolView />
      </div>
      <div className="footer-hand-tile-view">
        <HandTileView hand={simulationHand} />
      </div>
    </>
  );
};

export default SimulationScene;
