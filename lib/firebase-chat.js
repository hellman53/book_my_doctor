import { db } from "@/app/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

/**
 * Create a new chat session
 */
export async function createNewChatSession(userId) {
  try {
    if (!userId) return null;

    const sessionsRef = collection(db, "users", userId, "sessions");
    const docRef = await addDoc(sessionsRef, {
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      messageCount: 0,
      title: "New Chat"
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating chat session:", error);
    return null;
  }
}

/**
 * Save user message to Firestore with Clerk user ID
 */
export async function saveUserMessage(userId, sessionId, messageData) {
  try {
    if (!userId || !sessionId) {
      console.error("No user ID or session ID provided");
      return;
    }

    // Save the message
    const messagesRef = collection(db, "users", userId, "sessions", sessionId, "messages");
    const docRef = await addDoc(messagesRef, {
      role: messageData.role,
      content: messageData.content,
      doctor: messageData.doctor || null,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    // Update session last activity and increment message count
    const sessionRef = doc(db, "users", userId, "sessions", sessionId);
    
    // Get current session data to properly increment message count
    const sessionDoc = await getDoc(sessionRef);
    const currentSession = sessionDoc.data();
    const currentMessageCount = currentSession?.messageCount || 0;
    
    await updateDoc(sessionRef, {
      lastActivity: serverTimestamp(),
      messageCount: currentMessageCount + 1
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

/**
 * Get user's chat sessions ordered by last activity
 */
export async function getChatSessions(userId) {
  try {
    if (!userId) return [];

    const sessionsRef = collection(db, "users", userId, "sessions");
    const q = query(sessionsRef, orderBy("lastActivity", "desc"));
    const snapshot = await getDocs(q);
    
    const sessions = [];
    
    for (const doc of snapshot.docs) {
      const sessionData = doc.data();
      
      sessions.push({
        id: doc.id,
        ...sessionData,
        // Use the messageCount from Firestore document
        messageCount: sessionData.messageCount || 0
      });
    }
    
    return sessions;
  } catch (error) {
    console.error("Error getting chat sessions:", error);
    return [];
  }
}

/**
 * Get user's chat history for a specific session
 */
export async function getUserChatHistory(userId, sessionId) {
  try {
    if (!userId || !sessionId) return [];

    const messagesRef = collection(db, "users", userId, "sessions", sessionId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
}

/**
 * Real-time listener for chat updates
 */
export function subscribeToChat(userId, sessionId, callback) {
  if (!userId || !sessionId) return () => {};

  const messagesRef = collection(db, "users", userId, "sessions", sessionId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
}

/**
 * Initialize user's chat collection
 */
export async function initializeUserChat(userId) {
  try {
    if (!userId) return;

    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      initialized: true,
      lastActive: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error initializing user chat:", error);
  }
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(userId, sessionId) {
  try {
    if (!userId || !sessionId) return;

    const sessionRef = doc(db, "users", userId, "sessions", sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error("Error deleting chat session:", error);
    throw error;
  }
}