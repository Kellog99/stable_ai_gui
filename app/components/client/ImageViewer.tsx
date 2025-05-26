'use client';

import React from 'react';

type ImageViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  pointIndex: number;
};

export default function ImageViewer({ isOpen, onClose, pointIndex }: ImageViewerProps) {
  if (!isOpen) return null;

  // For demo purposes, using a placeholder image
  const imageSrc = `/api/placeholder/400/300`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Point {pointIndex} Image</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="flex justify-center">
          <img 
            src={imageSrc} 
            alt={`Image for point ${pointIndex}`}
            className="max-h-96 object-contain"
          />
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Image details for data point {pointIndex}
        </div>
      </div>
    </div>
  );
}