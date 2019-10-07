import React, { useContext } from 'react';
import { IDOL_LIST } from 'constant';
import StateContext from 'context';

const TileParts: React.FC<{ idolNumber: number, tileIndex: number }> = ({ idolNumber, tileIndex }) => {
  const { dispatch } = useContext(StateContext);

  const onClickTile = () => dispatch({'type': 'drawTile', 'message': `${tileIndex}`});

  return (
    <span
      className={`vertical-writing border p-1 tile-style mr-1 color-${IDOL_LIST[idolNumber].type}`}
      onClick={onClickTile}
    >
      {IDOL_LIST[idolNumber].name}
    </span>
  );
};

export default TileParts;
