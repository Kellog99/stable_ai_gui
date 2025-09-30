import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File, imageUrl: string) => void;
  uploadedImage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  uploadedImage
}) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUpload(file, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUpload(file, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Target Image
      </label>
      {uploadedImage ? (
        <div className="relative">
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="w-full h-48 object-cover rounded-lg border border-gray-600"
          />
          <div className="absolute top-2 right-2">
            <label className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        >
          <label className="cursor-pointer">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 mb-2">Drop an image here or click to upload</p>
            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};