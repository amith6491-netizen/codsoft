import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoDb?: Db;
  mongoIndexesReady?: Promise<void>;
};

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  const client = globalForMongo.mongoClient ?? new MongoClient(uri);
  if (!globalForMongo.mongoClient) globalForMongo.mongoClient = client;
  await client.connect();
  const db = globalForMongo.mongoDb ?? client.db(process.env.MONGODB_DB || "careerhub");
  globalForMongo.mongoDb = db;
  if (!globalForMongo.mongoIndexesReady) {
    globalForMongo.mongoIndexesReady = (async () => {
      await Promise.all([
        db.collection("users").createIndex({ email: 1 }, { unique: true }),
        db.collection("candidateProfiles").createIndex({ userId: 1 }, { unique: true }),
        db.collection("recruiterProfiles").createIndex({ userId: 1 }, { unique: true }),
        db.collection("applications").createIndex({ jobId: 1, candidateId: 1 }, { unique: true }),
        db.collection("applications").createIndex({ candidateId: 1 }),
        db.collection("jobs").createIndex({ status: 1, createdAt: -1 }),
      ]);
    })();
  }
  await globalForMongo.mongoIndexesReady;
  return db;
}