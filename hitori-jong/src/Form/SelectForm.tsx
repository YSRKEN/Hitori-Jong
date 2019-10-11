import React, { useContext } from 'react';
import StateContext from 'context';
import { Button } from 'react-bootstrap';

const SelectForm: React.FC = () => {
  const { dispatch } = useContext(StateContext);

  const onClickBackButton = () =>
    dispatch({ type: 'setApplicationMode', message: 'GameForm' });

  return <Button onClick={onClickBackButton}>ゲーム画面に戻る</Button>;
};

export default SelectForm;
