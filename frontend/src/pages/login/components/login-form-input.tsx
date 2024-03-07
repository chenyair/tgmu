import React, { ChangeEventHandler } from 'react';

interface LoginFormTextInputProps {
  title: string;
  type: 'text' | 'password';
  onChange?: ChangeEventHandler;
}

const LoginFormInput: React.FC<LoginFormTextInputProps> = ({ title, onChange, type }: LoginFormTextInputProps) => {
  return (
    <div>
      <label htmlFor="inputEmail" className="form-label fw-bold">
        {title}
      </label>
      <input type={type} id="inputEmail" className="form-control form-control-lg" onChange={onChange} />
    </div>
  );
};

export default LoginFormInput;
