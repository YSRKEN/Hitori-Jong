import React from 'react';
import StateContext from 'context';
import './UnitResultScene.css';
import Button from 'parts/Button';
import { IDOL_LIST } from 'constant/idol';
import { UNIT_LIST2 } from 'constant2/unit';

const UnitResultScene: React.FC = () => {
  const { unitCandidateData, dispatch } = React.useContext(StateContext);

  const onClickToS = () => dispatch({ type: 'changeSceneToS', message: '' });

  return (
    <>
      <div className="header-button-group">
        <Button
          className="back-to-simulation"
          text="シミュレーション画面に戻る"
          onClick={onClickToS}
        />
      </div>
      <div className="table-block">
        <h2>完成している役</h2>
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>メンバー</th>
            </tr>
          </thead>
          <tbody>
            {unitCandidateData[0].map(unit => {
              return (
                <tr key={unit.id}>
                  <td>{UNIT_LIST2[unit.id].name}</td>
                  <td>
                    {UNIT_LIST2[unit.id].member
                      .map(m => IDOL_LIST[m].name)
                      .join('・')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-block">
        <h2>後1枚で揃う役</h2>
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th colSpan={2}>メンバー(必要分・その他)</th>
            </tr>
          </thead>
          <tbody>
            {unitCandidateData[1].map(unit => {
              const unitInfo = UNIT_LIST2[unit.id];
              const wantedMember = unit.member;
              const otherMember = unitInfo.member.filter(
                i => !unit.member.includes(i),
              );

              return (
                <tr key={unit.id}>
                  <td>{unitInfo.name}</td>
                  <td>{wantedMember.map(m => IDOL_LIST[m].name).join('・')}</td>
                  <td>{otherMember.map(m => IDOL_LIST[m].name).join('・')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-block">
        <h2>後2枚で揃う役</h2>
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th colSpan={2}>メンバー(必要分・その他)</th>
            </tr>
          </thead>
          <tbody>
            {unitCandidateData[2].map(unit => {
              const unitInfo = UNIT_LIST2[unit.id];
              const wantedMember = unit.member;
              const otherMember = unitInfo.member.filter(
                i => !unit.member.includes(i),
              );

              return (
                <tr key={unit.id}>
                  <td>{unitInfo.name}</td>
                  <td>{wantedMember.map(m => IDOL_LIST[m].name).join('・')}</td>
                  <td>{otherMember.map(m => IDOL_LIST[m].name).join('・')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UnitResultScene;
