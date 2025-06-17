const { MongoClient } = require("mongodb")
require("dotenv").config({ path: ".env.local" })

const sampleArticles = [
  {
    title: "Global Tech Giants Announce AI Ethics Coalition",
    description:
      "Leading technology companies have formed a coalition to establish ethical guidelines for artificial intelligence development and deployment.",
    content:
      "In a landmark move, major tech companies including Google, Microsoft, and OpenAI have announced the formation of a global coalition focused on establishing ethical guidelines for AI development...",
    url: "https://example.com/tech-ai-ethics",
    urlToImage: "https://via.placeholder.com/600x400?text=AI+Ethics",
    publishedAt: new Date("2023-06-15T09:30:00Z"),
    source: { id: "tech-daily", name: "Tech Daily" },
    sentiment: 0.6,
    categories: ["Technology", "AI", "Ethics"],
    vector: [0.1, 0.2, 0.3, 0.4, 0.5], // Mock vector embedding
    region: "global",
    language: "en",
    biasScore: 0.2,
    reliability: 0.9,
  },
  {
    title: "Climate Change Accelerating Faster Than Previously Predicted",
    description:
      "New research suggests that climate change effects are occurring at a more rapid pace than scientists had previously estimated.",
    content:
      "A comprehensive study published in Nature Climate Change indicates that global warming is accelerating at a rate approximately 15% faster than previous models predicted...",
    url: "https://example.com/climate-change-acceleration",
    urlToImage: "https://via.placeholder.com/600x400?text=Climate+Change",
    publishedAt: new Date("2023-06-14T14:45:00Z"),
    source: { id: "science-today", name: "Science Today" },
    sentiment: -0.7,
    categories: ["Environment", "Climate", "Research"],
    vector: [0.2, 0.3, 0.4, 0.5, 0.6],
    region: "global",
    language: "en",
    biasScore: 0.1,
    reliability: 0.95,
  },
  {
    title: "Global Economy Shows Signs of Recovery Post-Pandemic",
    description:
      "Economic indicators suggest a stronger than expected recovery in global markets following the COVID-19 pandemic.",
    content:
      "According to the latest IMF report, global economic growth is projected to reach 5.5% in 2023, surpassing earlier forecasts...",
    url: "https://example.com/economy-recovery",
    urlToImage: "https://via.placeholder.com/600x400?text=Economy+Recovery",
    publishedAt: new Date("2023-06-13T11:20:00Z"),
    source: { id: "financial-times", name: "Financial Times" },
    sentiment: 0.8,
    categories: ["Economy", "Markets", "Post-Pandemic"],
    vector: [0.3, 0.4, 0.5, 0.6, 0.7],
    region: "global",
    language: "en",
    biasScore: 0.3,
    reliability: 0.88,
  },
]

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("news_insights")
    const articlesCollection = db.collection("articles")

    // Clear existing data
    await articlesCollection.deleteMany({})
    console.log("Cleared existing articles")

    // Insert sample data
    const result = await articlesCollection.insertMany(sampleArticles)
    console.log(`Inserted ${result.insertedCount} sample articles`)

    // Create sample sources
    const sourcesCollection = db.collection("sources")
    await sourcesCollection.deleteMany({})

    const sampleSources = [
      { id: "tech-daily", name: "Tech Daily", reliability: 0.9, bias: "center" },
      { id: "science-today", name: "Science Today", reliability: 0.95, bias: "center" },
      { id: "financial-times", name: "Financial Times", reliability: 0.88, bias: "center-right" },
    ]

    await sourcesCollection.insertMany(sampleSources)
    console.log("Inserted sample sources")

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Database seeding failed:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
