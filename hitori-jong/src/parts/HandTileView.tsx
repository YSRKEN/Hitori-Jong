import React from 'react';
import './HandTileView.css';
import { Hand, HAND_TILE_SIZE_PLUS, HAND_TILE_SIZE } from 'constant/other';
import { calcShowMembers } from 'service/HandService';
import StateContext from 'context';
import { range } from 'service/UtilityService';
import IdolTile from './IdolTile';
import { UNIT_LIST2 } from 'constant/unit';

// 手牌一覧＋役表示＋チェックボックス
const HandTileView: React.FC<{ hand: Hand }> = ({ hand }) => {
  const { handCheckFlg, dispatch } = React.useContext(StateContext);

  const memberList = calcShowMembers(hand);

  const checkIdolTile = (tileIndex: number) =>
    dispatch({ type: 'checkIdolTile', message: tileIndex.toString() });

  console.log(hand);

  return (<>
    <div className="idol-tile-list">
      {range(HAND_TILE_SIZE_PLUS).map(tileIndex => {
        if (tileIndex >= HAND_TILE_SIZE) {
          return (
            <div key={tileIndex} className="tile-with-checkbox bottom">
              <input
                className="checkbox hidden"
                type="checkbox"
                checked={handCheckFlg[tileIndex]}
              />
              <IdolTile idolId={memberList[tileIndex]} />
            </div>
          );
        }

        return (
          <div key={tileIndex} className="tile-with-checkbox">
            <input
              className="checkbox"
              type="checkbox"
              checked={handCheckFlg[tileIndex]}
              onChange={() => checkIdolTile(tileIndex)}
            />
            <IdolTile idolId={memberList[tileIndex]} />
          </div>
        );
      })}
    </div>
    <div className="unit-block-list">
      {range(hand.unitIndexes.length).map(index => {
        const unit = UNIT_LIST2[hand.unitIndexes[index]];
        const style = {
          'width': `calc(${10 * unit.memberCount}vh + ${2 * (unit.memberCount - 1)}vh + ${2 * unit.memberCount}px)`,
          'color': hand.unitChiFlg[index] ? 'red' : 'black',
          'fontWeight': hand.unitChiFlg[index] ? 'bold' : 'normal',
        } as React.CSSProperties;
        return (
          <span key={index} className="unit-block" style={style}>
            {unit.name}
          </span>
        );
      })}
    </div>
  </>);
};

export default HandTileView;
