import React, { ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './auth-form-input.scss';

interface BaseAuthFormTextInputProps {
  title: string;
  name: string;
  type: 'text' | 'password' | 'date';
}

interface DateValueProps {
  type: 'date';
  value: Date;
  onChange: (date: Date) => void;
}

interface StringValueProps {
  type: 'text' | 'password';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
type AuthFormTextInputProps = BaseAuthFormTextInputProps & (DateValueProps | StringValueProps);

const AuthFormInput: React.FC<AuthFormTextInputProps> = ({
  title,
  onChange,
  type,
  name,
  value,
}: AuthFormTextInputProps) => {
  return (
    <div>
      <label htmlFor={name} className="form-label fw-bold">
        {title}
      </label>
      {type === 'date' ? (
        <div>
          <DatePicker
            selected={value}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          className="form-control form-control-lg auth-form-input"
          value={value ?? ''}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default AuthFormInput;
