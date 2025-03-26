'use client';
import React , {cache, Suspense, useState, useEffect} from "react";
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
    <Suspense>
    <Link
      href={{
        pathname: route,
        query: { name: name},
      }}
    >
      {children}
    </Link>
    </Suspense>
  )
}