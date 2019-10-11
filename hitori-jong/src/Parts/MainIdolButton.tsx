import React from 'react';
import { Button } from 'react-bootstrap';

import { IDOL_LIST } from "constant";

const MainIdolButton: React.FC<{ mainIdolIndex: number }> = ({ mainIdolIndex }) => {

	const idol = IDOL_LIST[mainIdolIndex];
	const buttonText = `担当＝${idol.name}`;

	switch (idol.type) {
		case 'Princess':
			return (<Button variant="outline-danger" className="text-nowrap" disabled>{buttonText}</Button>);
		case 'Fairy':
			return (<Button variant="outline-primary" className="text-nowrap" disabled>{buttonText}</Button>);
		case 'Angel':
			return (<Button variant="outline-warning" className="text-nowrap" disabled>{buttonText}</Button>);
		case 'Extra':
			return (<Button variant="outline-info" className="text-nowrap" disabled>{buttonText}</Button>);
		case 'Sora':
			return (<Button variant="outline-dark" className="text-nowrap" disabled>{buttonText}</Button>);
		default:
			return (<></>);

	}
};

export default MainIdolButton;
