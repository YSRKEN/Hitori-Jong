import React from 'react';
import { IDOL_LIST } from 'constant';

const TileParts: React.FC<{ idolNumber: number }> = ({ idolNumber }) => {
  return (
    <span className="vertical-writing border p-1">{IDOL_LIST[idolNumber]}</span>
  );
};

export default TileParts;
