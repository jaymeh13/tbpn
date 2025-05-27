import { randomUUID } from 'crypto';

export default async function handler(req, res) {
    console.log('Cron job triggered at:', new Date().toISOString());
    
    // Verify the request is from Vercel Cron
    if (req.headers['x-vercel-cron'] !== process.env.CRON_SECRET) {
      console.error('Unauthorized request');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      console.log('Sending notification to Neynar...');
      const response = await fetch('https://api.neynar.com/v2/farcaster/frame/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEYNAR_API_KEY,
        },
        body: JSON.stringify({
          target_fids: [],
          notification: {
            title: 'TBPN is Live',
            body: 'John and Jordi are streaming now on Farcaster',
            target_url: 'https://tbpn.vercel.app',
            uuid: randomUUID(),
          },
        }),
      });
  
      const data = await response.json();
      console.log('Neynar API response:', data);

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${JSON.stringify(data)}`);
      }
  
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Cron job error:', error);
      return res.status(500).json({ error: error.message });
    }
}