const fetch = require('node-fetch');

async function testIncomingEmail() {
  const payload = {
    "MessageId": "test-demo-enquiry-" + Date.now(),
    "From": "random.principal12345@outlook.com",
    "To": "support@classgrid.in",
    "Subject": "Request for Demo - Large School Chain",
    "TextBody": `Hello,

I am looking at Classgrid for our chain of 5 schools. We have about 5,000 students in total.
I saw your pricing online, but because of our size, I need a custom quote.

Please have a human sales representative contact me directly to discuss pricing and arrange a personalized demo for my management team. I do not want an automated reply, I need to speak to someone from your sales team.

Regards,
Rajesh Kumar
Director`,
    "HtmlBody": "",
    "Date": new Date().toISOString()
  };

  try {
    console.log("Sending fake incoming email to webhook...");
    const response = await fetch('http://localhost:3002/api/webhook/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("Webhook Response:", result);
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}

testIncomingEmail();
