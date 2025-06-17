import { MongoClient } from "mongodb"

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(process.env.MONGODB_URI)
  clientPromise = client.connect()
}

export default clientPromise

export class DatabaseManager {
  constructor() {
    this.clientPromise = clientPromise
  }

  async getDatabase() {
    const client = await this.clientPromise
    return client.db("news_insights")
  }

  async saveArticle(article) {
    try {
      const db = await this.getDatabase()
      const collection = db.collection("articles")

      // Check if article already exists
      const existing = await collection.findOne({ url: article.url })
      if (existing) {
        return existing
      }

      const result = await collection.insertOne({
        ...article,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return { ...article, _id: result.insertedId }
    } catch (error) {
      console.error("Error saving article:", error)
      throw error
    }
  }

  async getArticles(filters = {}) {
    try {
      const db = await this.getDatabase()
      const collection = db.collection("articles")

      const query = {}

      if (filters.query) {
        query.$text = { $search: filters.query }
      }

      if (filters.region && filters.region !== "global") {
        query.region = filters.region
      }

      if (filters.language) {
        query.language = filters.language
      }

      if (filters.sentiment) {
        query.sentiment = {
          $gte: filters.sentiment[0],
          $lte: filters.sentiment[1],
        }
      }

      if (filters.categories && filters.categories.length > 0) {
        query.categories = { $in: filters.categories }
      }

      const articles = await collection
        .find(query)
        .sort({ publishedAt: -1 })
        .limit(filters.limit || 50)
        .toArray()

      return articles
    } catch (error) {
      console.error("Error getting articles:", error)
      throw error
    }
  }

  async vectorSearch(queryVector, limit = 20) {
    try {
      const db = await this.getDatabase()
      const collection = db.collection("articles")

      // MongoDB Atlas Vector Search
      const pipeline = [
        {
          $vectorSearch: {
            index: "news_vector_index",
            path: "vector",
            queryVector: queryVector,
            numCandidates: 100,
            limit: limit,
          },
        },
      ]

      const results = await collection.aggregate(pipeline).toArray()
      return results
    } catch (error) {
      console.error("Vector search not available:", error)
      // Fallback to regular search
      return await this.getArticles({ limit })
    }
  }
}
