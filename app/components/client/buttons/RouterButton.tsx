'use client';
import React, { Suspense } from "react";
import Link from 'next/link'
import useStore from "@/store/dsStore";

interface ClickableImageProps {
  route: string;
}

export default function RouterButton({
  route,
  children
}: React.PropsWithChildren<ClickableImageProps>) {
  const name = useStore((state) => state.datasetUsed)?.name
  return (
    <Suspense>
      <Link
        href={{
          pathname: route,
          
        }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {children}
      </Link>
    </Suspense>
  )
}