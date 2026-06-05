'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getCollegeImageUrl, DEFAULT_CAMPUS_IMAGE } from '@/lib/college-images';

interface CollegeImageProps {
  slug: string;
  name?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function CollegeImage({
  slug,
  name,
  alt,
  className = 'object-cover',
  priority,
  sizes,
}: CollegeImageProps) {
  const [src, setSrc] = useState(getCollegeImageUrl(slug, name));

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      className={className}
      priority={priority}
      onError={() => setSrc(DEFAULT_CAMPUS_IMAGE)}
    />
  );
}
