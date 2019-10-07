import React from 'react';
import { IDOL_LIST } from 'constant';

const TileParts: React.FC<{ idolNumber: number }> = ({ idolNumber }) => {
  return (
    <span
      className={`vertical-writing border p-1 tile-style mr-1 color-${IDOL_LIST[idolNumber].type}`}
    >
      {IDOL_LIST[idolNumber].name}
    </span>
  );
};

export default TileParts;
