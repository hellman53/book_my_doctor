'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { saveUserToFirestore, getUserFromFirestore } from '@/lib/firebase-users';

/**
 * UserSyncProvider component that automatically syncs user data from Clerk to Firestore
 * This acts as a fallback in case webhooks are not set up or fail
 */
export default function UserSyncProvider({ children }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error

  useEffect(() => {
    const syncUserData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        return;
      }

      try {
        setSyncStatus('syncing');
        
        // Check if user already exists in Firestore
        const existingUser = await getUserFromFirestore(user.id);
        
        if (!existingUser) {
          console.log('User not found in Firestore, creating new record...');
          
          // Transform Clerk user data to our format
          const userData = {
            id: user.id,
            email_addresses: user.emailAddresses,
            first_name: user.firstName,
            last_name: user.lastName,
            image_url: user.imageUrl,
            phone_numbers: user.phoneNumbers,
            username: user.username,
            created_at: user.createdAt,
          };
          
          const success = await saveUserToFirestore(userData);
          
          if (success) {
            console.log('User successfully synced to Firestore');
            setSyncStatus('synced');
          } else {
            console.error('Failed to sync user to Firestore');
            setSyncStatus('error');
          }
        } else {
          console.log('User already exists in Firestore');
          setSyncStatus('synced');
          
          // Optionally update user data if it's outdated
          const userData = {
            id: user.id,
            email_addresses: user.emailAddresses,
            first_name: user.firstName,
            last_name: user.lastName,
            image_url: user.imageUrl,
            phone_numbers: user.phoneNumbers,
            username: user.username,
            created_at: user.createdAt,
          };
          
          // Update user data (this will only update basic info, not overwrite medical data)
          await saveUserToFirestore(userData);
        }
      } catch (error) {
        console.error('Error syncing user data:', error);
        setSyncStatus('error');
      }
    };

    syncUserData();
  }, [user, isSignedIn, isLoaded]);

  // Optional: You can add a loading indicator or error message here
  if (process.env.NODE_ENV === 'development' && syncStatus === 'syncing') {
    console.log('🔄 Syncing user data to Firestore...');
  }

  if (process.env.NODE_ENV === 'development' && syncStatus === 'synced') {
    console.log('✅ User data synced successfully');
  }

  if (process.env.NODE_ENV === 'development' && syncStatus === 'error') {
    console.error('❌ Failed to sync user data');
  }

  return <>{children}</>;
}

/**
 * Hook to get the current sync status
 * @returns {string} - Current sync status: 'idle', 'syncing', 'synced', 'error'
 */
export function useUserSync() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    const checkSyncStatus = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setSyncStatus('idle');
        return;
      }

      try {
        const existingUser = await getUserFromFirestore(user.id);
        setSyncStatus(existingUser ? 'synced' : 'needs_sync');
      } catch (error) {
        console.error('Error checking sync status:', error);
        setSyncStatus('error');
      }
    };

    checkSyncStatus();
  }, [user, isSignedIn, isLoaded]);

  return { syncStatus, isUserSynced: syncStatus === 'synced' };
}
