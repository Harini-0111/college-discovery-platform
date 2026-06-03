import { NextResponse } from 'next/server';
import { z } from 'zod';
import { predictColleges } from '@/services/predictor.service';

const predictorSchema = z.object({
  examName: z.string().min(1),
  category: z.string().min(1),
  rank: z.coerce.number().int().min(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = predictorSchema.safeParse(query);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid parameters", details: result.error.format() }, { status: 400 });
    }

    const recommendations = await predictColleges(result.data);
    return NextResponse.json({ data: recommendations });
  } catch (error) {
    console.error("Predictor API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
