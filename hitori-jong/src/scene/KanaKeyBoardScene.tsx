import React from 'react';
import StateContext from 'context';
import { range } from 'service/UtilityService';
import { KANA_LIST, KANA_TO_IDOL_LIST } from 'constant/idol';
import Button from 'parts/Button';
import './KanaKeyBoardScene.css';

// キーボード画面
const KanaKeyBoardScene: React.FC = () => {
  const { dispatch } = React.useContext(StateContext);

  // 各種コマンド
  const onClickKtoS = () => dispatch({ type: 'changeSceneKtoS', message: '' });
  const onClickSetKana = (kana: string) =>
    dispatch({ type: 'setKana', message: kana });

  return (
    <>
      <div className="header-button-group">
        <Button
          className="back-to-simulation"
          text="シミュレーション画面に戻る"
          onClick={onClickKtoS}
        />
      </div>
      <div>
        <table className="kana-table">
          <tbody>
            {range(5).map(y => (
              <tr key={y}>
                {range(10).map(x => {
                  const kanaIndex = (9 - x) * 5 + y;
                  const kana = KANA_LIST.substring(kanaIndex, kanaIndex + 1);
                  if (kana !== '　') {
                    const members = KANA_TO_IDOL_LIST.filter(
                      r => r.kana === kana,
                    )[0];
                    if (members.idol.length > 0) {
                      return (
                        <td key={x} className="kana-button">
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => onClickSetKana(kana)}
                            onKeyUp={() => onClickSetKana(kana)}
                          >
                            {kana}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td className="kana-button-disabled" key={x}>
                        {kana}
                      </td>
                    );
                  }

                  return (
                    <td
                      className="kana-button"
                      style={{ visibility: 'hidden' }}
                      key={x}
                    >
                      {kana}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default KanaKeyBoardScene;
