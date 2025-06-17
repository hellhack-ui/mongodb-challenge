"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, BarChart2, TrendingUp, AlertTriangle } from "lucide-react"
import Header from "@/components/header"
import StatsOverview from "@/components/stats-overview"
import NewsFilters from "@/components/news-filters"
import RealTimeFeed from "@/components/real-time-feed"
import NewsGrid from "@/components/news-grid"
import SentimentAnalysis from "@/components/sentiment-analysis"
import TopicClusters from "@/components/topic-clusters"
import BiasDetection from "@/components/bias-detection"
import RegionSelector from "@/components/region-selector"
import LanguageSelector from "@/components/language-selector"
import LoadingState from "@/components/loading-state"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("global")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [newsData, setNewsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("news")
  const [filters, setFilters] = useState({
    dateRange: "week",
    sentimentRange: [-1, 1],
    categories: [],
    sources: [],
    biasLevel: "all",
  })

  useEffect(() => {
    // Initial data fetch
    fetchNewsData()
  }, [selectedRegion, selectedLanguage])

  const fetchNewsData = async (query = "") => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/news?query=${query}&region=${selectedRegion}&language=${selectedLanguage}`)
      const data = await response.json()
      setNewsData(data)
    } catch (error) {
      console.error("Error fetching news data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    fetchNewsData(query)
  }

  // Extract available categories and sources for filters
  const availableCategories = [...new Set(newsData.flatMap((article) => article.categories || []))]
  const availableSources = [...new Set(newsData.map((article) => article.source?.name).filter(Boolean))]

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Global News Intelligence</h2>
            <p className="text-muted-foreground">
              AI-powered analysis of global news sentiment, topics, and bias detection
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <RegionSelector selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview newsData={newsData} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <NewsFilters
              filters={filters}
              setFilters={setFilters}
              availableCategories={availableCategories}
              availableSources={availableSources}
            />

            <Tabs defaultValue="news" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="news">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">News Feed</span>
                </TabsTrigger>
                <TabsTrigger value="sentiment">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sentiment</span>
                </TabsTrigger>
                <TabsTrigger value="topics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Topics</span>
                </TabsTrigger>
                <TabsTrigger value="bias">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Bias</span>
                </TabsTrigger>
              </TabsList>

              {isLoading ? (
                <LoadingState />
              ) : (
                <>
                  <TabsContent value="news">
                    <NewsGrid newsData={newsData} />
                  </TabsContent>

                  <TabsContent value="sentiment">
                    <SentimentAnalysis newsData={newsData} />
                  </TabsContent>

                  <TabsContent value="topics">
                    <TopicClusters newsData={newsData} />
                  </TabsContent>

                  <TabsContent value="bias">
                    <BiasDetection newsData={newsData} />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RealTimeFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
