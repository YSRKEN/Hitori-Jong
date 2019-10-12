import React from 'react';
import StateContext from 'context';

// シミュレーション画面
const SimulationScene: React.FC = () => {
	const { dispatch } = React.useContext(StateContext);

	const onClickStoT = () => dispatch({ type: 'changeSceneStoT', message: '' });

	return (
		<>
			<h1>シミュレーション画面</h1>
			<button onClick={onClickStoT}>タイトルに戻る</button>
		</>
	);
}

export default SimulationScene;
