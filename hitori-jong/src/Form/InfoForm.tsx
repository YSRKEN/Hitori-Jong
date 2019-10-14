import React, { useContext } from 'react';
import StateContext from 'context';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const InfoForm: React.FC = () => {
	const { infoText, dispatch } = useContext(StateContext);

	const onClickBackButton = () =>
		dispatch({
			type: 'setApplicationMode',
			message: 'GameForm',
		});

	return (
		<Container>
			<Row className="my-3">
				<Col>
					<Form>
						<Form.Group>
							<Button
								className="text-nowrap"
								onClick={onClickBackButton}
							>
								ゲーム画面へ
							</Button>
						</Form.Group>
					</Form>
				</Col>
			</Row>
			<Row>
				<Col>
					<pre>{infoText}</pre>
				</Col>
			</Row>
		</Container>
	);
};

export default InfoForm;
