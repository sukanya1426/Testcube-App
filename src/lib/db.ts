import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL environment variable is not set.");
}

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend globalThis inline
const globalWithMongoose = global as typeof global & {
  mongoose?: MongooseConn;
};

const cached: MongooseConn = globalWithMongoose.mongoose || { conn: null, promise: null };

globalWithMongoose.mongoose = cached;

export const connect = async () => {
  if (cached.conn) return cached.conn;

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URL, {
        dbName: "TestCube App",
        bufferCommands: false,
        connectTimeoutMS: 30000,
      });

    cached.conn = await cached.promise;

    return cached.conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
