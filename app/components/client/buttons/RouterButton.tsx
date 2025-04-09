'use client';
import React , {cache, Suspense, useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'

interface ClickableImageProps {
  name: string |null;
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
          query: { datasetName: name },
        }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
      {children}
    </Link>
    </Suspense>
  )
}