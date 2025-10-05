"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import VideoCall with no SSR
const VideoCall = dynamic(() => import('./VideoCall'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading video call...</p>
      </div>
    </div>
  ),
});

export default function VideoCallWrapper({ roomID, userID, userName, onLeave }) {
  return (
    <VideoCall
      roomID={roomID}
      userID={userID}
      userName={userName}
      onLeave={onLeave}
    />
  );
}