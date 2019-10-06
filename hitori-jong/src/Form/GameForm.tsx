import React, { useContext } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import StateContext from 'context';

const GameForm: React.FC = () => {
	const { dispatch } = useContext(StateContext);

	const onClickReturnButton = () => {
		if (window.confirm('スタート画面に戻りますか？')) {
			dispatch({
				type: 'setApplicationMode', message: 'StartForm'
			});
		}
	};

	return (
		<Container>
			<Row>
				<Col xs={12} sm={8} md={4} className="my-3 mx-auto">
					<Form>
						<Button size="lg" variant="warning" className="w-100" onClick={onClickReturnButton}>スタート画面に戻る</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default GameForm;
