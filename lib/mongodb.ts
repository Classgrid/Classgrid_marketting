import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };

function getMongoUri() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }
  return uri;
}

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,  // fail in 8s instead of hanging
      connectTimeoutMS: 8000,
      socketTimeoutMS: 30000,
    });
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;
  return cached.conn;
}
