"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Simple force-directed graph visualization component
const ForceGraph = ({ nodes, links }) => {
  return (
    <div className="w-full h-[400px] bg-slate-50 dark:bg-slate-900 rounded-md border p-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Interactive topic cluster visualization</p>
        <p className="text-xs text-muted-foreground">
          (This would be an interactive force-directed graph using D3.js or a similar library)
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {nodes.map((node, i) => (
            <Badge key={i} variant={i % 3 === 0 ? "default" : "outline"} className="text-xs">
              {node.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TopicClusters({ newsData = [] }) {
  const [clusterData, setClusterData] = useState({
    nodes: [],
    links: [],
    topTopics: [],
    relatedTopics: {},
  })

  const [selectedTopic, setSelectedTopic] = useState(null)
  const [viewMode, setViewMode] = useState("clusters")

  useEffect(() => {
    if (newsData && newsData.length > 0) {
      const processed = processTopicData(newsData)
      setClusterData(processed)
      if (processed.topTopics.length > 0) {
        setSelectedTopic(processed.topTopics[0].id)
      }
    }
  }, [newsData])

  const processTopicData = (data) => {
    // This would normally use the vector embeddings and clustering from MongoDB
    // For demo purposes, we'll create mock topic clusters

    // Extract keywords from titles and descriptions
    const allText = data.map((article) => `${article.title} ${article.description || ""}`).join(" ")

    // Simple keyword extraction (in a real app, this would use NLP)
    const words = allText
      .toLowerCase()
      .split(/\W+/)
      .filter(
        (word) => word.length > 3 && !["this", "that", "with", "from", "have", "were", "they", "their"].includes(word),
      )

    // Count word frequencies
    const wordCounts = {}
    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })

    // Get top keywords
    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count], index) => ({
        id: `topic-${index}`,
        label: word,
        count,
        size: Math.min(count * 2, 50),
      }))

    // Create mock nodes and links for visualization
    const nodes = topKeywords.map((keyword) => ({
      id: keyword.id,
      label: keyword.label,
      size: keyword.size,
    }))

    // Create some mock links between nodes
    const links = []
    for (let i = 0; i < nodes.length; i++) {
      const numLinks = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numLinks; j++) {
        const target = Math.floor(Math.random() * nodes.length)
        if (i !== target) {
          links.push({
            source: nodes[i].id,
            target: nodes[target].id,
            strength: Math.random() * 0.5 + 0.5,
          })
        }
      }
    }

    // Create mock related topics
    const relatedTopics = {}
    topKeywords.forEach((keyword) => {
      relatedTopics[keyword.id] = topKeywords
        .filter((k) => k.id !== keyword.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map((k) => k.label)
    })

    return {
      nodes,
      links,
      topTopics: topKeywords.slice(0, 10),
      relatedTopics,
    }
  }

  const getRelatedArticles = (topic) => {
    // In a real app, this would query MongoDB for articles related to the topic
    // For demo purposes, we'll filter articles that might contain the topic
    const topicLabel = clusterData.nodes.find((node) => node.id === topic)?.label || ""

    return newsData
      .filter(
        (article) =>
          article.title?.toLowerCase().includes(topicLabel) || article.description?.toLowerCase().includes(topicLabel),
      )
      .slice(0, 5)
  }

  if (!newsData || newsData.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No topic data available</h3>
        <p className="text-muted-foreground">Search for news articles to analyze topics</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Topic Clusters</CardTitle>
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
              <TabsList>
                <TabsTrigger value="clusters">Clusters</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>Discover how news topics are connected and clustered</CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContent value="clusters" className="mt-0">
            <ForceGraph nodes={clusterData.nodes} links={clusterData.links} />
          </TabsContent>
          <TabsContent value="list" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {clusterData.topTopics.map((topic) => (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? "default" : "outline"}
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{topic.label}</div>
                    <div className="text-xs text-muted-foreground">{topic.count} mentions</div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Card>

      {selectedTopic && (
        <>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Related Articles: {clusterData.nodes.find((n) => n.id === selectedTopic)?.label}</CardTitle>
              <CardDescription>News articles related to this topic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRelatedArticles(selectedTopic).map((article, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <h4 className="font-medium">{article.title}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">
                        {article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <Button variant="link" size="sm" asChild className="p-0 h-auto">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          Read article
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}

                {getRelatedArticles(selectedTopic).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No related articles found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Topics</CardTitle>
              <CardDescription>Topics frequently mentioned together</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {clusterData.relatedTopics[selectedTopic]?.map((topic, index) => (
                  <Badge key={index} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
