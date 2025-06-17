import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export class AIAnalyzer {
  async analyzeSentiment(text) {
    try {
      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze the sentiment of the following text. Return a JSON object with a 'score' property between -1 (very negative) and 1 (very positive), and a 'summary' property with a brief explanation.

Text: "${text}"

Return only valid JSON.`,
      })

      return JSON.parse(result)
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      return { score: 0, summary: "Unable to analyze sentiment" }
    }
  }

  async detectBias(text) {
    try {
      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze the political bias in the following text. Return a JSON object with:
- 'bias' property (left, center, or right)
- 'score' property between 0 and 10 indicating strength of bias
- 'biasedPhrases' array containing potentially biased phrases
- 'explanation' string explaining the bias assessment

Text: "${text}"

Return only valid JSON.`,
      })

      return JSON.parse(result)
    } catch (error) {
      console.error("Error detecting bias:", error)
      return {
        bias: "center",
        score: 0,
        biasedPhrases: [],
        explanation: "Unable to analyze bias",
      }
    }
  }

  async extractTopics(text) {
    try {
      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Extract the main topics from the following text. Return a JSON object with:
- 'topics' array containing the main topics
- 'keywords' array containing relevant keywords
- 'categories' array containing news categories

Text: "${text}"

Return only valid JSON.`,
      })

      return JSON.parse(result)
    } catch (error) {
      console.error("Error extracting topics:", error)
      return {
        topics: [],
        keywords: [],
        categories: ["General"],
      }
    }
  }

  async generateEmbedding(text) {
    try {
      // In a real implementation, you would use OpenAI's embedding API
      // For now, we'll return a mock embedding
      const words = text
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 3)
      const embedding = new Array(1536).fill(0)

      // Simple hash-based embedding simulation
      words.forEach((word, index) => {
        const hash = this.simpleHash(word)
        embedding[hash % 1536] += 1 / (index + 1)
      })

      return embedding
    } catch (error) {
      console.error("Error generating embedding:", error)
      return new Array(1536).fill(0)
    }
  }

  simpleHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}
