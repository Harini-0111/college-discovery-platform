import prisma from '../lib/prisma'

export interface PredictorOptions {
  examName: string;
  category: string;
  rank: number;
}

export const predictColleges = async ({ examName, category, rank }: PredictorOptions) => {
  const cutoffs = await prisma.cutoff.findMany({
    where: {
      examName: { equals: examName },
      category: { equals: category },
      closingRank: { gte: rank * 0.5 }, 
    },
    include: {
      college: true
    },
    orderBy: {
      closingRank: 'asc'
    },
    take: 20
  });

  const recommendations = cutoffs.map(cutoff => {
    let probability = "Safe";
    if (rank > cutoff.closingRank * 1.1) {
      probability = "Ambitious";
    } else if (rank > cutoff.closingRank) {
      probability = "Reach";
    }

    return {
      college: cutoff.college,
      cutoff: {
        closingRank: cutoff.closingRank,
        year: cutoff.year
      },
      probability
    };
  });

  return recommendations;
};
