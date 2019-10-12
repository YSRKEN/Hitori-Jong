import React from 'react';
import StateContext from 'context';
import TitleScene from './TitleScene';

// 表示シーンに応じて表示内容を切り替える
const SceneSelector: React.FC = () => {
	const { sceneMode } = React.useContext(StateContext);

	switch (sceneMode) {
		case 'TitleScene':
			return <TitleScene />;
		default:
			return (<></>);
	}
}

export default SceneSelector;
