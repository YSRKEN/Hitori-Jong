import React from 'react';
import StateContext from 'context';
import HandTileView from 'parts/HandTileView';
import MyIdolView from 'parts/MyIdolView';
import './SimulationScene.css';
import Button from 'parts/Button';

// シミュレーション画面
const SimulationScene: React.FC = () => {
  const { simulationHand, dispatch } = React.useContext(StateContext);

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
      <div className="footer-hand-tile-view">
        <HandTileView hand={simulationHand} />
      </div>
    </>
  );
};

export default SimulationScene;
