import React from 'react';
import { APPLICATION_VERSION } from 'constant/other';
import './TitleScene.css';
import { TwitterShareButton } from 'react-share';
import StateContext from 'context';

// タイトル画面
const TitleScene: React.FC = () => {
  const { dispatch } = React.useContext(StateContext);

  const onClickTtoG = () => dispatch({ type: 'changeSceneTtoG', message: '' });
  const onClickTtoS = () => dispatch({ type: 'changeSceneTtoS', message: '' });

  return (
    <>
      <div className="misc-links">
        <span>
          <a
            href="https://twitter.com/YSRKEN"
            rel="noopener noreferrer"
            target="_blank"
          >
            作者Twitter
          </a>
        </span>
        <span>
          <a
            href="https://github.com/YSRKEN/Hitori-Jong"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </span>
        <span>
          <a
            href="https://github.com/YSRKEN/Hitori-Jong/wiki/取扱説明書"
            rel="noopener noreferrer"
            target="_blank"
          >
            取扱説明書
          </a>
        </span>
      </div>
      <div className="title-bar">
        <div className="title-logo">
          <span>ヒトリジャン</span>
        </div>
        <div className="version-logo">
          <span>Ver.{APPLICATION_VERSION}</span>
        </div>
      </div>
      <div className="button-group">
        <span
          role="button"
          tabIndex={0}
          className="top-button game"
          onClick={onClickTtoG}
          onKeyUp={onClickTtoG}
        >
          ゲーム開始
        </span>
        <span
          role="button"
          tabIndex={0}
          className="top-button simulation"
          onClick={onClickTtoS}
          onKeyUp={onClickTtoS}
        >
          シミュレーション
        </span>
        <div className="share-wrap">
          <TwitterShareButton
            url="https://hitori-jong.firebaseapp.com"
            title="一人用ミリジャン「ヒトリジャン」。スマホ対応。"
            hashtags={['ミリジャン', 'ヒトリジャン']}
          >
            <span role="button" tabIndex={0} className="top-button share">
              Twitter にシェア
            </span>
          </TwitterShareButton>
        </div>
      </div>
    </>
  );
};

export default TitleScene;
