import React, { useRef, useState } from 'react';
import { Image, X } from 'lucide-react';

interface ImageDisplayProps {
  title?: string;
  placeholder: string;
  footer?: string;
  imageUrl?: string;
  onDownload?: () => void;
  loader: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  title,
  footer,
  imageUrl,
  onDownload,
  placeholder,
  loader = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);

  const handleImageContainerClick = () => {
    if (loader && fileInputRef.current && !loadedImage) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLoadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = loadedImage || imageUrl;

  return (
    <div className="image-wrapper">
      {title && (<h3 className="image-title">{title}</h3>)}
      <div
        className="image"
        onClick={handleImageContainerClick}
        style={{ cursor: loader && !loadedImage ? 'pointer' : 'default', position: 'relative' }}
      >
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={`Loaded image`}
              className="image-img"
            />
            {loadedImage && (
              <button
                onClick={handleDeleteImage}
                className='delete-button'
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
              >
                <X size={20} color="white" />
              </button>
            )}
          </>
        ) : (
          <div className="image-placeholder">
            <Image className="image-icon" />
            <p className="image-text">{placeholder}</p>
          </div>
        )}
        {loader && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        )}
      </div>
      {
        footer && (<p style={{ color: 'grey' }}>{footer}</p>)
      }
    </div>
  );
};