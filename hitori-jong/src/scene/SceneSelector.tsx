import React from 'react';
import StateContext from 'context';
import './Scene.css';
import TitleScene from './TitleScene';
import GameScene from './GameScene';
import SimulationScene from './SimulationScene';
import KanaKeyBoardScene from './KanaKeyBoardScene';
import IdolSelectScene from './IdolSelectScene';
import UnitResultScene from './UnitResultScene';

// 表示シーンに応じて表示内容を切り替える
const SceneSelector: React.FC = () => {
  const { sceneMode } = React.useContext(StateContext);

  switch (sceneMode) {
    case 'TitleScene':
      return <TitleScene />;
    case 'GameScene':
      return <GameScene />;
    case 'SimulationScene':
      return <SimulationScene />;
    case 'KanaKeyBoardScene':
      return <KanaKeyBoardScene />;
    case 'IdolSelectScene':
      return <IdolSelectScene />;
    case 'UnitResultScene':
      return <UnitResultScene />;
    default:
      return <></>;
  }
};

export default SceneSelector;
