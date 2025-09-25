
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await _db();

  try {
    const { name, email, password, phone, avatar } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      avatar,
      avatarType: avatar ? 'custom' : 'placeholder',
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      message: 'User registered successfully!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('API Registration Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}
