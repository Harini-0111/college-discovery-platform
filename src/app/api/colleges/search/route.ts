import { NextResponse } from 'next/server';
import { z } from 'zod';
import { searchColleges } from '@/services/search.service';

const searchSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  minFee: z.coerce.number().min(0).optional(),
  maxFee: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
}).refine(data => {
  if (data.minFee !== undefined && data.maxFee !== undefined) {
    return data.minFee <= data.maxFee;
  }
  return true;
}, {
  message: "minFee cannot be greater than maxFee",
  path: ["minFee"]
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = searchSchema.safeParse(query);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid search parameters", details: result.error.format() }, { status: 400 });
    }

    const response = await searchColleges(result.data);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/colleges/search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
