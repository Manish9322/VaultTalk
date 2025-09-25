
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import User from '@/models/user.model.js';
import mongoose from 'mongoose';

// Remove a connection
export async function DELETE(request, { params }) {
    await _db();
    const { userId: targetUserId } = params;
    
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    if (!currentUserId || !targetUserId) {
        return NextResponse.json({ message: "Missing user IDs." }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Remove target from current user's connections
        await User.findByIdAndUpdate(currentUserId, { $pull: { connections: targetUserId } }, { session });
        
        // Remove current user from target's connections
        await User.findByIdAndUpdate(targetUserId, { $pull: { connections: currentUserId } }, { session });
        
        await session.commitTransaction();

        return NextResponse.json({ message: "Connection removed." }, { status: 200 });
    } catch (error) {
        await session.abortTransaction();
        console.error('API Remove Connection Error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
    } finally {
        session.endSession();
    }
}
