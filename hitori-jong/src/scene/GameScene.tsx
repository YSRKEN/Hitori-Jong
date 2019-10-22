import React from 'react';
import StateContext from 'context';
import './GameScene.css';
import MyIdolView from 'parts/MyIdolView';
import Button from 'parts/Button';
import HandTileView from 'parts/HandTileView';

// ゲーム画面
const GameScene: React.FC = () => {
  const { simulationHand, dispatch } = React.useContext(StateContext);

  const onClickGtoT = () => dispatch({ type: 'changeSceneGtoT', message: '' });

  return (<>
    <div className="header-button-group">
      <Button
        text="タイトルに戻る"
        className="back-to-title"
        onClick={onClickGtoT}
      />
      <MyIdolView />
    </div>
    <div className="footer-hand-tile-view">
      <HandTileView hand={simulationHand} />
    </div>
  </>);
};

export default GameScene;
