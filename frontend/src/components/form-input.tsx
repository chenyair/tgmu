import React, { ChangeEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IUserFormInputProps } from '@/pages/profile';
import * as Avatar from '@radix-ui/react-avatar';
import './form-input.scss';
import { isEmpty } from 'validator';

interface BaseFormTextInputProps {
  title: string;
  name: string;
  type: 'text' | 'password' | 'date' | 'image';
  validate?: (value: string) => boolean;
  description?: string;
  inline?: boolean;
  disabled?: boolean;
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

interface ImageValueProps {
  type: 'image';
  value: IUserFormInputProps['image'];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

type FormTextInputProps = BaseFormTextInputProps & (DateValueProps | StringValueProps | ImageValueProps);

const FormInput: React.FC<FormTextInputProps> = ({
  title,
  onChange,
  type,
  name,
  value,
  description,
  validate: validateFunc,
  inline = false,
  disabled = false,
}: FormTextInputProps) => {
  const [valid, setValid] = useState(true);

  const validate = (inputValue: string) => {
    const empty = isEmpty(inputValue);
    const validateFuncRes = validateFunc ? validateFunc(inputValue) : true;
    setValid(!empty && validateFuncRes);
  };

  return (
    <div className={inline ? 'd-flex flex-row justify-content-between' : ''} style={inline ? { maxHeight: '2em' } : {}}>
      <label htmlFor={name} className="form-label fw-bold tgmu-form-label">
        {title}
        <div>{description && <small className="tgmu-form-text">{description}</small>}</div>
      </label>
      {type === 'date' ? (
        <div className={inline ? 'w-100' : ''}>
          <DatePicker
            selected={value}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            disabled={disabled}
            readOnly={disabled}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      ) : type === 'image' ? (
        <div className="w-100 d-flex align-items-center">
          <Avatar.Root className="AvatarRoot flex-row justify-content-center">
            <Avatar.Image
              className="AvatarImage"
              src={
                value.file
                  ? URL.createObjectURL(value.file)
                  : value.currImgUrl ||
                    'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'
              }
            />
          </Avatar.Root>
          <input
            accept=".png,.jpg,.jpeg,.webp"
            className="form-control flex-row w-50"
            style={{ marginLeft: '8%' }}
            type="file"
            id="formFile"
            onChange={onChange}
          ></input>
        </div>
      ) : (
        // Text input
        <input
          type={type}
          onBlur={(e) => validate(e.target.value)}
          id={title}
          name={name}
          className={`${!valid ? 'is-invalid' : ''} form-control form-control-md form-input tgmu-form-input`}
          disabled={disabled}
          value={value ?? ''}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default FormInput;
