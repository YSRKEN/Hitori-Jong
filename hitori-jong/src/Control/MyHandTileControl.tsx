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
    <div className="d-flex mx-auto" style={{ width: 520 }}>
      {temp.map((record: { index: number; idolNumber: number }) => (
        <TileParts
          key={record.index}
          idolNumber={record.idolNumber}
          tileIndex={record.index}
        />
      ))}
    </div>
  );
};

export default MyHandTileControl;
