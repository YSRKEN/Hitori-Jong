import React from 'react';
import { IDOL_LIST } from 'constant/idol';

const HandTileView: React.FC<{handTileList: number[]}> = ({handTileList}) => {
	const temp = handTileList.map((hand: number, index: number) => {
		return {'hand': hand, 'index': index};
	});

	return (<>
		{
			temp.map(pair => (<span key={pair.index}>{IDOL_LIST[pair.hand].name}</span>))
		}
	</>);
};

export default HandTileView;
