import React from 'react';
import StateContext from 'context';
import './MyIdolView.css';
import { IDOL_LIST } from 'constant/idol';

// シミュレーション画面
const MyIdolView: React.FC = () => {
  const { sceneMode, myIdol, dispatch } = React.useContext(StateContext);

  const idol = IDOL_LIST[myIdol];

  const onClick = () => dispatch({type: 'changeSceneStoK', message: sceneMode === 'GameScene' ? '-1' : '-2'});

  return (
    <span
      className={`button my-idol color-${idol.type}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyUp={onClick}>
      担当：{idol.name}
    </span>
  );
};

export default MyIdolView;
