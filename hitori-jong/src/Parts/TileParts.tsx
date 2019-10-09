import React, { useContext } from 'react';
import { IDOL_LIST } from 'constant';
import StateContext from 'context';

const TileParts: React.FC<{ idolNumber: number; tileIndex: number }> = ({
  idolNumber,
  tileIndex,
}) => {
  const { handsBoldFlg, checkedTileFlg, dispatch } = useContext(StateContext);

  const onClickTile = () =>
    dispatch({ type: 'drawTile', message: `${tileIndex}` });

  const onClickCheck = () =>
    dispatch({ type: 'checkTile', message: `${tileIndex}` });

  if (handsBoldFlg[tileIndex]) {
    return (
      <div>
        <span
          role="button"
          className={`vertical-writing border p-1 tile-style mr-1 color-${IDOL_LIST[idolNumber].type} font-weight-bold d-block`}
          onClick={onClickTile}
          tabIndex={tileIndex}
          onKeyUp={onClickTile}
        >
          {IDOL_LIST[idolNumber].name}
        </span>
        <input
          type="checkbox"
          checked={checkedTileFlg[tileIndex]}
          onChange={onClickCheck}
        />
      </div>
    );
  }

  return (
    <div>
      <span
        role="button"
        className={`vertical-writing border p-1 tile-style mr-1 color-${IDOL_LIST[idolNumber].type} d-block`}
        onClick={onClickTile}
        tabIndex={tileIndex}
        onKeyUp={onClickTile}
      >
        {IDOL_LIST[idolNumber].name}
      </span>
      <input
        type="checkbox"
        checked={checkedTileFlg[tileIndex]}
        onChange={onClickCheck}
      />
    </div>
  );
};

export default TileParts;
