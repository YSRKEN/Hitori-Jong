import React from 'react';

const Button: React.FC<{
  text: string;
  buttonClassFlg?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ text, buttonClassFlg = true, className, onClick }) => (
  <span
    className={className + (buttonClassFlg ? ' button' : '')}
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyUp={onClick}
  >
    {text}
  </span>
);

export default Button;
