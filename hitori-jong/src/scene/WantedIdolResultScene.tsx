import React from 'react';
import StateContext from 'context';
import './WantedIdolResultScene.css';
import Button from 'parts/Button';
import { IDOL_LIST } from 'constant/idol';
import { UNIT_LIST2 } from 'service/HandService';
import { range } from 'service/UtilityService';

const WantedIdolResultScene: React.FC = () => {
	const { ronList, chiList, dispatch } = React.useContext(StateContext);

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
			<div className="ron-block">
				<h2>ツモ・ロン牌</h2>
				{
					ronList.map(record => (<div key={record.member} className="table-block">
						<h3>・{IDOL_LIST[record.member].name}</h3>
						<table>
							<thead>
								<tr>
									<th>ユニット</th>
									<th>チー？</th>
									<th>点数</th>
									<th>メンバー</th>
								</tr>
							</thead>
							<tbody>
								{record.unit.map(unit => {
									const unitInfo = UNIT_LIST2[unit.id];
									const score = unit.chiFlg ? unitInfo.scoreWithChi : unitInfo.score;
									const name = unitInfo.name;
									const member = unitInfo.member.map(m => IDOL_LIST[m].name).join('・');
									return (
										<tr key={unit.id}>
											<td>{name}</td>
											<td>{unit.chiFlg ? 'Yes' : ''}</td>
											<td>{score}</td>
											<td>{member}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>))
				}
			</div>
			<div className="table-block">
				<h2>チー牌</h2>
				<table>
					<thead>
						<tr>
							<th>チー牌</th>
							<th>ユニット</th>
							<th>他のメンバー</th>
						</tr>
					</thead>
					<tbody>
						{range(chiList.length).map(recordIndex => {
							const record = chiList[recordIndex];
							const unitInfo = UNIT_LIST2[record.unit];
							const name = unitInfo.name;
							const member = record.otherMember.map(m => IDOL_LIST[m].name).join('・');
							return (
								<tr key={recordIndex}>
									<td>{IDOL_LIST[record.member].name}</td>
									<td>{name}</td>
									<td>{member}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>);
};

export default WantedIdolResultScene;
