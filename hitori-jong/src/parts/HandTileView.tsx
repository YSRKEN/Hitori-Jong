import React from 'react';
import IdolTile from './IdolTile';
import './HandTileView.css';

const HandTileView: React.FC<{handTileList: number[]}> = ({handTileList}) => {
	const temp = handTileList.map((hand: number, index: number) => {
		return {'hand': hand, 'index': index};
	});

	return (<div className="hand-tile-view">
		{
			temp.map(pair => (<IdolTile key={pair.index} idolIndex={pair.hand} />))
		}
	</div>);
};

export default HandTileView;
