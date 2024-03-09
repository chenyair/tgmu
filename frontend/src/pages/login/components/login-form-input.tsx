import React, { ChangeEvent } from 'react';

interface LoginFormTextInputProps {
  title: string;
  name: string;
  value?: string;
  type: 'text' | 'password';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LoginFormInput: React.FC<LoginFormTextInputProps> = ({
  title,
  onChange,
  type,
  name,
  value,
}: LoginFormTextInputProps) => {
  return (
    <div>
      <label htmlFor={name} className="form-label fw-bold">
        {title}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-control form-control-lg"
        value={value ?? ''}
        onChange={onChange}
      />
    </div>
  );
};

export default LoginFormInput;
