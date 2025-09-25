
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';
import mongoose from 'mongoose';

// Send a connection request
export async function POST(request, { params }) {
  await _db();
  const { userId: targetUserId } = params;
  const { currentUserId } = await request.json();

  if (!currentUserId || !targetUserId) {
    return NextResponse.json({ message: "Missing user IDs." }, { status: 400 });
  }
   if (currentUserId === targetUserId) {
    return NextResponse.json({ message: "You cannot send a connection request to yourself." }, { status: 400 });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
        return NextResponse.json({ message: "One or both users not found." }, { status: 404 });
    }
    
    // Add outgoing request to current user if it doesn't exist
    const existingCurrentUserRequest = currentUser.connectionRequests.find(req => req.userId.toString() === targetUserId);
    if (!existingCurrentUserRequest) {
        currentUser.connectionRequests.push({ userId: targetUserId, status: 'pending-outgoing' });
    }
    
    // Add incoming request to target user if it doesn't exist
    const existingTargetUserRequest = targetUser.connectionRequests.find(req => req.userId.toString() === currentUserId);
    if (!existingTargetUserRequest) {
        targetUser.connectionRequests.push({ userId: currentUserId, status: 'pending-incoming' });
    }

    await currentUser.save();
    await targetUser.save();
    
    return NextResponse.json({ message: "Connection request sent." }, { status: 200 });

  } catch (error) {
    console.error('API Send Request Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}


// Withdraw or Decline a connection request
export async function DELETE(request, { params }) {
    await _db();
    const { userId: targetUserId } = params;
    
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');
    const action = searchParams.get('action'); // 'withdraw' or 'decline'

    if (!currentUserId || !targetUserId || !action) {
        return NextResponse.json({ message: "Missing user IDs or action." }, { status: 400 });
    }
    
    try {
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return NextResponse.json({ message: "One or both users not found." }, { status: 404 });
        }

        // Current user withdraws request sent to target user OR declines request from target user
        currentUser.connectionRequests = currentUser.connectionRequests.filter(r => r.userId.toString() !== targetUserId);
        targetUser.connectionRequests = targetUser.connectionRequests.filter(r => r.userId.toString() !== currentUserId);
        
        await currentUser.save();
        await targetUser.save();
        
        return NextResponse.json({ message: `Request ${action} successful.` }, { status: 200 });

    } catch(error) {
        console.error('API Withdraw/Decline Error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
    }
}
