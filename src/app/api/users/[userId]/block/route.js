
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';
import mongoose from 'mongoose';

// Block a user
export async function POST(request, { params }) {
  await _db();
  const { userId: targetUserId } = params;
  const { currentUserId } = await request.json();

  if (!currentUserId || !targetUserId) {
    return NextResponse.json({ message: "Missing user IDs." }, { status: 400 });
  }

  try {
    // Add targetUserId to the current user's blocked list
    await User.findByIdAndUpdate(currentUserId, { 
        $addToSet: { blocked: targetUserId },
        // Also remove from connections if they are there
        $pull: { connections: targetUserId }
    });

    // Also remove the current user from the target user's connections
    await User.findByIdAndUpdate(targetUserId, {
        $pull: { connections: currentUserId }
    });

    return NextResponse.json({ message: "User blocked successfully." }, { status: 200 });
  } catch (error) {
    console.error('API Block User Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}

// Unblock a user
export async function DELETE(request, { params }) {
    await _db();
    const { userId: targetUserId } = params;
    
    // In a real app, you would get this from a secure session/token.
    // For now, we'll get it from query params for simplicity in a DELETE request.
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');
  
    if (!currentUserId || !targetUserId) {
      return NextResponse.json({ message: "Missing user IDs." }, { status: 400 });
    }
  
    try {
      // Remove targetUserId from the current user's blocked list
      await User.findByIdAndUpdate(currentUserId, { 
          $pull: { blocked: targetUserId } 
      });
  
      return NextResponse.json({ message: "User unblocked successfully." }, { status: 200 });
    } catch (error) {
      console.error('API Unblock User Error:', error);
      return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
    }
}
