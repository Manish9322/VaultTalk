
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  await _db();
  const { userId: targetUserId } = params;
  const { currentUserId } = await request.json();

  if (!currentUserId || !targetUserId) {
    return NextResponse.json({ message: "Missing user IDs." }, { status: 400 });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
        return NextResponse.json({ message: "One or both users not found." }, { status: 404 });
    }

    // Current user accepts the request from targetUser
    // 1. Remove incoming request from current user's request list
    currentUser.connectionRequests = currentUser.connectionRequests.filter(
      req => req.userId.toString() !== targetUserId
    );
    // 2. Add targetUser to current user's connections list
    if (!currentUser.connections.includes(targetUserId)) {
        currentUser.connections.push(targetUserId);
    }

    // Target user's request is accepted
    // 1. Remove outgoing request from target user's request list
    targetUser.connectionRequests = targetUser.connectionRequests.filter(
      req => req.userId.toString() !== currentUserId
    );
    // 2. Add current user to target user's connections list
    if (!targetUser.connections.includes(currentUserId)) {
        targetUser.connections.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({ message: "Connection accepted successfully." }, { status: 200 });

  } catch (error) {
    console.error('API Accept Connection Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}
