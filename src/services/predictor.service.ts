import prisma from '../lib/prisma'

export interface PredictorOptions {
  examName: string;
  category: string;
  rank: number;
}

const collegeSelect = {
  id: true,
  name: true,
  slug: true,
  location: true,
  baseFees: true,
  rating: true,
  placements: true,
  establishedYear: true,
  description: true,
} as const;

export const predictColleges = async ({ examName, category, rank }: PredictorOptions) => {
  const cutoffs = await prisma.cutoff.findMany({
    where: {
      examName,
      category,
      closingRank: { gte: rank * 0.5 },
    },
    select: {
      closingRank: true,
      year: true,
      college: { select: collegeSelect },
    },
    orderBy: {
      closingRank: 'asc',
    },
    take: 20,
  });

  return cutoffs.map((cutoff) => {
    let probability = 'Safe';
    if (rank > cutoff.closingRank * 1.1) {
      probability = 'Ambitious';
    } else if (rank > cutoff.closingRank) {
      probability = 'Reach';
    }

    return {
      college: cutoff.college,
      cutoff: {
        closingRank: cutoff.closingRank,
        year: cutoff.year,
      },
      probability,
    };
  });
};
