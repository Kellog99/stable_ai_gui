'use client';
import React, { Suspense } from "react";
import Link from 'next/link'

interface ClickableImageProps {
  name: string | undefined | null;
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