
import { NextResponse } from 'next/server';
import _db from '@/lib/db';

export async function GET() {
  try {
    await _db();
    return NextResponse.json({ status: 'success', message: 'Database connected successfully.' });
  } catch (error) {
    console.error('API DB Connection Error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to connect to the database.' }, { status: 500 });
  }
}
