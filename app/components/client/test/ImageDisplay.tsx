import React, { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Loader } from '@mantine/core';
import './ImageDisplay.css';

interface ImageDisplayProps {
  title?: string;
  placeholder: string;
  /** Accepts a URL or a base64-encoded data URI */
  imageSrc?: string;
  isLoading?: boolean;
  actionButton?: React.ReactNode;
  /** If omitted, the upload area is rendered as non-interactive */
  handleUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  title,
  placeholder,
  imageSrc,
  actionButton,
  isLoading = false,
  handleUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploadable = !!handleUpload && !isLoading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isUploadable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-wrapper">
      {title && (
        <h3 className="image-title">{title}</h3>
      )}

      {imageSrc ? (
        <div className="image-container">
          <img
            className="image"
            src={imageSrc}
          />
          {actionButton}
        </div>
      ) : (
        <div
          className={`image-container upload-area${isUploadable ? ' upload-area--interactive' : ''}`}
          role={isUploadable ? 'button' : undefined}
          tabIndex={isUploadable ? 0 : undefined}
          aria-label={isUploadable ? placeholder : undefined}
          aria-busy={isLoading}
          onClick={() => {
            if (isUploadable) fileInputRef.current?.click();
          }}
          onKeyDown={handleKeyDown}
        >
          {isLoading ? (
            <Loader aria-label="Loading" />
          ) : (
            <>
              <ImageIcon size="calc(2 * var(--icon-size))" aria-hidden="true" />
              <p className="image-placeholder">{placeholder}</p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            aria-hidden="true"
            tabIndex={-1}
            onChange={handleUpload}
          />
        </div>
      )}
    </div>
  );
};