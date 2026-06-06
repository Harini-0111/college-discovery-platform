export const DEFAULT_CAMPUS_IMAGE = '/images/default-campus.jpg';
export const HERO_CAMPUS_IMAGE = '/images/default-campus.jpg';

const IIT_IMAGES = [
  '/images/iit_delhi.jpeg',
  '/images/iit-bombay.jpg',
  '/images/iit-madras.jpg',
] as const;

const IIIT_IMAGE = '/images/iiit-hyderabad.webp';
const NIT_IMAGE = '/images/nit-trichy.JPG';
const BITS_IMAGE = '/images/bits-pilani.jpg';
const PRIVATE_CAMPUS_IMAGE = '/images/iit_delhi.jpeg';
const STATE_CAMPUS_IMAGE = '/images/iit-bombay.jpg';

export type CollegeImageCategory =
  | 'iit'
  | 'iiit'
  | 'nit'
  | 'bits'
  | 'private'
  | 'state'
  | 'default';

function normalize(text: string): string {
  return text.toLowerCase().replace(/[_-]/g, ' ');
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getCollegeImageCategory(slug: string, name?: string): CollegeImageCategory {
  const searchable = normalize(name ?? slug);

  if (searchable.includes('bits')) return 'bits';
  if (searchable.includes('iiit')) return 'iiit';
  if (/\biit\b/.test(searchable) || searchable.startsWith('iit ')) return 'iit';
  if (searchable.includes('nit')) return 'nit';
  if (searchable.includes('private engineering college')) return 'private';
  if (searchable.includes('state university')) return 'state';

  return 'default';
}

export function getCollegeImageUrl(slug: string, name?: string): string {
  const category = getCollegeImageCategory(slug, name);

  switch (category) {
    case 'iit':
      return IIT_IMAGES[hashString(slug) % IIT_IMAGES.length];
    case 'iiit':
      return IIIT_IMAGE;
    case 'nit':
      return NIT_IMAGE;
    case 'bits':
      return BITS_IMAGE;
    case 'private':
      return PRIVATE_CAMPUS_IMAGE;
    case 'state':
      return STATE_CAMPUS_IMAGE;
    default:
      return DEFAULT_CAMPUS_IMAGE;
  }
}
