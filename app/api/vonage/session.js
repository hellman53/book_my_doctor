import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_PRIVATE_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { doctorId, patientId, appointmentType } = req.body;

    // Generate a unique session ID
    const sessionId = `session_${doctorId}_${patientId}_${Date.now()}`;

    // Create Vonage session (this is a simplified example)
    // In a real implementation, you would use the Vonage SDK to create a proper session
    const vonageSession = {
      sessionId: sessionId,
      doctorId: doctorId,
      patientId: patientId,
      appointmentType: appointmentType,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Store session in your database (you might want to create a separate collection for this)
    // await saveVonageSession(vonageSession);

    res.status(200).json({
      success: true,
      sessionId: sessionId,
      token: 'your-generated-token-here' // You would generate a proper token with Vonage SDK
    });
  } catch (error) {
    console.error('Error generating Vonage session:', error);
    res.status(500).json({ error: 'Failed to generate video session' });
  }
}