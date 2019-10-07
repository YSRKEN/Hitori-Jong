import React, { useContext } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import StateContext from 'context';
import MyHandTileControl from 'Control/MyHandTileControl';

const GameForm: React.FC = () => {
  const { dispatch } = useContext(StateContext);

  const onClickReturnButton = () => {
    if (window.confirm('スタート画面に戻りますか？')) {
      dispatch({
        type: 'setApplicationMode',
        message: 'StartForm',
      });
    }
  };

  const onClickResetButton = () => {
    dispatch({
      type: 'resetTileDeck',
      message: '',
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group className="text-center my-3">
              <Button
                size="lg"
                variant="warning"
                className="text-nowrap"
                onClick={onClickReturnButton}
              >
                スタート画面に戻る
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group className="text-center my-3">
              <MyHandTileControl />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group className="text-center my-3">
              <Button className="text-nowrap" onClick={onClickResetButton}>
                牌山と手札をリセット
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default GameForm;
