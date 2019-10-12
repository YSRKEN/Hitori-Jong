import React from 'react';
import { APPLICATION_VERSION } from 'constant/other';
import './StartScene.css';
import { TwitterShareButton } from 'react-share';

// タイトル画面
const StartScene: React.FC = () => (
	<>
		<div className="misc-links">
			<span><a href="https://twitter.com/YSRKEN" rel="noopener noreferrer" target="_blank">作者Twitter</a></span>
			<span><a href="https://github.com/YSRKEN/Hitori-Jong" rel="noopener noreferrer" target="_blank">GitHub</a></span>
			<span><a href="https://github.com/YSRKEN/Hitori-Jong/wiki/取扱説明書" rel="noopener noreferrer" target="_blank">取扱説明書</a></span>
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
			<span className="game-button">ゲーム開始</span>
			<span className="simulation-button">シミュレーション</span>
			<TwitterShareButton
				url="https://hitori-jong.firebaseapp.com"
				title="一人用ミリジャン「ヒトリジャン」。スマホ対応。"
				hashtags={['ミリジャン', 'ヒトリジャン']}
			>
				<span className="share-button">Twitter にシェア</span>
			</TwitterShareButton>
		</div>
	</>
);

export default StartScene;
