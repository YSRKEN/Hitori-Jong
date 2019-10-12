import React from 'react';
import StateContext from 'context';
import './SimulationScene.css';

// シミュレーション画面
const SimulationScene: React.FC = () => {
	const { dispatch } = React.useContext(StateContext);

	const onClickStoT = () => dispatch({ type: 'changeSceneStoT', message: '' });

	return (
		<>
			<div className="back-to-title-button">
				<span onClick={onClickStoT}>タイトルに戻る</span>
			</div>
		</>
	);
}

export default SimulationScene;
