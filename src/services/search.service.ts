import prisma from '../lib/prisma'
import { Prisma } from '@prisma/client'

export interface SearchCollegesOptions {
  q?: string;
  location?: string;
  minFee?: number;
  maxFee?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export const searchColleges = async (options: SearchCollegesOptions) => {
  const { q, location, minFee, maxFee, minRating, page = 1, limit = 12 } = options;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.CollegeWhereInput = {};

  if (q) {
    whereClause.name = { contains: q, mode: 'insensitive' };
  }

  if (location) {
    whereClause.location = { contains: location, mode: 'insensitive' };
  }

  if (minFee !== undefined || maxFee !== undefined) {
    whereClause.baseFees = {};
    if (minFee !== undefined) whereClause.baseFees.gte = minFee;
    if (maxFee !== undefined) whereClause.baseFees.lte = maxFee;
  }

  if (minRating !== undefined) {
    whereClause.rating = { gte: minRating };
  }

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where: whereClause,
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
    prisma.college.count({ where: whereClause }),
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
