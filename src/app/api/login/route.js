import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await _db();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }
    
    // Don't send the password back to the client
    const userObject = user.toObject();
    delete userObject.password;


    return NextResponse.json({
      message: 'Login successful!',
      user: userObject,
    }, { status: 200 });

  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}
