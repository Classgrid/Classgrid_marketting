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

/**
 * Check if the current mongoose connection is alive and usable.
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
function isConnectionAlive(): boolean {
  const state = mongoose.connection.readyState;
  return state === 1; // Only "connected" is truly alive
}

export async function connectMongo() {
  // If we have a cached connection, verify it's still alive
  if (cached.conn) {
    if (isConnectionAlive()) {
      return cached.conn;
    }
    // Connection is stale/dead — reset the cache so we reconnect
    console.warn("⚠️ [mongodb] Stale connection detected (readyState:", mongoose.connection.readyState, "). Reconnecting...");
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,  // fail in 8s instead of hanging
      connectTimeoutMS: 8000,
      socketTimeoutMS: 30000,
    }).catch((err) => {
      // If connection fails, reset the cache so next call tries again
      console.error("❌ [mongodb] Connection failed:", err.message);
      cached.conn = null;
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;
  return cached.conn;
}
