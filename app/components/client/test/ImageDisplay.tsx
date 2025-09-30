import React from 'react';
import { Download, Image } from 'lucide-react';
import './test.css'
interface ImageDisplayProps {
  title: string;
  imageUrl?: string;
  onDownload?: () => void;
  placeholder?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  title,
  imageUrl,
  onDownload,
  placeholder = "No image loaded"
}) => {

  return (
    <div className="image-wrapper">
      <h3 className="image-title">Display {title}</h3>
      <div className="image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Loaded image`}
            className="image-img"
          />
        ) : (
          <div className="image-placeholder">
            <Image className="image-icon" />
            <p className="image-text">{placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
};