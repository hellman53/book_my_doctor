import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { processClerkUserWebhook, deactivateUser } from '@/lib/firebase-users';

// Webhook handler for Clerk user events
export async function POST(req) {
  try {
    // Get the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('Please add CLERK_WEBHOOK_SECRET to your environment variables');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await req.text();
    const body = JSON.parse(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the webhook event
    const { type, data } = evt;
    
    console.log(`Received webhook event: ${type} for user: ${data?.id}`);

    switch (type) {
      case 'user.created':
        // User signed up - save to Firestore
        console.log('Processing user.created event:', data.id);
        const createSuccess = await processClerkUserWebhook(data);
        
        if (createSuccess) {
          console.log(`Successfully created user ${data.id} in Firestore`);
        } else {
          console.error(`Failed to create user ${data.id} in Firestore`);
        }
        break;

      case 'user.updated':
        // User updated their profile - update in Firestore
        console.log('Processing user.updated event:', data.id);
        const updateSuccess = await processClerkUserWebhook(data);
        
        if (updateSuccess) {
          console.log(`Successfully updated user ${data.id} in Firestore`);
        } else {
          console.error(`Failed to update user ${data.id} in Firestore`);
        }
        break;

      case 'user.deleted':
        // User deleted their account - deactivate in Firestore
        console.log('Processing user.deleted event:', data.id);
        const deactivateSuccess = await deactivateUser(data.id);
        
        if (deactivateSuccess) {
          console.log(`Successfully deactivated user ${data.id} in Firestore`);
        } else {
          console.error(`Failed to deactivate user ${data.id} in Firestore`);
        }
        break;

      case 'session.created':
        // Optional: Handle session creation for analytics
        console.log('Session created for user:', data.user_id);
        break;

      case 'session.ended':
        // Optional: Handle session end for analytics
        console.log('Session ended for user:', data.user_id);
        break;

      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ 
    message: 'Clerk webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
