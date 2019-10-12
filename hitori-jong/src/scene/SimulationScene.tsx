import React from 'react';
import StateContext from 'context';
import './SimulationScene.css';
import HandTileView from 'parts/HandTileView';

// シミュレーション画面
const SimulationScene: React.FC = () => {
    const { handTileListS, dispatch } = React.useContext(StateContext);

	const onClickStoT = () => dispatch({ type: 'changeSceneStoT', message: '' });

	return (
		<>
			<div className="back-to-title-button">
				<span onClick={onClickStoT}>タイトルに戻る</span>
			</div>
			<div>
				<HandTileView handTileList={handTileListS}/>
			</div>
		</>
	);
}

export default SimulationScene;
