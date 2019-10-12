import { Action } from './constant/action';
import React from 'react';
import { SceneMode } from 'constant/other';

// アプリケーションの状態
const useStore = () => {
  // 現在の表示モード
  const [sceneMode,] = React.useState<SceneMode>('TitleScene');

  // Reduxライクなdispatch関数
  const dispatch = (action: Action) => {
    switch (action.type) {
    }
  };

  return {
    sceneMode,
    dispatch,
  };
};

export default useStore;
