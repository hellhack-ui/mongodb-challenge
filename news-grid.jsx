"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function NewsGrid({ newsData = [] }) {
  const [expandedArticle, setExpandedArticle] = useState(null)

  if (!newsData || newsData.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No news articles found</h3>
        <p className="text-muted-foreground">Try adjusting your search query or region selection</p>
      </div>
    )
  }

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return "bg-gray-200 text-gray-700"
    if (sentiment > 0.5) return "bg-green-100 text-green-800"
    if (sentiment < -0.5) return "bg-red-100 text-red-800"
    return "bg-yellow-100 text-yellow-800"
  }

  const getSentimentLabel = (sentiment) => {
    if (!sentiment) return "Neutral"
    if (sentiment > 0.5) return "Positive"
    if (sentiment < -0.5) return "Negative"
    return "Neutral"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsData.map((article, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
          {article.urlToImage ? (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={article.urlToImage || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=200&width=400"
                }}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}

          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="truncate">{article.source?.name || "Unknown Source"}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            <p className={`line-clamp-${expandedArticle === index ? "none" : "3"} text-sm`}>
              {article.description || "No description available"}
            </p>
            {article.description && article.description.length > 150 && (
              <Button
                variant="link"
                className="p-0 h-auto text-sm mt-1"
                onClick={() => setExpandedArticle(expandedArticle === index ? null : index)}
              >
                {expandedArticle === index ? "Show less" : "Read more"}
              </Button>
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-2">
            <div className="flex gap-2">
              <Badge variant="outline" className={getSentimentColor(article.sentiment)}>
                {getSentimentLabel(article.sentiment)}
              </Badge>
              {article.isTranslated && <Badge variant="outline">Translated</Badge>}
            </div>

            <Button variant="outline" size="sm" asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Read
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
