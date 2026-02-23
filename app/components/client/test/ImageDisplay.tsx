import React, { useEffect, useRef, useState } from 'react';
import { Image, X } from 'lucide-react';
import './test.css';
import { Loader } from '@mantine/core';

interface ImageDisplayProps {
  title?: string;
  placeholder: string;
  imageUrl?: string           // image to display whenever it is passed.
  loader: boolean             // tells wheter the component must act as an image loader or just displayer
  handleUpload?: (file: string | null) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  title,
  handleUpload,
  placeholder,
  imageUrl,
  loader
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      setLoadedImage(imageUrl)
    }
  }, [imageUrl])

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string; // Now it's a string!
        setLoadedImage(base64String);
        if (handleUpload) {
          handleUpload(base64String)
        }
      };
      reader.readAsDataURL(file);

    }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadedImage(null);
    if (handleUpload) {
      handleUpload(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-wrapper">
      <h3 className="image-title">
        {title ? title : " "}
      </h3>
      {loadedImage || !loader ? (
        <div className="image-container">
          <img
            className='image'
            src={loadedImage ? loadedImage : undefined}
            alt={`Waiting for an image to be displayed`}
          />
          {loader && (
            <button
              onClick={handleDeleteImage}
              className='delete-button'
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
            >
              <X size={20} color="white" />
            </button>)}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="image-container loader">
          <Image size={"calc(2 * var(--icon-size))"} />
          {placeholder}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files?.[0])}
          />
        </div>
      )}
    </div>
  );
};