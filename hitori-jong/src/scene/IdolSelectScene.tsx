import React from 'react';
import Button from 'parts/Button';
import StateContext from 'context';

// アイドル選択画面
const IdolSelectScene: React.FC = () => {
  const { dispatch } = React.useContext(StateContext);

  // 各種コマンド
  const onClickItoS = () => dispatch({ type: 'changeSceneItoS', message: '' });

  return (
    <>
      <div className="header-button-group">
        <Button
          className="back-to-simulation"
          text="シミュレーション画面に戻る"
          onClick={onClickItoS}
        />
      </div>
    </>
  );
};

export default IdolSelectScene;
