import React from 'react';
import './HandTileView.css';
import { Hand } from 'constant/other';
import { calcShowMembers } from 'service/HandService';
import IdolTile from './IdolTile';

const HandTileView: React.FC<{ hand: Hand }> = ({ hand }) => {
  const temp = calcShowMembers(hand).map((idolIndex: number, index: number) => {
    return { idolIndex, index };
  });

  return (
    <div className="hand-tile-view">
      {temp.map(pair => (
        <IdolTile key={pair.index} idolIndex={pair.idolIndex} />
      ))}
    </div>
  );
};

export default HandTileView;
