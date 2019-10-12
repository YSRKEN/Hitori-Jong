import React from 'react';
import './App.css';
import StateContext from 'context';
import useStore from 'store';
import { TwitterShareButton, TwitterIcon } from 'react-share';

const App: React.FC = () => {
  const context = useStore();

  return (
    <StateContext.Provider value={context}>
      <h1>ヒトリジャン Ver.2.0.0</h1>
      <TwitterShareButton
        url="https://hitori-jong.firebaseapp.com"
        title="一人用ミリジャン「ヒトリジャン」。スマホ対応。"
        hashtags={['ミリジャン', 'ヒトリジャン']}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </StateContext.Provider>
  );
};

export default App;
