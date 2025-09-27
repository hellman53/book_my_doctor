import { db } from '@/app/firebase/config';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Save or update user data in Firestore
 * @param {Object} userData - User data from Clerk
 * @returns {Promise<boolean>} - Success status
 */
export async function saveUserToFirestore(userData) {
  try {
    const userRef = doc(db, 'users', userData.id);
    
    // Prepare user data for Firestore
    const firestoreUserData = {
      clerkId: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      profileImage: userData.image_url || userData.profile_image_url || '',
      phone: userData.phone_numbers?.[0]?.phone_number || '',
      username: userData.username || '',
      createdAt: userData.created_at ? new Date(userData.created_at) : serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Additional user fields for your app
      role: 'patient', // Default role, can be 'patient', 'doctor', 'admin'
      isActive: true,
      preferences: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false
      },
      // Medical related fields (can be updated later)
      medicalInfo: {
        allergies: [],
        conditions: [],
        medications: [],
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        }
      }
    };

    // Check if user already exists
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing user (don't overwrite medical info and preferences)
      const existingData = userDoc.data();
      const updateData = {
        email: firestoreUserData.email,
        firstName: firestoreUserData.firstName,
        lastName: firestoreUserData.lastName,
        fullName: firestoreUserData.fullName,
        profileImage: firestoreUserData.profileImage,
        phone: firestoreUserData.phone,
        username: firestoreUserData.username,
        updatedAt: serverTimestamp(),
        isActive: true
      };
      
      await updateDoc(userRef, updateData);
      console.log(`User ${userData.id} updated in Firestore`);
    } else {
      // Create new user
      await setDoc(userRef, firestoreUserData);
      console.log(`User ${userData.id} created in Firestore`);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    return false;
  }
}

/**
 * Get user data from Firestore by Clerk ID
 * @param {string} clerkId - Clerk user ID
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export async function getUserFromFirestore(clerkId) {
  try {
    const userRef = doc(db, 'users', clerkId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    return null;
  }
}

/**
 * Update user profile information
 * @param {string} clerkId - Clerk user ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<boolean>} - Success status
 */
export async function updateUserProfile(clerkId, updateData) {
  try {
    const userRef = doc(db, 'users', clerkId);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log(`User ${clerkId} profile updated`);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

/**
 * Update user medical information
 * @param {string} clerkId - Clerk user ID
 * @param {Object} medicalData - Medical data to update
 * @returns {Promise<boolean>} - Success status
 */
export async function updateUserMedicalInfo(clerkId, medicalData) {
  try {
    const userRef = doc(db, 'users', clerkId);
    await updateDoc(userRef, {
      medicalInfo: medicalData,
      updatedAt: serverTimestamp()
    });
    
    console.log(`User ${clerkId} medical info updated`);
    return true;
  } catch (error) {
    console.error('Error updating user medical info:', error);
    return false;
  }
}

/**
 * Get users by role
 * @param {string} role - User role ('patient', 'doctor', 'admin')
 * @returns {Promise<Array>} - Array of users
 */
export async function getUsersByRole(role) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', role), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    return [];
  }
}

/**
 * Deactivate user account
 * @param {string} clerkId - Clerk user ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deactivateUser(clerkId) {
  try {
    const userRef = doc(db, 'users', clerkId);
    await updateDoc(userRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });
    
    console.log(`User ${clerkId} deactivated`);
    return true;
  } catch (error) {
    console.error('Error deactivating user:', error);
    return false;
  }
}

/**
 * Process Clerk webhook user data
 * @param {Object} clerkUserData - Raw user data from Clerk webhook
 * @returns {Promise<boolean>} - Success status
 */
export async function processClerkUserWebhook(clerkUserData) {
  try {
    // Transform Clerk webhook data to our format
    const userData = {
      id: clerkUserData.id,
      email_addresses: clerkUserData.email_addresses,
      first_name: clerkUserData.first_name,
      last_name: clerkUserData.last_name,
      image_url: clerkUserData.image_url,
      phone_numbers: clerkUserData.phone_numbers,
      username: clerkUserData.username,
      created_at: clerkUserData.created_at,
    };
    
    return await saveUserToFirestore(userData);
  } catch (error) {
    console.error('Error processing Clerk webhook:', error);
    return false;
  }
}
