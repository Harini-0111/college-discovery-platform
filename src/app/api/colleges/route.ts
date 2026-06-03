import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getColleges } from '@/services/college.service';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = querySchema.safeParse(query);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid pagination parameters", details: result.error.format() }, { status: 400 });
    }

    const { page, limit } = result.data;
    const response = await getColleges({ page, limit });

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
