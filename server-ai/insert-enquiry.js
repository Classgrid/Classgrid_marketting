require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function insertTestEmail() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://classgrid_prod:YOUR_PASSWORD@cluster0.mongodb.net/classgrid";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('classgrid');
    const emailsInbound = db.collection('emails_inbound');

    const emailDoc = {
      messageId: "test-enquiry-" + Date.now(),
      senderName: "Rajesh Kumar",
      senderEmail: "random.principal.123456@outlook.com",
      subject: "Request for Demo - Large School Chain",
      body: `Hello,

I am looking at Classgrid for our chain of 5 schools. We have about 5,000 students in total.
I saw your pricing online, but because of our size, I need a custom quote.

Please have a human sales representative contact me directly to discuss pricing and arrange a personalized demo for my management team. I do not want an automated reply, I need to speak to someone from your sales team.

Regards,
Rajesh Kumar
Director`,
      cleanBody: `Hello,\n\nI am looking at Classgrid for our chain of 5 schools. We have about 5,000 students in total.\nI saw your pricing online, but because of our size, I need a custom quote.\n\nPlease have a human sales representative contact me directly to discuss pricing and arrange a personalized demo for my management team. I do not want an automated reply, I need to speak to someone from your sales team.\n\nRegards,\nRajesh Kumar\nDirector`,
      channel: "email",
      status: "pending",
      receivedAt: new Date()
    };

    const result = await emailsInbound.insertOne(emailDoc);
    console.log(`✅ Successfully inserted fake Demo Enquiry email!`);
    console.log(`Email ID: ${result.insertedId}`);
    console.log(`From: ${emailDoc.senderEmail}`);
    console.log(`Wait a few seconds for your AWS email-poller to pick this up and process it.`);
  } catch (err) {
    console.error("Error inserting email:", err);
  } finally {
    await client.close();
  }
}

insertTestEmail();
