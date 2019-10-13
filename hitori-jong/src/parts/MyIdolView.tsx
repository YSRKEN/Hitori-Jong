import React from 'react';
import StateContext from 'context';
import './MyIdolView.css';
import { IDOL_LIST } from 'constant/idol';

// シミュレーション画面
const MyIdolView: React.FC = () => {
	const { myIdol } = React.useContext(StateContext);

	const idol = IDOL_LIST[myIdol];
	const classList = ['my-idol-view'];
	if (['Princess', 'Fairy', 'Angel'].includes(idol.type)) {
		classList.push(`color-${idol.type}`);
	}

	return (
		<div className={classList.join(' ')}>
			<span>担当：{idol.name}</span>
		</div>
	);
}

export default MyIdolView;
