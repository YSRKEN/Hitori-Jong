import React, { useContext } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import StateContext from 'context';

const StartForm: React.FC = () => {
  const { dispatch } = useContext(StateContext);

  const onClickStartButton = () =>
    dispatch({
      type: 'setApplicationMode',
      message: 'GameForm',
    });

  return (
    <Container>
      <Row>
        <Col className="my-5">
          <h1 className="text-center">ヒトリジャン</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={8} md={4} className="my-3 mx-auto">
          <Form>
            <Button
              size="lg"
              className="w-100 text-nowrap"
              onClick={onClickStartButton}
            >
              スタート
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default StartForm;
