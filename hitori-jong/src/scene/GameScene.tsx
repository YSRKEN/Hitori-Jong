import React from 'react';
import StateContext from 'context';
import './GameScene.css';

// ゲーム画面
const GameScene: React.FC = () => {
	const { dispatch } = React.useContext(StateContext);

	const onClickGtoT = () => dispatch({ type: 'changeSceneGtoT', message: '' });

	return (
		<>
			<div className="back-to-title-button">
				<span onClick={onClickGtoT}>タイトルに戻る</span>
			</div>
		</>
	);
}

export default GameScene;
