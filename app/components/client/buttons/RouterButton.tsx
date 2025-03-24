'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'

interface ClickableImageProps {
  name: string;
  route: string;
}

export default function RouterButton({ 
  name,
  route,
  children
}: React.PropsWithChildren<ClickableImageProps>) {
  
  
  return (
    <Link
      href={{
        pathname: route,
        query: { name: name},
      }}
    >
      {children}
    </Link>
  )
}