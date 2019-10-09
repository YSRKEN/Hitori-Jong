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
          <h4 className="text-center">Ver.1.0.0</h4>
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
      <Row>
        <Col xs={12} sm={8} md={4} className="my-3 mx-auto">
          <span>
            <a
              href="https://github.com/YSRKEN/Hitori-Jong/blob/master/README.md"
              className="mr-3"
            >
              遊び方
            </a>
            <a href="https://twitter.com/YSRKEN" className="mr-3">
              作者Twitter
            </a>
            <a href="https://github.com/YSRKEN/Hitori-Jong">GitHub</a>
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default StartForm;
