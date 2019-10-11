import React, { useContext } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import StateContext from 'context';
import MyHandTileControl from 'Control/MyHandTileControl';
import SelectButtons from 'Parts/SelectButtons';

const GameForm: React.FC = () => {
  const { turnCount, statusOfCalcTempai, editFlg, dispatch } = useContext(
    StateContext,
  );

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

  const checkUnits = () => {
    dispatch({
      type: 'checkUnits',
      message: '',
    });
  };

  const checkTempai = () => {
    dispatch({
      type: 'calcTempai',
      message: '',
    });
  };

  const requestSort = () => {
    dispatch({
      type: 'requestSort',
      message: '',
    });
  };

  const setEditFlg = (x: number) => {
    dispatch({
      type: 'setEditFlg',
      message: x === 0 ? 'No' : 'Yes',
    });
  };

  return (
    <Container className="px-0">
      <Row className="mt-5">
        <Col>
          <Form className="d-flex">
            <Form.Group className="text-center mr-3">
              <Button
                variant="warning"
                className="text-nowrap"
                onClick={onClickReturnButton}
              >
                スタート画面へ
              </Button>
            </Form.Group>
            <Form.Group className="text-center mr-3">
              <Button
                variant="outline-primary"
                className="text-nowrap"
                disabled
              >
                {turnCount}順目
              </Button>
            </Form.Group>
            <Form.Group className="text-center mr-3">
              <Button
                variant="info"
                className="text-nowrap"
                onClick={() => checkUnits()}
              >
                役？
              </Button>
            </Form.Group>
            <Form.Group className="text-center mr-3">
              {statusOfCalcTempai ? (
                <Button variant="info" className="text-nowrap" disabled>
                  計算中……
                </Button>
              ) : (
                <Button
                  variant="info"
                  className="text-nowrap"
                  onClick={() => checkTempai()}
                >
                  テンパイ？
                </Button>
              )}
            </Form.Group>
            <Form.Group className="text-center mr-3">
              <Button
                className="text-nowrap"
                variant="secondary"
                onClick={() => requestSort()}
              >
                自動理牌
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form className="d-flex mt-3">
            <Form.Group className="text-center mr-3">
              <SelectButtons
                columns={['通常', '編集']}
                selectedIndex={editFlg}
                onClickFunc={setEditFlg}
              />
            </Form.Group>
            <Form.Group className="text-center">
              <Button className="text-nowrap" onClick={onClickResetButton}>
                リセット
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="fixed-bottom mb-3">
        <Col>
          <Form>
            <Form.Group className="text-center my-3">
              <MyHandTileControl />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default GameForm;
