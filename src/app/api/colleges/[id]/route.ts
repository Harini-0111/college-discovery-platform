import { NextResponse } from 'next/server';
import { getCollegeById } from '@/services/college.service';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const college = await getCollegeById(id);

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ data: college });
  } catch (error) {
    console.error(`GET /api/colleges/[id] error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
