import React from 'react';
import { FaEdit } from 'react-icons/fa'; // Import edit icon from react-icons
import './image-editor.scss';

interface ImageEditorProps {
  onChange: (image: File) => void;
  value?: File;
  className?: string;
  style?: React.CSSProperties;
}
const ImageEditor: React.FC<ImageEditorProps> = ({ onChange, value, className, style }: ImageEditorProps) => {
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
    <div className={`h-100 ${className}`} style={{ ...style, position: 'relative' }}>
      {value ? (
        <img
          className="image-editor-image"
          src={URL.createObjectURL(value)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div className="image-editor-image" onClick={handleButtonClick}>
          Click here to add image
        </div>
      )}
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
          <button type="button" onClick={handleButtonClick} style={{ all: 'unset' }}>
            <FaEdit style={{ height: '25px', width: '25px' }} />
          </button>
        </label>
      </div>
    </div>
  );
};

export default ImageEditor;
