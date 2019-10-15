import React from 'react';
import './HandTileView.css';
import { Hand, HAND_TILE_SIZE_PLUS, HAND_TILE_SIZE } from 'constant/other';
import { calcShowMembers } from 'service/HandService';
import StateContext from 'context';
import { range } from 'service/UtilityService';
import IdolTile from './IdolTile';

const HandTileView: React.FC<{ hand: Hand }> = ({ hand }) => {
  const { handCheckFlg } = React.useContext(StateContext);

  const memberList = calcShowMembers(hand);

  return (
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
            />
            <IdolTile idolId={memberList[tileIndex]} />
          </div>
        );
      })}
    </div>
  );
};

export default HandTileView;
