import React, { useContext } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import StateContext from 'context';
import MyHandTileControl from 'Control/MyHandTileControl';
import SelectButtons from 'Parts/SelectButtons';

const GameForm: React.FC = () => {
  const { unitText, turnCount, statusOfCalcTempai, unitTextType, setUnitTextType, dispatch } = useContext(
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

  const checkTempai = () => {
    dispatch({
      type: 'calcTempai',
      message: '',
    });
  };

  return (
    <Container className="px-0">
      <Row>
        <Col>
          <Form>
            <Form.Group className="text-center my-3">
              <Button
                variant="warning"
                className="text-nowrap"
                onClick={onClickReturnButton}
              >
                スタート画面に戻る
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col>
          <Form>
            <Form.Group className="text-center my-3">
              {statusOfCalcTempai ? (
                <Button
                  variant="outline-primary"
                  className="text-nowrap"
                  disabled
                >
                  計算中……
                </Button>
              ) : (
                <Button
                  variant="outline-primary"
                  className="text-nowrap"
                  onClick={() => checkTempai()}
                >
                  {turnCount}順目
                </Button>
              )}
            </Form.Group>
          </Form>
        </Col>
        <Col>
          <Form>
            <Form.Group className="text-center my-3">
              <SelectButtons columns={['成立役', 'リーチ役']} selectedIndex={unitTextType} onClickFunc={setUnitTextType}/>
            </Form.Group>
          </Form>
        </Col>
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
          <pre>{unitText}</pre>
        </Col>
      </Row>
    </Container>
  );
};

export default GameForm;
