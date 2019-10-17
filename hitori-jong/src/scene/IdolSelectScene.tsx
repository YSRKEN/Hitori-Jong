import React from 'react';
import Button from 'parts/Button';
import StateContext from 'context';
import { KANA_TO_IDOL_LIST, IDOL_LIST } from 'constant/idol';
import './IdolSelectScene.css';

// アイドル選択画面
const IdolSelectScene: React.FC = () => {
  const { selectedKana, dispatch } = React.useContext(StateContext);

  // 各種コマンド
  const onClickItoS = () => dispatch({ type: 'changeSceneItoS', message: '' });

  return (
    <>
      <div className="header-button-group">
        <Button
          className="back-to-simulation"
          text="シミュレーション画面に戻る"
          onClick={onClickItoS}
        />
      </div>
      <div className="idol-tile-list">
        {KANA_TO_IDOL_LIST.filter(r => r.kana === selectedKana)[0].idol.map(
          idolIndex => {
            const idol = IDOL_LIST[idolIndex];
            const fontStyle =
              idol.name.length >= 4 ? 'font-size-small' : 'font-size-normal';

            return (
              <button
                type="button"
                className={`idol-tile color-${idol.type} ${fontStyle}`}
                key={idolIndex}
              >
                {idol.name}
              </button>
            );
          },
        )}
      </div>
    </>
  );
};

export default IdolSelectScene;
