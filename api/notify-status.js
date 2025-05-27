export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { target_fids, title, body, target_url } = req.body;

  if (!target_fids || !title || !body || !target_url) {
    return res.status(400).json({ error: 'Missing required fields: target_fids, title, body, or target_url' });
  }

  const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/frame/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        target_fids, // can be "all" or an array of fids
        notification: {
          title,
          body,
          target_url,
          uuid: crypto.randomUUID(),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: 'Failed to send notification', details: errorData });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}