import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDatabase();
    const repo = db.getRepository('Calculation');
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
    return NextResponse.json(calculations);
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined) {
      return NextResponse.json({ error: 'Missing expression or result' }, { status: 400 });
    }

    const db = await getDatabase();
    const repo = db.getRepository('Calculation');

    const calculation = repo.create({
      expression: String(expression),
      result: String(result),
      createdAt: new Date(),
    });

    const saved = await repo.save(calculation);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const db = await getDatabase();
    const repo = db.getRepository('Calculation');
    await repo.clear();
    return NextResponse.json({ message: 'History cleared' });
  } catch (error) {
    console.error('DELETE /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
