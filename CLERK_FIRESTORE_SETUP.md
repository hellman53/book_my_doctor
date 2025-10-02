# Clerk to Firestore User Synchronization Setup Guide

This guide explains how to automatically sync user details from Clerk to Firestore when users sign up or update their profiles.

## 🎯 What This Setup Does

- **Automatic User Creation**: When a user signs up via Clerk, their details are automatically stored in Firestore
- **Real-time Updates**: When users update their profile in Clerk, the changes are reflected in Firestore
- **Fallback Mechanism**: Client-side sync ensures users are saved even if webhooks fail
- **Data Structure**: Creates a comprehensive user document with medical app-specific fields

## 📁 Files Created/Modified

1. **`lib/firebase-users.js`** - Firebase utility functions for user management
2. **`app/api/webhooks/clerk/route.js`** - Clerk webhook handler API route
3. **`components/UserSyncProvider.jsx`** - Client-side fallback sync component
4. **`app/layout.js`** - Updated to include UserSyncProvider
5. **`.env.local`** - Added webhook secret environment variable

## ⚙️ Setup Instructions

### Step 1: Configure Clerk Webhooks

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** in the sidebar
3. Click **"Create Endpoint"**
4. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
   - For development: `http://localhost:3000/api/webhooks/clerk`
5. Select the following events:
   - `user.created`
   - `user.updated` 
   - `user.deleted` (optional)
6. Copy the **Signing Secret** and add it to your `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_your_actual_secret_here
   ```

### Step 2: Update Environment Variables

In your `.env.local` file, replace the placeholder:
```env
CLERK_WEBHOOK_SECRET=your_webhook_secret_here
```

With your actual webhook secret from Clerk dashboard.

### Step 3: Deploy (for Production)

If you're using Vercel, Netlify, or another hosting service:

1. Add the `CLERK_WEBHOOK_SECRET` environment variable in your hosting dashboard
2. Update the webhook URL in Clerk to point to your production domain
3. Redeploy your application

## 🗃️ Firestore Data Structure

When a user signs up, the following document structure is created in Firestore:

```json
{
  "clerkId": "user_abc123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "profileImage": "https://...",
  "phone": "+1234567890",
  "username": "johndoe",
  "role": "patient",
  "isActive": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "preferences": {
    "notifications": true,
    "emailNotifications": true,
    "smsNotifications": false
  },
  "medicalInfo": {
    "allergies": [],
    "conditions": [],
    "medications": [],
    "emergencyContact": {
      "name": "",
      "phone": "",
      "relationship": ""
    }
  }
}
```

## 🔄 How It Works

### Primary Method: Webhooks
1. User signs up or updates profile in Clerk
2. Clerk sends webhook to `/api/webhooks/clerk`
3. Webhook handler processes the event and saves/updates user in Firestore
4. Real-time synchronization with no user interaction needed

### Fallback Method: Client-Side Sync
1. `UserSyncProvider` runs on every page load
2. Checks if the current user exists in Firestore
3. If not found, creates the user document
4. Ensures no users are missed even if webhooks fail

## 🛠️ Usage Examples

### Get User from Firestore
```javascript
import { getUserFromFirestore } from '@/lib/firebase-users';

const user = await getUserFromFirestore('user_abc123');
```

### Update User Profile
```javascript
import { updateUserProfile } from '@/lib/firebase-users';

await updateUserProfile('user_abc123', {
  phone: '+1234567890',
  role: 'doctor'
});
```

### Update Medical Information
```javascript
import { updateUserMedicalInfo } from '@/lib/firebase-users';

await updateUserMedicalInfo('user_abc123', {
  allergies: ['Peanuts', 'Shellfish'],
  conditions: ['Hypertension'],
  medications: ['Lisinopril 10mg'],
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1987654321',
    relationship: 'Spouse'
  }
});
```

### Get Users by Role
```javascript
import { getUsersByRole } from '@/lib/firebase-users';

const doctors = await getUsersByRole('doctor');
const patients = await getUsersByRole('patient');
```

## 🔒 Security Considerations

1. **Webhook Verification**: All webhooks are verified using Svix to ensure they come from Clerk
2. **Environment Variables**: Webhook secrets are stored securely in environment variables
3. **Error Handling**: Comprehensive error handling prevents crashes and logs issues
4. **Data Validation**: Input data is validated before saving to Firestore

## 🐛 Troubleshooting

### Webhook Not Working
1. Check that `CLERK_WEBHOOK_SECRET` is correctly set
2. Verify the webhook URL in Clerk dashboard is correct
3. Check your application logs for webhook errors
4. Use the client-side fallback as a temporary solution

### Users Not Syncing
1. Check browser console for client-side errors
2. Verify Firebase configuration is correct
3. Ensure Firestore security rules allow writes
4. Check network connectivity to Firebase

### Data Not Updating
1. Verify the user ID matches between Clerk and Firestore
2. Check if the update functions are being called correctly
3. Review Firestore security rules for update permissions

## 🚀 Production Checklist

- [ ] Webhook secret added to production environment variables
- [ ] Webhook URL updated to production domain in Clerk
- [ ] Firestore security rules configured properly
- [ ] Application deployed and tested
- [ ] Webhook endpoint tested with actual signups
- [ ] Error monitoring setup for webhook failures

## 📝 Next Steps

1. **Customize User Fields**: Add more fields to the user document based on your app's needs
2. **Add Validation**: Implement server-side validation for user data
3. **Setup Monitoring**: Add logging and monitoring for webhook failures
4. **Create Admin Panel**: Build an admin interface to manage users
5. **Add User Roles**: Implement role-based access control

## 📞 Support

If you encounter any issues:
1. Check the browser console for client-side errors
2. Review application logs for server-side errors
3. Verify all environment variables are set correctly
4. Test with the webhook debugging tools in Clerk dashboard

---

**Note**: This setup provides both webhook-based and client-side synchronization to ensure reliability. The client-side sync acts as a fallback mechanism in case webhooks fail or are not yet configured.
