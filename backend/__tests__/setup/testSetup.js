import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export const setupTestDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 5,
    });
    
    return mongoUri;
  } catch (error) {
    console.error("Test DB setup error:", error);
    throw error;
  }
};

export const teardownTestDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error("Test DB teardown error:", error);
  }
};

export const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error("Clear database error:", error);
  }
};

