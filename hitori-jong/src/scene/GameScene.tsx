import React from 'react';
import StateContext from 'context';
import './GameScene.css';
import MyIdolView from 'parts/MyIdolView';

// ゲーム画面
const GameScene: React.FC = () => {
  const { dispatch } = React.useContext(StateContext);

  const onClickGtoT = () => dispatch({ type: 'changeSceneGtoT', message: '' });

  return (
    <div className="header-button-group">
      <span
        role="button"
        tabIndex={0}
        className="button back-to-title"
        onClick={onClickGtoT}
        onKeyUp={onClickGtoT}
      >
        タイトルに戻る
      </span>
      <MyIdolView />
    </div>
  );
};

export default GameScene;
