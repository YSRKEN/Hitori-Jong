import React from 'react';
import StateContext from 'context';
import HandTileView from 'parts/HandTileView';
import MyIdolView from 'parts/MyIdolView';
import './SimulationScene.css';

// シミュレーション画面
const SimulationScene: React.FC = () => {
	const { handTileListS, dispatch } = React.useContext(StateContext);

	const onClickStoT = () => dispatch({ type: 'changeSceneStoT', message: '' });

	return (
		<>
			<div className="header-button-group">
				<div className="back-to-title-button">
					<span onClick={onClickStoT}>タイトルに戻る</span>
				</div>
				<MyIdolView />
			</div>
			<div className="footer-hand-tile-view">
				<HandTileView handTileList={handTileListS} />
			</div>
		</>
	);
}

export default SimulationScene;
