import React, { useContext } from 'react';
import StateContext from 'context';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { IDOL_LIST_LENGTH, IDOL_LIST } from 'constant';

const SelectForm: React.FC = () => {
  const { dispatch } = useContext(StateContext);

  const onClickBackButton = () =>
    dispatch({ type: 'setApplicationMode', message: 'GameForm' });

  const onClicktile = (idolNumber: number) =>
    dispatch({ type: 'setTile', message: `${idolNumber}` });

  const temp = Array(IDOL_LIST_LENGTH);
  for (let i = 0; i < IDOL_LIST_LENGTH; i += 1) {
    temp[i] = i;
  }

  return (
    <Container className="px-0">
      <Row className="my-3">
        <Col>
          <Form>
            <Form.Group className="text-center">
              <Button onClick={onClickBackButton}>ゲーム画面に戻る</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <div className="d-flex mx-auto flex-wrap" style={{ width: 520 }}>
            {temp.map((idolNumber: number) => (
              <span
                role="button"
                className={`vertical-writing border p-1 tile-style mr-3 mb-3 color-${IDOL_LIST[idolNumber].type} font-weight-bold d-block`}
                key={idolNumber}
                tabIndex={idolNumber}
                onClick={() => onClicktile(idolNumber)}
                onKeyUp={() => onClicktile(idolNumber)}
              >
                {IDOL_LIST[idolNumber].name}
              </span>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SelectForm;
