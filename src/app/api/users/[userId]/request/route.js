
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentUser = await User.findById(currentUserId).session(session);
    const targetUser = await User.findById(targetUserId).session(session);

    if (!currentUser || !targetUser) {
      throw new Error("One or both users not found.");
    }
    
    // Add outgoing request to current user
    const existingCurrentUserRequest = currentUser.connectionRequests.find(req => req.userId.toString() === targetUserId);
    if (!existingCurrentUserRequest) {
        currentUser.connectionRequests.push({ userId: targetUserId, status: 'pending-outgoing' });
    }
    
    // Add incoming request to target user
    const existingTargetUserRequest = targetUser.connectionRequests.find(req => req.userId.toString() === currentUserId);
    if (!existingTargetUserRequest) {
        targetUser.connectionRequests.push({ userId: currentUserId, status: 'pending-incoming' });
    }

    await currentUser.save({ session });
    await targetUser.save({ session });

    await session.commitTransaction();
    
    return NextResponse.json({ message: "Connection request sent." }, { status: 200 });

  } catch (error) {
    await session.abortTransaction();
    console.error('API Send Request Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  } finally {
    session.endSession();
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

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const currentUser = await User.findById(currentUserId).session(session);
        const targetUser = await User.findById(targetUserId).session(session);

        if (!currentUser || !targetUser) {
            throw new Error("One or both users not found.");
        }

        if (action === 'withdraw') {
            // Current user withdraws request sent to target user
            currentUser.connectionRequests = currentUser.connectionRequests.filter(r => r.userId.toString() !== targetUserId);
            targetUser.connectionRequests = targetUser.connectionRequests.filter(r => r.userId.toString() !== currentUserId);
        } else if (action === 'decline') {
            // Current user declines request from target user
            const targetUserRequestIndex = currentUser.connectionRequests.findIndex(r => r.userId.toString() === targetUserId);
            if (targetUserRequestIndex > -1) {
                // Change status to 'declined' for the current user
                currentUser.connectionRequests[targetUserRequestIndex].status = 'declined';
            }
            // Remove the outgoing request from the other user
            targetUser.connectionRequests = targetUser.connectionRequests.filter(r => r.userId.toString() !== currentUserId);
        }

        await currentUser.save({ session });
        await targetUser.save({ session });

        await session.commitTransaction();
        
        return NextResponse.json({ message: `Request ${action} successful.` }, { status: 200 });

    } catch(error) {
        await session.abortTransaction();
        console.error('API Withdraw/Decline Error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
    } finally {
        session.endSession();
    }
}
