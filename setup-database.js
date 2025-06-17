const { MongoClient } = require("mongodb")
require("dotenv").config({ path: ".env.local" })

async function setupDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("news_insights")

    // Create collections
    const collections = ["articles", "sources", "analytics", "users"]

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      } catch (error) {
        if (error.code === 48) {
          console.log(`Collection ${collectionName} already exists`)
        } else {
          throw error
        }
      }
    }

    // Create indexes for better performance
    const articlesCollection = db.collection("articles")

    // Text search index
    await articlesCollection.createIndex({
      title: "text",
      description: "text",
      content: "text",
    })

    // Vector search index (for MongoDB Atlas)
    try {
      await articlesCollection.createIndex({
        vector: "2dsphere",
      })
      console.log("Created vector index")
    } catch (error) {
      console.log("Vector index creation skipped (requires MongoDB Atlas)")
    }

    // Other useful indexes
    await articlesCollection.createIndex({ publishedAt: -1 })
    await articlesCollection.createIndex({ "source.name": 1 })
    await articlesCollection.createIndex({ sentiment: 1 })
    await articlesCollection.createIndex({ categories: 1 })

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Database setup failed:", error)
  } finally {
    await client.close()
  }
}

setupDatabase()
