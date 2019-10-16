import React from 'react';
import { Hand, HAND_TILE_SIZE, HAND_TILE_SIZE_PLUS } from 'constant/other';
import { calcShowMembers } from 'service/HandService';
import StateContext from 'context';
import { range } from 'service/UtilityService';
import { IDOL_LIST } from 'constant/idol';
import './HandTileView.css';
import { UNIT_LIST2, UnitInfo } from 'constant/unit';
import Button from './Button';

// 手牌一覧＋役表示＋チェックボックス
const HandTileView: React.FC<{ hand: Hand }> = ({ hand }) => {
  const { handCheckFlg, dispatch } = React.useContext(StateContext);

  const memberList = calcShowMembers(hand);

  const checkIdolTile = (tileIndex: number) =>
    dispatch({ type: 'checkIdolTile', message: tileIndex.toString() });

  const unitDialog = (unit: UnitInfo, chiFlg: boolean) => {
    let output = '';
    output += `ユニット名：${unit.name}`;
    output += `\nユニット：${unit.member
      .map(i => IDOL_LIST[i].name)
      .join('、')}`;
    if (chiFlg) {
      output += `\n点数(チー)：${unit.scoreWithChi}`;
    } else {
      output += `\n点数：${unit.score}`;
    }
    window.alert(output);
  };

  const unitCount = hand.unitIndexes.length;

  return (
    <table className="hand-tile-table">
      <tbody>
        <tr>
          {range(HAND_TILE_SIZE).map(index => (
            <td className="tile-checkbox" key={index}>
              <input
                type="checkbox"
                key={index}
                checked={handCheckFlg[index]}
                onChange={() => checkIdolTile(index)}
              />
            </td>
          ))}
          <td />
        </tr>
        <tr>
          {range(HAND_TILE_SIZE_PLUS).map(index => {
            const idol = IDOL_LIST[memberList[index]];
            const idolName = idol.name;
            const fontStyle =
              idolName.length >= 4 ? 'font-size-small' : 'font-size-normal';
            const colorStyle = `color-${idol.type}`;

            return (
              <td key={index}>
                <span className={`idol-tile ${fontStyle} ${colorStyle}`}>
                  {idolName}
                </span>
              </td>
            );
          })}
        </tr>
        <tr>
          {range(unitCount).map(index => {
            const unit = UNIT_LIST2[hand.unitIndexes[index]];
            const unitMemberCount = unit.memberCount;
            const unitClass = hand.unitChiFlg[index]
              ? 'unit-chi'
              : 'unit-plane';
            const unitName = unit.name.substring(0, unitMemberCount * 3);
            const unitDialogImpl = () =>
              unitDialog(unit, hand.unitChiFlg[index]);

            return (
              <td key={index} colSpan={unitMemberCount}>
                <Button
                  text={unitName}
                  buttonClassFlg={false}
                  className={`unit-block ${unitClass}`}
                  onClick={unitDialogImpl}
                />
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default HandTileView;
