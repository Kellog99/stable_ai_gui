import React from 'react';
import { Download } from 'lucide-react';

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
  placeholder = "No image available"
}) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
      <div className="p-3 border-b border-gray-600 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        {imageUrl && onDownload && (
          <button
            onClick={onDownload}
            className="text-gray-400 hover:text-white transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="aspect-square bg-gray-900 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-gray-500 text-sm">{placeholder}</span>
        )}
      </div>
    </div>
  );
};