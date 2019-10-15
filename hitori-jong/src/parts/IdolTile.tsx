import React from 'react';
import { IDOL_LIST } from 'constant/idol';
import './IdolTile.css';

// アイドルの牌
const IdolTile: React.FC<{ idolId: number }> = ({ idolId }) => {
  const idolInfo = IDOL_LIST[idolId];
  const classList = ['idol-tile', `color-${idolInfo.type}`];
  if (idolInfo.name.length >= 4) {
    classList.push('font-size-small');
  } else {
    classList.push('font-size-normal');
  }

  return <span className={classList.join(' ')}>{idolInfo.name}</span>;
};

export default IdolTile;
