
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  await _db();
  const { userId: targetUserId } = params;
  
  // This should be the ID of the currently logged-in user.
  // In a real app, you'd get this from a secure session/token.
  // For this example, we'll extract it from the body, assuming it's sent.
  const { currentUserId } = await request.json();

  if (!currentUserId || !targetUserId) {
    return NextResponse.json({ message: "Missing user IDs." }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentUser = await User.findById(currentUserId).session(session);
    const targetUser = await User.findById(targetUserId).session(session);

    if (!currentUser || !targetUser) {
      throw new Error("One or both users not found.");
    }

    // Current user accepts the request from targetUser
    // 1. Remove incoming request from current user
    currentUser.connectionRequests = currentUser.connectionRequests.filter(
      req => req.userId.toString() !== targetUserId
    );
    // 2. Add targetUser to current user's connections
    if (!currentUser.connections.includes(targetUserId)) {
        currentUser.connections.push(targetUserId);
    }

    // Target user's request is accepted
    // 1. Remove outgoing request from target user
    targetUser.connectionRequests = targetUser.connectionRequests.filter(
      req => req.userId.toString() !== currentUserId
    );
    // 2. Add current user to target user's connections
    if (!targetUser.connections.includes(currentUserId)) {
        targetUser.connections.push(currentUserId);
    }

    await currentUser.save({ session });
    await targetUser.save({ session });

    await session.commitTransaction();

    return NextResponse.json({ message: "Connection accepted successfully." }, { status: 200 });

  } catch (error) {
    await session.abortTransaction();
    console.error('API Accept Connection Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
