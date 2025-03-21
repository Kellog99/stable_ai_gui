"use client";
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';



const IndexHandler = ({ selectedPoints } : {selectedPoints : number[]}) => {
const searchParams = useSearchParams()
const pathname = usePathname();
const { replace } = useRouter();
  // Function to build the query string
  const buildQueryString = () => {
    const indexes = selectedPoints.join(','); // Join selected point indexes with commas
    return indexes ? `?indexes=${indexes}` : '';
  };

  const handleSearch = useDebouncedCallback((selectedPoints: number[]) => {
    const params = new URLSearchParams(searchParams);
    const indexes = selectedPoints.join(',');
    indexes ? params.set('indexes', indexes) : params.delete('indexes');
    replace(`${pathname}?${params.toString()}`);
  }, 0.0000000001);

  // Example of sending the query string when the selected points change
  useEffect(() => {
    handleSearch(selectedPoints)
    // You can make a request here, for example using fetch or axios:
    // fetch(url)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Server response:', data);
    //   });
  }, [selectedPoints]); // Update when selectedPoints change
  
  return (
    <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg z-50">
      <p className="text-sm font-medium">
        {selectedPoints.length} point{selectedPoints.length !== 1 ? 's' : ''} selected
      </p>
      <p className="text-xs opacity-80 mt-1">Click points to select/deselect</p>
      <p className="text-xs opacity-80">Hold Shift + drag to select multiple points</p>
      <p className="text-xs opacity-80">
        Left click + drag to rotate (when not in lasso mode)
      </p>
      <p className="text-xs opacity-80">
        Right click + drag to pan (when not in lasso mode)
      </p>
      <p className="text-xs opacity-80">Scroll to zoom (when not in lasso mode)</p>
    </div>
  );
};

export default IndexHandler;
