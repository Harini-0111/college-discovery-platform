const CAMPUS_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf5d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571260899304-425eee4c76ef?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d57125f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23f66?w=800&auto=format&fit=crop&q=80',
];

export const DEFAULT_CAMPUS_IMAGE =
  'https://images.unsplash.com/photo-1541339907198-e08756dedf5d?w=800&auto=format&fit=crop&q=80';

export const HERO_CAMPUS_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&auto=format&fit=crop&q=80';

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCollegeImageUrl(slug: string): string {
  const index = hashSlug(slug) % CAMPUS_IMAGES.length;
  return CAMPUS_IMAGES[index];
}
