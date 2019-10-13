import React from 'react';
import { IDOL_LIST } from 'constant/idol';
import './IdolTile.css';

// アイドルの牌
const IdolTile: React.FC<{idolIndex: number}> = ({idolIndex}) => {
	const idolInfo = IDOL_LIST[idolIndex];
	const classList = ['idol-tile', `color-${idolInfo.type}`];
	if (idolInfo.name.length >= 4) {
		classList.push('font-size-small');
	} else {
		classList.push('font-size-normal');
	}
	const classText = classList.join(' ');
	return (<span className={classText}>{idolInfo.name}</span>);
}

export default IdolTile;
