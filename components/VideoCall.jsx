"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
// Removed import { useRouter } from "next/navigation"; to fix the build error.

/**
 * Renders a full-screen ZegoCloud video conference component.
 * It immediately joins the room upon mounting.
 *
 * @param {string} roomID - The ID of the meeting room.
 * @param {string} userID - The ID of the current user.
 * @param {string} userName - The name of the current user.
 * @param {function} [onLeave] - MANDATORY callback executed when the user leaves the room via the UI or the custom Back/Exit button.
 * The parent component must handle the navigation logic (e.g., router.back()).
 */
export default function VideoCall({ roomID, userID, userName, onLeave }) {
  const meetingRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState("Connecting...");

  // NOTE: In a real Next.js environment, the environment variables should be set.
  // We use placeholder values here for demonstration purposes as we cannot access
  // the runtime process.env.
  const ZEGOCLOUD_APP_ID = process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID; // Replace with process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID
  const ZEGOCLOUD_SERVER_SECRET =  process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET; // Replace with process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET

  // Use useCallback to memoize the leave handler
  const handleLeaveRoom = useCallback(() => {
    if (onLeave && typeof onLeave === 'function') {
      // Execute the parent's custom leave logic (which should contain navigation)
      onLeave();
    } else {
      // Fallback message if the required onLeave handler is missing
      console.warn("VideoCall component requires an 'onLeave' prop for proper navigation.");
      setDebugInfo("❌ Left meeting, but no 'onLeave' handler was provided for navigation.");
    }
  }, [onLeave]);


  useEffect(() => {
    let zp; // Declare zp outside to access it in cleanup

    const init = async () => {
      // Capture the current ref value locally to avoid race conditions during the async import
      const container = meetingRef.current;
      
      try {
        if (!roomID || !userID || !userName) {
          throw new Error("Missing required props (roomID, userID, userName)");
        }
        
        // --- Credential check (adjust based on your actual environment) ---
        const appID = Number(ZEGOCLOUD_APP_ID);
        const serverSecret = ZEGOCLOUD_SERVER_SECRET;

        if (!appID || !serverSecret || appID === 0) {
           console.warn("ZegoCloud credentials are placeholders. Video call will not connect.");
           setDebugInfo("⚠️ Credentials missing or invalid. Check your environment setup.");
           return;
        }
        // -----------------------------------------------------------------

        // Dynamically import ZegoCloud SDK
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

        // Generate kit token for authentication
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          userName
        );

        // Use the captured local variable for the container check
        if (!container) {
            setDebugInfo("❌ Meeting container not ready or unmounted during setup.");
            return;
        }

        zp = ZegoUIKitPrebuilt.create(kitToken);

        // Directly join the room without showing a preliminary "Join" UI
        zp.joinRoom({
          container: container, // Use local 'container' variable here
          scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
          showScreenSharingButton: true,
          showRoomTimer: true,
          
          // Use the memoized leave handler
          onLeaveRoom: handleLeaveRoom,
        });

        setDebugInfo("✅ Connected!");
      } catch (err) {
        console.error("ZegoCloud Initialization Error:", err);
        setDebugInfo("❌ Initialization failed: " + err.message);
      }
    };

    init();
    
    // Cleanup function to attempt to destroy the Zego UIkit instance on unmount
    return () => {
        if (zp && zp.destroy) {
            zp.destroy();
        }
    };

  // Include all dependencies used inside useEffect
  }, [roomID, userID, userName, handleLeaveRoom]); // handleLeaveRoom is now a dependency

  return (
    <div className="mt-10 w-full h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-black flex flex-col items-center justify-center">
      {/* Overlay container for controls */}
      <div className="fixed top-18 left-0 right-0 z-50 flex justify-between items-center p-4">
          {/* Debug/connection status */}
          <p className="p-2 rounded-lg text-sm bg-white text-yellow-400 shadow-xl">
            {debugInfo}
            {/* {debugInfo.startsWith("✅") && (
                // <span className="ml-3 text-gray-800">
                //     Room: {roomID} | User: {userName}
                // </span>
          )} */}
          </p>
          
          {/* Back/Exit Button */}
          <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-gradient-to-br from-red-50 via-red-500 to-red-50 text-white font-semibold rounded-lg shadow-xl transition-colors duration-200 flex items-center space-x-2"
              aria-label="Exit video call and return to the previous page"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Exit Call</span>
          </button>
      </div>
      
      {/* This container will be populated by ZegoCloud UIkit */}
      {/* It sits beneath the fixed controls */}
      <div ref={meetingRef} className="w-full h-full" />
    </div>
  );
}
