"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BiasDetection({ newsData = [] }) {
  const [biasData, setBiasData] = useState({
    overall: { left: 0, center: 0, right: 0 },
    bySource: {},
    byTopic: {},
    examples: [],
  })

  const [selectedSource, setSelectedSource] = useState("all")
  const [selectedView, setSelectedView] = useState("political")

  useEffect(() => {
    if (newsData && newsData.length > 0) {
      const processed = processBiasData(newsData)
      setBiasData(processed)
    }
  }, [newsData])

  const processBiasData = (data) => {
    // This would normally use AI analysis from OpenAI to detect bias
    // For demo purposes, we'll create mock bias data

    // Create mock overall bias distribution
    const overall = {
      left: Math.floor(Math.random() * 30) + 10,
      center: Math.floor(Math.random() * 40) + 30,
      right: Math.floor(Math.random() * 30) + 10,
    }

    // Create mock bias by source
    const bySource = {}
    const sources = [...new Set(data.map((article) => article.source?.name || "Unknown"))]
    sources.forEach((source) => {
      bySource[source] = {
        left: Math.floor(Math.random() * 60) + 10,
        center: Math.floor(Math.random() * 40) + 20,
        right: Math.floor(Math.random() * 60) + 10,
        total: Math.floor(Math.random() * 50) + 10,
      }
    })

    // Create mock bias by topic
    const topics = ["Politics", "Economy", "Technology", "Health", "Environment"]
    const byTopic = {}
    topics.forEach((topic) => {
      byTopic[topic] = {
        left: Math.floor(Math.random() * 60) + 10,
        center: Math.floor(Math.random() * 40) + 20,
        right: Math.floor(Math.random() * 60) + 10,
      }
    })

    // Create mock examples of biased language
    const examples = data.slice(0, 10).map((article) => ({
      title: article.title,
      source: article.source?.name || "Unknown",
      url: article.url,
      biasScore: (Math.random() * 10).toFixed(1),
      biasType: Math.random() > 0.5 ? "left" : "right",
      biasedPhrases: ["controversial decision", "radical proposal", "extreme measures", "failed policy"].slice(
        0,
        Math.floor(Math.random() * 3) + 1,
      ),
    }))

    return { overall, bySource, byTopic, examples }
  }

  const getBiasColor = (type) => {
    switch (type) {
      case "left":
        return "bg-blue-100 text-blue-800"
      case "right":
        return "bg-red-100 text-red-800"
      case "center":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!newsData || newsData.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No bias data available</h3>
        <p className="text-muted-foreground">Search for news articles to analyze bias</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bias Analysis</CardTitle>
            <Tabs value={selectedView} onValueChange={setSelectedView} className="w-[250px]">
              <TabsList>
                <TabsTrigger value="political">Political Bias</TabsTrigger>
                <TabsTrigger value="language">Language Bias</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>Detect and analyze bias in news coverage across sources and regions</CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContent value="political" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Overall Bias Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Left-leaning</span>
                        <span>{biasData.overall.left}%</span>
                      </div>
                      <Progress value={biasData.overall.left} className="h-2 bg-blue-100" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Center/Neutral</span>
                        <span>{biasData.overall.center}%</span>
                      </div>
                      <Progress value={biasData.overall.center} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Right-leaning</span>
                        <span>{biasData.overall.right}%</span>
                      </div>
                      <Progress value={biasData.overall.right} className="h-2 bg-red-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Bias by Source</CardTitle>
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {Object.keys(biasData.bySource).map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(selectedSource === "all"
                      ? Object.entries(biasData.bySource)
                      : [[selectedSource, biasData.bySource[selectedSource]]]
                    ).map(([source, data]) => (
                      <div key={source} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{source}</span>
                          <span className="text-sm text-muted-foreground">{data.total} articles analyzed</span>
                        </div>
                        <div className="flex h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-400"
                            style={{ width: `${data.left}%` }}
                            title={`Left-leaning: ${data.left}%`}
                          />
                          <div
                            className="bg-gray-300"
                            style={{ width: `${data.center}%` }}
                            title={`Center/Neutral: ${data.center}%`}
                          />
                          <div
                            className="bg-red-400"
                            style={{ width: `${data.right}%` }}
                            title={`Right-leaning: ${data.right}%`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="language" className="mt-0">
            <div className="space-y-6">
              <div className="border rounded-md">
                <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-b">
                  <h3 className="font-medium">Examples of Biased Language</h3>
                </div>
                <div className="divide-y">
                  {biasData.examples.slice(0, 5).map((example, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{example.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">Source: {example.source}</p>
                        </div>
                        <Badge className={getBiasColor(example.biasType)}>Bias Score: {example.biasScore}/10</Badge>
                      </div>

                      {example.biasedPhrases.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Potentially biased phrases:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {example.biasedPhrases.map((phrase, i) => (
                              <Badge key={i} variant="outline">
                                "{phrase}"
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Bias by Topic</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(biasData.byTopic).map(([topic, data]) => (
                      <div key={topic} className="space-y-1">
                        <div className="font-medium">{topic}</div>
                        <div className="flex h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-400"
                            style={{ width: `${data.left}%` }}
                            title={`Left-leaning: ${data.left}%`}
                          />
                          <div
                            className="bg-gray-300"
                            style={{ width: `${data.center}%` }}
                            title={`Center/Neutral: ${data.center}%`}
                          />
                          <div
                            className="bg-red-400"
                            style={{ width: `${data.right}%` }}
                            title={`Right-leaning: ${data.right}%`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Left</span>
                          <span>Center</span>
                          <span>Right</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  )
}
