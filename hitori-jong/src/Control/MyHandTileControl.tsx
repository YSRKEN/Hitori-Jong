import React, { useContext } from 'react';
import StateContext from 'context';
import TileParts from 'Parts/TileParts';

const MyHandTileControl: React.FC = () => {
  const { myHands } = useContext(StateContext);

  return (
    <div>
      {myHands.map((idolNumber: number) => (
        <TileParts key={idolNumber} idolNumber={idolNumber} />
      ))}
    </div>
  );
};

export default MyHandTileControl;
