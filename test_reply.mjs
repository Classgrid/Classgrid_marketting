import mongoose from 'mongoose';
const MONGO_URI = 'mongodb://classgrid-admin:Classgrid%402026@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid';

mongoose.connect(MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const ticket = await db.collection('supporttickets').findOne({ submitterEmail: 'nikhil.shinde25@pccoepune.org' }, { sort: { createdAt: -1 } });
    if (ticket) {
        await db.collection('supporttickets').updateOne({ _id: ticket._id }, {
            $push: { messages: {
                author: 'Classgrid Support Team',
                role: 'admin',
                body: '<p>Hello Nikhil,</p><p>We have received your message. This is an automated test reply from the Classgrid Support Team. The system is working perfectly and you can now see replies directly fetched from MongoDB!</p>',
                date: new Date(),
                footer: 'Classgrid Support API'
            } },
            $set: { status: 'in_progress', lastComment: new Date() }
        });
        console.log('REPLY SENT SUCCESS');
    } else {
        console.log('TICKET NOT FOUND');
    }
    process.exit(0);
});
