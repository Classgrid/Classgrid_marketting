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
                body: '<p>Loud and clear! This is your third admin reply.</p><p>Notice how the manual Refresh button makes it super easy to check for new messages instantly without dropping you back to the top of the page?</p><p>Everything is perfectly synced. If you are satisfied with this test, we can consider the Support Integration successfully completed!</p>',
                date: new Date(),
                footer: 'Sent from Admin Portal'
            } },
            $set: { status: 'in_progress', lastComment: new Date() }
        });
        console.log('REPLY SENT SUCCESS');
    } else {
        console.log('TICKET NOT FOUND');
    }
    process.exit(0);
});
