import prisma from '../lib/prisma'

export interface GetCollegesOptions {
  page?: number;
  limit?: number;
}

export const getColleges = async ({ page = 1, limit = 12 }: GetCollegesOptions) => {
  const skip = (page - 1) * limit;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      skip,
      take: limit,
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        baseFees: true,
        rating: true,
        placements: true,
      }
    }),
    prisma.college.count(),
  ]);

  return {
    data: colleges,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getFeaturedColleges = async (limit = 3) => {
  return prisma.college.findMany({
    take: limit,
    orderBy: { rating: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
      baseFees: true,
      rating: true,
      placements: true,
    },
  });
};

export const getPopularColleges = async (limit = 3) => {
  return prisma.college.findMany({
    take: limit,
    skip: 3,
    orderBy: { rating: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
      baseFees: true,
      rating: true,
      placements: true,
    },
  });
};

export const getCollegeById = async (id: string) => {
  return prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      cutoffs: true,
    },
  });
};
