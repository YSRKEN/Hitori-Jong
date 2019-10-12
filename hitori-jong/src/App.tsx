import React from 'react';
import './App.css';
import StateContext from 'context';
import useStore from 'store';
import SceneSelector from 'scene/SceneSelector';

// アプリケーションのトップレベル層におけるFC
const App: React.FC = () => {
  const context = useStore();

  return (
    <StateContext.Provider value={context}>
      <SceneSelector />
    </StateContext.Provider>
  );
};

export default App;
