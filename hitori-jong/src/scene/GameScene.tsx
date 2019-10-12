import React from 'react';
import StateContext from 'context';

// ゲーム画面
const GameScene: React.FC = () => {
	const { dispatch } = React.useContext(StateContext);

	const onClickGtoT = () => dispatch({ type: 'changeSceneGtoT', message: '' });

	return (
		<>
			<h1>ゲーム画面</h1>
			<button onClick={onClickGtoT}>タイトルに戻る</button>
		</>
	);
}

export default GameScene;
