import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';

import { IDOL_LIST } from "constant";
import StateContext from 'context';

const MainIdolButton: React.FC = () => {

	const { mainIdolIndex, dispatch } = useContext(StateContext);

	const onClickMIB = () => dispatch({ type: 'setMIB', message: '' });

	const idol = IDOL_LIST[mainIdolIndex];
	const buttonText = `担当＝${idol.name}`;

	switch (idol.type) {
		case 'Princess':
			return (<Button variant="outline-danger" className="text-nowrap" onClick={onClickMIB}>{buttonText}</Button>);
		case 'Fairy':
			return (<Button variant="outline-primary" className="text-nowrap" onClick={onClickMIB}>{buttonText}</Button>);
		case 'Angel':
			return (<Button variant="outline-warning" className="text-nowrap" onClick={onClickMIB}>{buttonText}</Button>);
		case 'Extra':
			return (<Button variant="outline-info" className="text-nowrap" onClick={onClickMIB}>{buttonText}</Button>);
		case 'Sora':
			return (<Button variant="outline-dark" className="text-nowrap" onClick={onClickMIB}>{buttonText}</Button>);
		default:
			return (<></>);

	}
};

export default MainIdolButton;
