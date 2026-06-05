import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollegesCompareData } from '@/services/college.service';

const compareSchema = z.object({
  ids: z
    .string()
    .min(1)
    .transform((value) => value.split(',').map((id) => id.trim()).filter(Boolean))
    .pipe(z.array(z.string().min(1)).min(1).max(2)),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = compareSchema.safeParse({ ids: searchParams.get('ids') ?? '' });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid compare parameters', details: result.error.format() },
        { status: 400 }
      );
    }

    const colleges = await getCollegesCompareData(result.data.ids);
    const byId = Object.fromEntries(colleges.map((college) => [college.id, college]));

    return NextResponse.json({
      data: result.data.ids.map((id) => byId[id] ?? null),
    });
  } catch (error) {
    console.error('GET /api/colleges/compare error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
