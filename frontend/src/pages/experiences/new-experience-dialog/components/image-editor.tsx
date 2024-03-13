import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa'; // Import edit icon from react-icons
import './image-editor.scss';

interface ImageEditorProps {
  onChange: (image: File) => void;
  value?: File;
  className?: string;
}
const ImageEditor: React.FC<ImageEditorProps> = ({ onChange, value, className }: ImageEditorProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onChange(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`h-100 ${className}`} style={{ position: 'relative' }}>
      <img
        className="image-editor-image"
        src={
          value
            ? URL.createObjectURL(value)
            : 'https://media.cnn.com/api/v1/images/stellar/prod/230810151827-01-fun-habit-wellness-stock.jpg?c=16x9&q=w_800,c_fill'
        }
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="image-edit-icon">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-input"
        />
        <label htmlFor="image-input">
          <button type="button" onClick={handleButtonClick}>
            <FaEdit style={{ height: '25px', width: '25px' }} />
          </button>
        </label>
      </div>
    </div>
  );
};

export default ImageEditor;
