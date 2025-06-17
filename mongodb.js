// This would be a real MongoDB connection in production
// const uri = process.env.MONGODB_URI;
// let client;
// let clientPromise;

// if (!uri) {
//   throw new Error('Please add your MongoDB URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export default clientPromise;

// For demo purposes, we'll create a mock MongoDB client
export default {
  connect: () => {
    console.log("Mock MongoDB connection established")
    return {
      db: (dbName) => ({
        collection: (collectionName) => ({
          find: () => ({
            toArray: async () => [],
          }),
          findOne: async () => null,
          insertOne: async () => ({ insertedId: "mock-id" }),
          insertMany: async () => ({ insertedIds: ["mock-id-1", "mock-id-2"] }),
          updateOne: async () => ({ modifiedCount: 1 }),
          deleteOne: async () => ({ deletedCount: 1 }),
          aggregate: () => ({
            toArray: async () => [],
          }),
        }),
      }),
    }
  },
}
