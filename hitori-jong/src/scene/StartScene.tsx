import React from 'react';
import { APPLICATION_VERSION } from 'constant/other';
import './StartScene.css';
import { TwitterShareButton } from 'react-share';

// タイトル画面
const StartScene: React.FC = () => (
	<div className="title-bar">
		<div className="title-logo">
			<span>ヒトリジャン</span>
		</div>
		<div className="version-logo">
			<span>Ver.{APPLICATION_VERSION}</span>
		</div>
		<div className="button-group">
			<span className="button game-button">ゲーム開始</span>
			<span className="button simulation-button">シミュレーション</span>
			<TwitterShareButton
				url="https://hitori-jong.firebaseapp.com"
				title="一人用ミリジャン「ヒトリジャン」。スマホ対応。"
				hashtags={['ミリジャン', 'ヒトリジャン']}
			>
				<span className="button share-button">Twitter にシェア</span>
			</TwitterShareButton>
		</div>
	</div>
);

export default StartScene;
