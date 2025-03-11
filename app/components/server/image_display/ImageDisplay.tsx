// ServerComponent.js
// This component fetches the image and pre-renders it server-side
import React from 'react';
import {Image} from '@mantine/core';
//import Image, {ImageNext} from 'next/image';

// Mark this as a Server Component
export default async function ServerComponent({ endPointApi }) {
  // Validate the image URL
  if (!endPointApi) {
    return <div>No image URL provided</div>;
  }

  // You could fetch additional metadata about the image if needed
  // For example, getting image dimensions before rendering
  try {

    const metadataResponse = await fetch(endPointApi, { next: { revalidate: 60 } });
    
    if (!metadataResponse.ok) {
      throw new Error(`API request failed with status ${metadataResponse.status}`);
    }
    
    const imageInfo = await metadataResponse.json();
    // Return the pre-rendered HTML with the image
    // Using Next.js Image component for optimization
    return (
      <div className="server-rendered-container">
        <Image
          src={imageInfo.imagePath}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to pre-render image:", error);
    return <div>Failed to load image</div>;
  }
}