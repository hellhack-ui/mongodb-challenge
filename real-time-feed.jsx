"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, ExternalLink, Zap, Pause, Play } from "lucide-react"

export default function RealTimeFeed() {
  const [isLive, setIsLive] = useState(true)
  const [updates, setUpdates] = useState([])

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(
      () => {
        const mockUpdate = {
          id: Date.now(),
          title: generateMockTitle(),
          source: generateMockSource(),
          timestamp: new Date(),
          sentiment: (Math.random() - 0.5) * 2,
          isBreaking: Math.random() > 0.8,
          category: generateMockCategory(),
        }

        setUpdates((prev) => [mockUpdate, ...prev.slice(0, 19)]) // Keep last 20 updates
      },
      3000 + Math.random() * 7000,
    ) // Random interval between 3-10 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const generateMockTitle = () => {
    const titles = [
      "Breaking: Major Economic Policy Announced",
      "Tech Giants Report Quarterly Earnings",
      "Climate Summit Reaches New Agreement",
      "Healthcare Innovation Shows Promise",
      "Global Markets React to Policy Changes",
      "New Research Reveals Surprising Findings",
      "International Relations Update",
      "Energy Sector Sees Major Investment",
      "Education Reform Proposal Unveiled",
      "Transportation Infrastructure Update",
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  const generateMockSource = () => {
    const sources = ["Reuters", "AP News", "BBC", "CNN", "Financial Times", "The Guardian", "Wall Street Journal"]
    return sources[Math.floor(Math.random() * sources.length)]
  }

  const generateMockCategory = () => {
    const categories = ["Politics", "Economy", "Technology", "Health", "Environment", "Sports", "Entertainment"]
    return categories[Math.floor(Math.random() * categories.length)]
  }

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.3) return "text-green-600"
    if (sentiment < -0.3) return "text-red-600"
    return "text-yellow-600"
  }

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.3) return "Positive"
    if (sentiment < -0.3) return "Negative"
    return "Neutral"
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <CardTitle className="text-base">Live News Feed</CardTitle>
            {isLive && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsLive(!isLive)}>
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>Real-time news updates with sentiment analysis</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6">
          <div className="space-y-4 pb-4">
            {updates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isLive ? "Waiting for live updates..." : "Live feed paused"}
              </div>
            ) : (
              updates.map((update) => (
                <div
                  key={update.id}
                  className="border-l-2 border-muted pl-4 pb-4 last:pb-0 relative animate-in slide-in-from-top-2 duration-300"
                >
                  {update.isBreaking && (
                    <Badge className="absolute -left-2 top-0 bg-red-500 text-white text-xs">BREAKING</Badge>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight mb-1">{update.title}</h4>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{update.source}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {update.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {update.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getSentimentColor(update.sentiment)}`}>
                          {getSentimentLabel(update.sentiment)}
                        </Badge>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="shrink-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
