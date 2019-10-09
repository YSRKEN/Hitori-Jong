import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

const SelectButtons: React.FC<{ columns: string[], selectedIndex: number, onClickFunc: (x: number) => void }> = ({
	columns,
	selectedIndex,
	onClickFunc
}) => {
	const temp = columns.map((value, index) => {return {'name': value, 'index': index}});

	return (
		<ButtonGroup aria-label="SelectButtons">
			{
				temp.map((r: {'name': string, 'index': number}) => {
					if (r.index === selectedIndex) {
						return (<Button className="text-nowrap" variant="secondary" key={r.index}>{r.name}</Button>);
					} else {
						return (<Button className="text-nowrap" variant="outline-secondary" key={r.index} onClick={() => onClickFunc(r.index)}>{r.name}</Button>);
					}
				})
			}
		</ButtonGroup>
	);
};

export default SelectButtons;
