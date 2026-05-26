import mongoose from 'mongoose';
const MONGO_URI = 'mongodb://classgrid-admin:Classgrid%402026@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid';

mongoose.connect(MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const ticket = await db.collection('supporttickets').findOne({ submitterEmail: 'nikhil.shinde25@pccoepune.org' }, { sort: { createdAt: -1 } });
    if (ticket) {
        await db.collection('supporttickets').updateOne({ _id: ticket._id }, {
            $push: { messages: {
                author: 'Nikhil Shinde',
                role: 'admin',
                body: '<p>Hi Nikhil! I can see your reply. This is exactly how you will be able to reply to users from the Super Admin dashboard once it is fully built.</p><p>As you can see, because I set my role to <strong>admin</strong>, the system automatically adds the blue verification checkmark and <em>Classgrid Support</em> tag next to my name!</p>',
                date: new Date(),
                footer: 'Sent from Admin Portal'
            } },
            $set: { status: 'waiting_on_user', lastComment: new Date() }
        });
        console.log('REPLY SENT SUCCESS');
    } else {
        console.log('TICKET NOT FOUND');
    }
    process.exit(0);
});
