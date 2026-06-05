export const DEFAULT_CAMPUS_IMAGE = '/images/default-campus.jpg';
export const HERO_CAMPUS_IMAGE = '/images/default-campus.jpg';

type ImageRule = {
  keywords: string[];
  image: string;
};

const IMAGE_RULES: ImageRule[] = [
  { keywords: ['iit', 'delhi'], image: '/images/iit_delhi.jpeg' },
  { keywords: ['iit', 'mumbai'], image: '/images/iit-bombay.jpg' },
  { keywords: ['iit', 'bombay'], image: '/images/iit-bombay.jpg' },
  { keywords: ['iit', 'chennai'], image: '/images/iit-madras.jpg' },
  { keywords: ['iit', 'madras'], image: '/images/iit-madras.jpg' },
  { keywords: ['iiit', 'hyderabad'], image: '/images/iiit-hyderabad.webp' },
  { keywords: ['nit', 'trichy'], image: '/images/nit-trichy.JPG' },
  { keywords: ['bits', 'pilani'], image: '/images/bits-pilani.jpg' },
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[_-]/g, ' ');
}

export function getCollegeImageUrl(slug: string, name?: string): string {
  const searchable = normalize(`${name ?? ''} ${slug}`);

  for (const rule of IMAGE_RULES) {
    if (rule.keywords.every((keyword) => searchable.includes(keyword))) {
      return rule.image;
    }
  }

  return DEFAULT_CAMPUS_IMAGE;
}
