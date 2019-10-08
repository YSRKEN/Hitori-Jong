import React, { useContext } from 'react';
import { IDOL_LIST } from 'constant';
import StateContext from 'context';

const TileParts: React.FC<{ idolNumber: number; tileIndex: number }> = ({
  idolNumber,
  tileIndex,
}) => {
  const { handsBoldFlg, dispatch } = useContext(StateContext);

  const onClickTile = () =>
    dispatch({ type: 'drawTile', message: `${tileIndex}` });

  if (handsBoldFlg[tileIndex]) {
    return (
      <span
        role="button"
        className={`vertical-writing border p-1 tile-style mr-1 color-${IDOL_LIST[idolNumber].type} font-weight-bold`}
        onClick={onClickTile}
        tabIndex={tileIndex}
        onKeyUp={onClickTile}
      >
        {IDOL_LIST[idolNumber].name}
      </span>
    );
  }

  return (
    <span
      role="button"
      className={`vertical-writing border p-1 tile-style mr-1 color-${IDOL_LIST[idolNumber].type}`}
      onClick={onClickTile}
      tabIndex={tileIndex}
      onKeyUp={onClickTile}
    >
      {IDOL_LIST[idolNumber].name}
    </span>
  );
};

export default TileParts;
