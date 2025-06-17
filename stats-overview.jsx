"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Globe, Users, BarChart3, AlertTriangle } from "lucide-react"

export default function StatsOverview({ newsData = [] }) {
  // Calculate statistics from news data
  const totalArticles = newsData.length
  const positiveArticles = newsData.filter((article) => article.sentiment > 0.3).length
  const negativeArticles = newsData.filter((article) => article.sentiment < -0.3).length
  const neutralArticles = totalArticles - positiveArticles - negativeArticles

  const uniqueSources = [...new Set(newsData.map((article) => article.source?.name))].length
  const avgSentiment =
    newsData.length > 0
      ? (newsData.reduce((sum, article) => sum + (article.sentiment || 0), 0) / newsData.length).toFixed(2)
      : 0

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles.toLocaleString(),
      description: "Articles analyzed today",
      icon: Globe,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "News Sources",
      value: uniqueSources.toString(),
      description: "Active news sources",
      icon: Users,
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Avg Sentiment",
      value: avgSentiment,
      description: "Overall sentiment score",
      icon: BarChart3,
      trend: avgSentiment > 0 ? "Positive" : "Negative",
      trendUp: avgSentiment > 0,
    },
    {
      title: "Bias Alerts",
      value: Math.floor(totalArticles * 0.15).toString(),
      description: "High bias detected",
      icon: AlertTriangle,
      trend: "-5%",
      trendUp: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Badge
                variant="outline"
                className={`text-xs ${
                  stat.trendUp ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
                }`}
              >
                {stat.trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
