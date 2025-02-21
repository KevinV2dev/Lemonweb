'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchComponent() {
  const searchParams = useSearchParams();
  return (
    <></>
  );
}

export function SearchComponentWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchComponent />
    </Suspense>
  );
} 