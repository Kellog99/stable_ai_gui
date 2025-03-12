'use client';
import React from "react";

interface ClickableImageProps {
  name: string;
}

export default function ClickableComponent({ 
  name, 
  children
}: React.PropsWithChildren<ClickableImageProps>) {
  
  function clicked(name: string) {
    console.log(`clicked on ${name}!`);
  }
  
  return (
    <div onClick={() => clicked(name)}>
      {children}
    </div>
  );
}