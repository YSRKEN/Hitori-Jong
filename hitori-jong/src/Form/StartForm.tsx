import React, { useContext } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import StateContext from 'context';
import { TwitterShareButton, TwitterIcon } from 'react-share';

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
          <h4 className="text-center">Ver.1.7.1</h4>
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
        <Col xs={12} sm={8} md={4} className="my-3 mx-auto d-flex">
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
          <div className="ml-3">
            <TwitterShareButton
              url="https://hitori-jong.firebaseapp.com"
              title="一人用ミリジャン「ヒトリジャン」。スマホ対応。"
              hashtags={['ミリジャン', 'ヒトリジャン']}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StartForm;
