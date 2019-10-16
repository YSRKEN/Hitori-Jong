import React from 'react';
import StateContext from 'context';
import './GameScene.css';
import MyIdolView from 'parts/MyIdolView';
import Button from 'parts/Button';

// ゲーム画面
const GameScene: React.FC = () => {
  const { dispatch } = React.useContext(StateContext);

  const onClickGtoT = () => dispatch({ type: 'changeSceneGtoT', message: '' });

  return (
    <div className="header-button-group">
      <Button
        text="タイトルに戻る"
        className="back-to-title"
        onClick={onClickGtoT}
      />
      <MyIdolView />
    </div>
  );
};

export default GameScene;
