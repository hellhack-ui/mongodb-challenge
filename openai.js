// Function to generate embeddings for vector search
export async function getEmbedding(text) {
  try {
    // In a real application, this would call OpenAI's embedding API
    // For demo purposes, we'll return a mock embedding
    return [0.1, 0.2, 0.3, 0.4, 0.5]
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw error
  }
}

