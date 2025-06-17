import axios from "axios"

export class NewsFetcher {
  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY
    this.googleNewsApiKey = process.env.GOOGLE_NEWS_API_KEY
  }

  async fetchFromNewsAPI(query = "", country = "", language = "en") {
    try {
      const params = {
        apiKey: this.newsApiKey,
        language,
        sortBy: "publishedAt",
        pageSize: 50,
      }

      if (query) params.q = query
      if (country) params.country = country

      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params,
      })

      return response.data.articles.map((article) => ({
        ...article,
        fetchedAt: new Date(),
        source: article.source || { name: "Unknown" },
      }))
    } catch (error) {
      console.error("Error fetching from NewsAPI:", error)
      return []
    }
  }

  async fetchFromGuardian(query = "", section = "") {
    try {
      const params = {
        "api-key": process.env.GUARDIAN_API_KEY,
        "show-fields": "headline,trailText,thumbnail,bodyText",
        "page-size": 50,
        "order-by": "newest",
      }

      if (query) params.q = query
      if (section) params.section = section

      const response = await axios.get("https://content.guardianapis.com/search", {
        params,
      })

      return response.data.response.results.map((article) => ({
        title: article.fields?.headline || article.webTitle,
        description: article.fields?.trailText,
        content: article.fields?.bodyText,
        url: article.webUrl,
        urlToImage: article.fields?.thumbnail,
        publishedAt: article.webPublicationDate,
        source: { name: "The Guardian" },
        fetchedAt: new Date(),
      }))
    } catch (error) {
      console.error("Error fetching from Guardian:", error)
      return []
    }
  }

  async fetchMultipleSources(query = "", region = "global", language = "en") {
    const promises = []

    // Fetch from multiple sources
    promises.push(this.fetchFromNewsAPI(query, this.getCountryCode(region), language))

    if (process.env.GUARDIAN_API_KEY) {
      promises.push(this.fetchFromGuardian(query))
    }

    try {
      const results = await Promise.all(promises)
      return results.flat()
    } catch (error) {
      console.error("Error fetching from multiple sources:", error)
      return []
    }
  }

  getCountryCode(region) {
    const regionMap = {
      us: "us",
      uk: "gb",
      eu: "de",
      asia: "jp",
      global: "",
    }
    return regionMap[region] || ""
  }
}
