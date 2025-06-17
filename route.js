import { NextResponse } from "next/server"

// Mock data for demonstration purposes
const mockNewsData = [
  {
    title: "Global Tech Giants Announce AI Ethics Coalition",
    description:
      "Leading technology companies have formed a coalition to establish ethical guidelines for artificial intelligence development and deployment.",
    content:
      "In a landmark move, major tech companies including Google, Microsoft, and OpenAI have announced the formation of a global coalition focused on establishing ethical guidelines for AI development...",
    url: "https://example.com/tech-ai-ethics",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-15T09:30:00Z",
    source: { id: "tech-daily", name: "Tech Daily" },
    sentiment: 0.6,
    categories: ["Technology", "AI", "Ethics"],
    vector: [0.1, 0.2, 0.3, 0.4], // Mock vector embedding
  },
  {
    title: "Climate Change Accelerating Faster Than Previously Predicted",
    description:
      "New research suggests that climate change effects are occurring at a more rapid pace than scientists had previously estimated.",
    content:
      "A comprehensive study published in Nature Climate Change indicates that global warming is accelerating at a rate approximately 15% faster than previous models predicted...",
    url: "https://example.com/climate-change-acceleration",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-14T14:45:00Z",
    source: { id: "science-today", name: "Science Today" },
    sentiment: -0.7,
    categories: ["Environment", "Climate", "Research"],
    vector: [0.2, 0.3, 0.4, 0.5], // Mock vector embedding
  },
  {
    title: "Global Economy Shows Signs of Recovery Post-Pandemic",
    description:
      "Economic indicators suggest a stronger than expected recovery in global markets following the COVID-19 pandemic.",
    content:
      "According to the latest IMF report, global economic growth is projected to reach 5.5% in 2023, surpassing earlier forecasts...",
    url: "https://example.com/economy-recovery",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-13T11:20:00Z",
    source: { id: "financial-times", name: "Financial Times" },
    sentiment: 0.8,
    categories: ["Economy", "Markets", "Post-Pandemic"],
    vector: [0.3, 0.4, 0.5, 0.6], // Mock vector embedding
  },
  {
    title: "Healthcare Innovation Summit Highlights AI Diagnostic Tools",
    description:
      "The annual Healthcare Innovation Summit showcased breakthrough AI-powered diagnostic technologies that promise to transform patient care.",
    content:
      "This year's Healthcare Innovation Summit featured demonstrations of several AI-powered diagnostic tools that can detect diseases with accuracy rates exceeding 95%...",
    url: "https://example.com/healthcare-ai-summit",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-12T16:10:00Z",
    source: { id: "health-news", name: "Health News Network" },
    sentiment: 0.5,
    categories: ["Healthcare", "AI", "Innovation"],
    vector: [0.4, 0.5, 0.6, 0.7], // Mock vector embedding
  },
  {
    title: "Political Tensions Rise in Eastern Europe",
    description:
      "Diplomatic relations deteriorate as neighboring countries engage in border disputes and economic sanctions.",
    content:
      "Political analysts are concerned about the escalating tensions between several Eastern European nations as border disputes and economic sanctions threaten regional stability...",
    url: "https://example.com/eastern-europe-tensions",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-11T08:50:00Z",
    source: { id: "world-politics", name: "World Politics Journal" },
    sentiment: -0.6,
    categories: ["Politics", "International Relations", "Europe"],
    vector: [0.5, 0.6, 0.7, 0.8], // Mock vector embedding
  },
  {
    title: "Renewable Energy Investments Reach Record High",
    description:
      "Global investments in renewable energy sources have surpassed fossil fuels for the first time in history.",
    content:
      "According to a new report by the International Energy Agency, global investments in renewable energy reached $366 billion in 2022, exceeding fossil fuel investments for the first time...",
    url: "https://example.com/renewable-energy-investments",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-10T13:15:00Z",
    source: { id: "energy-monitor", name: "Energy Monitor" },
    sentiment: 0.9,
    categories: ["Energy", "Environment", "Investment"],
    vector: [0.6, 0.7, 0.8, 0.9], // Mock vector embedding
  },
  {
    title: "New Study Links Social Media Use to Decreased Mental Health in Teens",
    description:
      "Research finds correlation between heavy social media usage and increased rates of depression and anxiety among teenagers.",
    content:
      "A comprehensive study published in the Journal of Adolescent Health has found a significant correlation between heavy social media usage and increased rates of depression and anxiety among teenagers...",
    url: "https://example.com/social-media-mental-health",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-09T10:40:00Z",
    source: { id: "health-journal", name: "Health Journal" },
    sentiment: -0.5,
    categories: ["Mental Health", "Social Media", "Teenagers"],
    vector: [0.7, 0.8, 0.9, 1.0], // Mock vector embedding
  },
  {
    title: "Space Tourism Company Announces First Civilian Lunar Mission",
    description: "A private space company has revealed plans to send civilians on a journey around the moon by 2025.",
    content:
      "In a groundbreaking announcement, SpaceVenture has revealed plans to send a group of civilian passengers on a journey around the moon by 2025, marking a significant milestone in space tourism...",
    url: "https://example.com/space-tourism-lunar",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-08T15:30:00Z",
    source: { id: "space-news", name: "Space News Today" },
    sentiment: 0.7,
    categories: ["Space", "Tourism", "Technology"],
    vector: [0.8, 0.9, 1.0, 0.1], // Mock vector embedding
  },
  {
    title: "Global Food Security Index Shows Alarming Decline",
    description:
      "The latest Global Food Security Index reveals a concerning downward trend in food security across multiple regions.",
    content:
      "The 2023 Global Food Security Index, published by the World Food Organization, shows a concerning decline in food security across multiple regions, with climate change and geopolitical conflicts cited as primary factors...",
    url: "https://example.com/food-security-decline",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-07T09:20:00Z",
    source: { id: "global-issues", name: "Global Issues Monitor" },
    sentiment: -0.8,
    categories: ["Food Security", "Global Issues", "Climate"],
    vector: [0.9, 1.0, 0.1, 0.2], // Mock vector embedding
  },
  {
    title: "Breakthrough in Quantum Computing Achieves Quantum Supremacy",
    description:
      "Scientists have developed a quantum computer that can perform calculations beyond the capabilities of traditional supercomputers.",
    content:
      "Researchers at the Quantum Technology Institute have announced a breakthrough in quantum computing, developing a 128-qubit quantum processor that has achieved quantum supremacy by solving problems impossible for conventional supercomputers...",
    url: "https://example.com/quantum-computing-breakthrough",
    urlToImage: "/placeholder.svg?height=400&width=600",
    publishedAt: "2023-06-06T14:05:00Z",
    source: { id: "tech-innovations", name: "Tech Innovations" },
    sentiment: 0.8,
    categories: ["Technology", "Quantum Computing", "Science"],
    vector: [1.0, 0.1, 0.2, 0.3], // Mock vector embedding
  },
]

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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""
  const region = searchParams.get("region") || "global"
  const language = searchParams.get("language") || "en"

  try {
    // In a real application, we would connect to MongoDB and use vector search
    // const client = await clientPromise;
    // const db = client.db('news_insights');
    // const collection = db.collection('articles');

    // Filter news based on query, region, and language
    let filteredNews = [...mockNewsData]

    // Apply search query if provided
    if (query) {
      const queryLower = query.toLowerCase()
      filteredNews = filteredNews.filter(
        (article) =>
          article.title.toLowerCase().includes(queryLower) || article.description?.toLowerCase().includes(queryLower),
      )
    }

    // Apply region filter (in a real app, this would be more sophisticated)
    if (region !== "global") {
      // Mock region filtering - in a real app, this would use actual region data
      filteredNews = filteredNews.filter((_, index) => index % 3 !== 0)
    }

    // Apply language filter (in a real app, this would use actual language detection)
    if (language !== "en") {
      // Mock translation - in a real app, this would use Google Translate API
      filteredNews = filteredNews.map((article) => ({
        ...article,
        title: `[Translated] ${article.title}`,
        description: article.description ? `[Translated] ${article.description}` : null,
        isTranslated: true,
      }))
    }

    // In a real app, we would use MongoDB's vector search for semantic search
    // if (query) {
    //   const embedding = await getEmbedding(query); // This would call OpenAI to get embeddings
    //   const vectorSearchResults = await collection.aggregate([
    //     {
    //       $vectorSearch: {
    //         index: "news_vector_index",
    //         path: "vector",
    //         queryVector: embedding,
    //         numCandidates: 100,
    //         limit: 20
    //       }
    //     }
    //   ]).toArray();
    //
    //   filteredNews = vectorSearchResults;
    // }

    return NextResponse.json(filteredNews)
  } catch (error) {
    console.error("Error fetching news data:", error)
    return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 })
  }
}
