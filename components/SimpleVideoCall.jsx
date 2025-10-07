"use client";
import React, { useEffect, useRef, useState } from "react";

export default function VideoCall() {
  const meetingRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState("Initializing video call...");

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Starting import...");
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
        console.log("✅ SDK Loaded:", ZegoUIKitPrebuilt);

        const appID = Number(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET;
        console.log("Zego App ID:", appID);
        console.log("Zego Server Secret:", serverSecret ? "Loaded" : "Missing");

        if (!appID || !serverSecret) {
          throw new Error("Missing Zego credentials in env");
        }

        const roomID = "test-room-" + Math.random().toString(36).substring(2, 8);
        const userID = Date.now().toString();
        const userName = "TestUser_" + userID;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        console.log("Joining room:", roomID);

        if (!meetingRef.current) {
          throw new Error("Meeting ref not ready yet.");
        }

        zp.joinRoom({
          container: meetingRef.current,
          scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
          showScreenSharingButton: true,
        });

        setDebugInfo("✅ Video call connected successfully.");
      } catch (err) {
        console.error("Video Call Init Error:", err);
        setDebugInfo("❌ " + err.message);
      }
    };

    init();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <p className="mb-4 text-sm opacity-70">{debugInfo}</p>
      <div ref={meetingRef} className="w-full h-full" />
    </div>
  );
}
