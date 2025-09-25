import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';

export async function GET() {
  await _db();

  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error('API Get Users Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}
