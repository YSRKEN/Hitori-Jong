import React from 'react';
import StateContext from 'context';
import './MyIdolView.css';
import { IDOL_LIST } from 'constant/idol';

// シミュレーション画面
const MyIdolView: React.FC = () => {
  const { myIdol } = React.useContext(StateContext);

  const idol = IDOL_LIST[myIdol];

  return (
    <span className={`button my-idol color-${idol.type}`}>
      担当：{idol.name}
    </span>
  );
};

export default MyIdolView;
