const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testZoom() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  try {
    console.log('Fetching token...');
    const tokenResponse = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log('Token acquired. Creating meeting...');

    const meetingResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'Classgrid Demo Test',
        type: 2, // Scheduled meeting
        start_time: new Date(Date.now() + 3600000).toISOString(),
        duration: 30,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Meeting created successfully:');
    console.log('Join URL:', meetingResponse.data.join_url);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testZoom();
