'use client';
import React from "react";
import { useRouter } from "next/navigation";

interface ClickableImageProps {
  name: string;
  route: string;
}

export default function RouterButton({ 
  name,
  route,
  children
}: React.PropsWithChildren<ClickableImageProps>) {
  
  const router = useRouter();

  function clicked(name: string, route: string) {
    router.push(`${route}?name=${name.toString()}`);
  }
  
  return (
    <div onClick={() => clicked(name, route)}>
      {children}
    </div>
  );
}