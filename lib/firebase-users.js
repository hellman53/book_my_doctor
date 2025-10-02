import { db } from '@/app/firebase/config';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

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
      email:userData.email_addresses || userData.primary_email || '',
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
 * Get users data from Firestore
 */
export async function getUsersFromFirestore(   ) {
  try {
    const userRef = query(collection(db, 'users'));
    const querySnapshot = await getDocs(userRef);
    const users = querySnapshot.docs.map((doc)=>({
      id:doc.id,
      ...doc.data(),
    }));
    
    return users;
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

/**
 * Submit doctor application for admin approval
 * @param {Object} doctorFormData - Doctor form data from the registration form
 * @param {string} userId - Clerk user ID (optional)
 * @returns {Promise<{success: boolean, applicationId?: string, error?: string}>} - Submission result
 */
export async function submitDoctorApplication(doctorFormData, userId = null) {
  try {
    // Prepare doctor application data for Firestore
    const applicationData = {
      // Personal Information
      fullName: doctorFormData.fullName || '',
      email: doctorFormData.email || '',
      phone: doctorFormData.phone || '',
      gender: doctorFormData.gender || '',
      
      // Professional Information
      specialization: doctorFormData.specialization?.label || doctorFormData.specialization || '',
      experience: parseInt(doctorFormData.experience) || 0,
      qualifications: doctorFormData.qualifications || '',
      licenseNumber: doctorFormData.licenseNumber || '',
      
      // Location Information
      state: doctorFormData.state?.label || doctorFormData.state || '',
      city: doctorFormData.city?.label || doctorFormData.city || '',
      clinicName: doctorFormData.clinicName || '',
      clinicAddress: doctorFormData.clinicAddress || '',
      
      // Consultation Information
      consultationFee: parseFloat(doctorFormData.consultationFee) || 0,
      availability: doctorFormData.availability || [],
      
      // Application Status and Metadata
      status: 'pending', // pending, approved, rejected
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: userId, // Link to the user who submitted this application
      
      // Admin fields
      reviewedBy: null,
      reviewedAt: null,
      adminComments: '',
      
      // Additional tracking fields
      ipAddress: '', // Can be added from client if needed
      userAgent: '', // Can be added from client if needed
      applicationVersion: '1.0',
    };

    // Add the application to the admin-approval collection
    const adminApprovalRef = collection(db, 'admin-approval');
    const docRef = await addDoc(adminApprovalRef, applicationData);
    
    console.log(`Doctor application submitted with ID: ${docRef.id}`);
    
    // Optional: Update user role to indicate pending doctor application
    if (userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            role: 'doctor-pending', // Indicates pending doctor approval
            doctorApplicationId: docRef.id, // Link to the application
            updatedAt: serverTimestamp()
          });
        }
      } catch (userUpdateError) {
        console.warn('Could not update user role, but application was submitted:', userUpdateError);
      }
    }
    
    return {
      success: true,
      applicationId: docRef.id,
      message: 'Doctor application submitted successfully and is pending admin approval.'
    };
    
  } catch (error) {
    console.error('Error submitting doctor application:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit doctor application. Please try again.'
    };
  }
}

/**
 * Get all pending doctor applications (for admin dashboard)
 * @returns {Promise<Array>} - Array of pending applications
 */
export async function getPendingDoctorApplications() {
  try {
    const adminApprovalRef = collection(db, 'admin-approval');
    const q = query(adminApprovalRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    
    return applications;
  } catch (error) {
    console.error('Error getting pending applications:', error);
    return [];
  }
}

/**
 * Get all doctor applications (for admin dashboard)
 * @returns {Promise<Array>} - Array of all applications
 */
export async function getAllDoctorApplications() {
  try {
    const adminApprovalRef = collection(db, 'admin-approval');
    const querySnapshot = await getDocs(adminApprovalRef);
    
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by submission date (newest first)
    applications.sort((a, b) => {
      const aTime = a.submittedAt?.toDate?.() || new Date(a.submittedAt || 0);
      const bTime = b.submittedAt?.toDate?.() || new Date(b.submittedAt || 0);
      return bTime - aTime;
    });
    
    return applications;
  } catch (error) {
    console.error('Error getting all applications:', error);
    return [];
  }
}

/**
 * Approve doctor application and add to doctors collection
 * @param {string} applicationId - Application document ID
 * @param {string} adminUserId - Admin user ID who is reviewing
 * @param {string} adminComments - Optional admin comments
 * @returns {Promise<{success: boolean, error?: string}>} - Operation result
 */
export async function approveDoctorApplication(applicationId, adminUserId, adminComments = '') {
  try {
    const applicationRef = doc(db, 'admin-approval', applicationId);
    const applicationDoc = await getDoc(applicationRef);
    
    if (!applicationDoc.exists()) {
      throw new Error('Application not found');
    }
    
    const applicationData = applicationDoc.data();
    
    // Update application status
    await updateDoc(applicationRef, {
      status: 'approved',
      reviewedBy: adminUserId,
      reviewedAt: serverTimestamp(),
      adminComments: adminComments,
      updatedAt: serverTimestamp()
    });
    
    // Add doctor to doctors collection using Clerk user ID as document ID
    if (applicationData.userId) {
      const doctorRef = doc(db, 'doctors', applicationData.userId);
      const doctorData = {
        // Personal Information
        clerkId: applicationData.userId,
        fullName: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone,
        gender: applicationData.gender,
        
        // Professional Information
        specialization: applicationData.specialization,
        experience: applicationData.experience,
        qualifications: applicationData.qualifications,
        licenseNumber: applicationData.licenseNumber,
        
        // Location Information
        state: applicationData.state,
        city: applicationData.city,
        clinicName: applicationData.clinicName,
        clinicAddress: applicationData.clinicAddress,
        
        // Consultation Information
        consultationFee: applicationData.consultationFee,
        availability: applicationData.availability,
        
        // Status and metadata
        isActive: true,
        isVerified: true,
        approvedAt: serverTimestamp(),
        approvedBy: adminUserId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Rating and reviews (initially empty)
        rating: 0,
        totalReviews: 0,
        reviews: [],
        
        // Application reference
        applicationId: applicationId
      };
      
      await setDoc(doctorRef, doctorData);
      
      // Update user role
      const userRef = doc(db, 'users', applicationData.userId);
      await updateDoc(userRef, {
        role: 'doctor',
        updatedAt: serverTimestamp()
      });
    }
    
    console.log(`Application ${applicationId} approved by admin ${adminUserId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error approving doctor application:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reject doctor application
 * @param {string} applicationId - Application document ID
 * @param {string} adminUserId - Admin user ID who is reviewing
 * @param {string} adminComments - Optional admin comments
 * @returns {Promise<{success: boolean, error?: string}>} - Operation result
 */
export async function rejectDoctorApplication(applicationId, adminUserId, adminComments = '') {
  try {
    const applicationRef = doc(db, 'admin-approval', applicationId);
    const applicationDoc = await getDoc(applicationRef);
    
    if (!applicationDoc.exists()) {
      throw new Error('Application not found');
    }
    
    const applicationData = applicationDoc.data();
    
    // Update application status to rejected
    await updateDoc(applicationRef, {
      status: 'rejected',
      reviewedBy: adminUserId,
      reviewedAt: serverTimestamp(),
      adminComments: adminComments,
      updatedAt: serverTimestamp()
    });
    
    // Update user role back to patient if they have a userId
    if (applicationData.userId) {
      const userRef = doc(db, 'users', applicationData.userId);
      await updateDoc(userRef, {
        role: 'patient',
        doctorApplicationId: null,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log(`Application ${applicationId} rejected by admin ${adminUserId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error rejecting doctor application:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get analytics data for admin dashboard
 * @returns {Promise<Object>} - Analytics data object
 */
export async function getAnalyticsData() {
  try {
    // Get total users count
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const totalUsers = usersSnapshot.size;
    
    // Get total doctors count
    const doctorsRef = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsRef);
    const totalDoctors = doctorsSnapshot.size;
    
    // Get patients count (users with role 'patient')
    const patientsQuery = query(usersRef, where('role', '==', 'patient'));
    const patientsSnapshot = await getDocs(patientsQuery);
    const totalPatients = patientsSnapshot.size;
    
    // Get pending applications count
    const applicationsRef = collection(db, 'admin-approval');
    const pendingQuery = query(applicationsRef, where('status', '==', 'pending'));
    const pendingSnapshot = await getDocs(pendingQuery);
    const pendingApplications = pendingSnapshot.size;
    
    // Get approved applications count
    const approvedQuery = query(applicationsRef, where('status', '==', 'approved'));
    const approvedSnapshot = await getDocs(approvedQuery);
    const approvedApplications = approvedSnapshot.size;
    
    // Get rejected applications count
    const rejectedQuery = query(applicationsRef, where('status', '==', 'rejected'));
    const rejectedSnapshot = await getDocs(rejectedQuery);
    const rejectedApplications = rejectedSnapshot.size;
    
    // Get total applications count
    const allApplicationsSnapshot = await getDocs(applicationsRef);
    const totalApplications = allApplicationsSnapshot.size;
    
    return {
      totalUsers,
      totalDoctors,
      totalPatients,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalApplications
    };
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return {
      totalUsers: 0,
      totalDoctors: 0,
      totalPatients: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      totalApplications: 0
    };
  }
}

/**
 * Approve or reject a doctor application
 * @param {string} applicationId - Application document ID
 * @param {string} status - 'approved' or 'rejected'
 * @param {string} adminUserId - Admin user ID who is reviewing
 * @param {string} adminComments - Optional admin comments
 * @returns {Promise<boolean>} - Success status
 */
export async function reviewDoctorApplication(applicationId, status, adminUserId, adminComments = '') {
  try {
    const applicationRef = doc(db, 'admin-approval', applicationId);
    const applicationDoc = await getDoc(applicationRef);
    
    if (!applicationDoc.exists()) {
      throw new Error('Application not found');
    }
    
    const applicationData = applicationDoc.data();
    
    // Update application status
    await updateDoc(applicationRef, {
      status: status,
      reviewedBy: adminUserId,
      reviewedAt: serverTimestamp(),
      adminComments: adminComments,
      updatedAt: serverTimestamp()
    });
    
    // Update user role if approved
    if (status === 'approved' && applicationData.userId) {
      const userRef = doc(db, 'users', applicationData.userId);
      await updateDoc(userRef, {
        role: 'doctor',
        doctorProfile: {
          specialization: applicationData.specialization,
          experience: applicationData.experience,
          qualifications: applicationData.qualifications,
          licenseNumber: applicationData.licenseNumber,
          clinicName: applicationData.clinicName,
          clinicAddress: applicationData.clinicAddress,
          consultationFee: applicationData.consultationFee,
          availability: applicationData.availability,
          approvedAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      });
    } else if (status === 'rejected' && applicationData.userId) {
      const userRef = doc(db, 'users', applicationData.userId);
      await updateDoc(userRef, {
        role: 'patient', // Reset to patient role
        doctorApplicationId: null,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log(`Application ${applicationId} ${status} by admin ${adminUserId}`);
    return true;
    
  } catch (error) {
    console.error('Error reviewing doctor application:', error);
    return false;
  }
}
