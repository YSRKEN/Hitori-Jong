import React, { useContext } from 'react';
import StateContext from 'context';
import TileParts from 'Parts/TileParts';

const MyHandTileControl: React.FC = () => {
  const { myHands } = useContext(StateContext);

  // MEMO：Lintのエラー回避のため前処理を施す
  const temp = myHands.map((idolNumber: number, index: number) => {
    return { index, idolNumber };
  });

  return (
    <div>
      {temp.map((record: { index: number; idolNumber: number }) => (
        <TileParts key={record.index} idolNumber={record.idolNumber} />
      ))}
    </div>
  );
};

export default MyHandTileControl;
