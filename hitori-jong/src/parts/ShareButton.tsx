import React from 'react';
import { TwitterShareButton, TwitterIcon } from 'react-share';

// シェアボタン
const ShareButton: React.FC = () => (
	<TwitterShareButton
		url="https://hitori-jong.firebaseapp.com"
		title="一人用ミリジャン「ヒトリジャン」。スマホ対応。"
		hashtags={['ミリジャン', 'ヒトリジャン']}
	>
		<TwitterIcon size={32} round />
	</TwitterShareButton>
);

export default ShareButton;
