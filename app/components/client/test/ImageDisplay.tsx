import React, { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Loader, Center } from '@mantine/core';
import './ImageDisplay.css';

interface ImageDisplayProps {
  title?: string;
  placeholder: string;
  imageUrl?: string;  //this variable has the base64 encoding of an image
  isLoading?: boolean;
  actionButton?: React.ReactNode;
  handleUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  title,
  placeholder,
  imageUrl,
  actionButton,
  isLoading = false,
  handleUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="image-wrapper">
      <h3 className="image-title">{title ?? " "}</h3>

      {imageUrl ? (
        <div className="image-container">
          <img
            className="image"
            src={imageUrl}
            alt="Displayed content"
          />
          {actionButton}
        </div>
      ) : (
        <div
          className="image-container loader"
          onClick={() => {
            if (!isLoading) {
              fileInputRef.current?.click();
            }
          }}
        >
          {isLoading ? (
            <Center style={{ width: '100%', height: '100%' }}>
              <Loader />
            </Center>
          ) : (
            <>
              <ImageIcon size={"calc(2 * var(--icon-size))"} />
              {placeholder}
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
        </div>
      )}
    </div>
  );
};