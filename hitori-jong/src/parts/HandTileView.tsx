import React from 'react';
import './HandTileView.css';
import { Hand } from 'constant/other';
import { calcShowMembers } from 'service/HandService';
import IdolTile from './IdolTile';

const HandTileView: React.FC<{ hand: Hand }> = ({ hand }) => {
  // ESLintの制約により、各タイルに対するインデックスを事前に付与する必要がある
  const memberList = calcShowMembers(hand).map(
    (idolIndex: number, index: number) => {
      return { idolIndex, index };
    },
  );

  return (
    <div className="hand-tile-view">
      {memberList.map(member => (
        <IdolTile key={member.index} idolIndex={member.idolIndex} />
      ))}
    </div>
  );
};

export default HandTileView;
