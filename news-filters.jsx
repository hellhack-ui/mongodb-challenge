"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X, Calendar, Tag, TrendingUp } from "lucide-react"

export default function NewsFilters({ filters, setFilters, availableCategories = [], availableSources = [] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSentimentChange = (value) => {
    setFilters((prev) => ({ ...prev, sentimentRange: value }))
  }

  const handleCategoryToggle = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSourceToggle = (source) => {
    setFilters((prev) => ({
      ...prev,
      sources: prev.sources.includes(source) ? prev.sources.filter((s) => s !== source) : [...prev.sources, source],
    }))
  }

  const clearFilters = () => {
    setFilters({
      dateRange: "week",
      sentimentRange: [-1, 1],
      categories: [],
      sources: [],
      biasLevel: "all",
    })
  }

  const activeFiltersCount =
    (filters.categories?.length || 0) +
    (filters.sources?.length || 0) +
    (filters.biasLevel !== "all" ? 1 : 0) +
    (filters.dateRange !== "week" ? 1 : 0)

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filters</CardTitle>
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
          >
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24h</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.biasLevel}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, biasLevel: value }))}
          >
            <SelectTrigger className="w-[140px]">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bias Levels</SelectItem>
              <SelectItem value="low">Low Bias</SelectItem>
              <SelectItem value="medium">Medium Bias</SelectItem>
              <SelectItem value="high">High Bias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Sentiment Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sentiment Range</label>
              <div className="px-2">
                <Slider
                  value={filters.sentimentRange}
                  onValueChange={handleSentimentChange}
                  min={-1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Negative</span>
                  <span>Neutral</span>
                  <span>Very Positive</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            {availableCategories.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={filters.categories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {availableSources.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">News Sources</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSources.slice(0, 12).map((source) => (
                    <Button
                      key={source}
                      variant={filters.sources.includes(source) ? "default" : "outline"}
                      size="sm"
                      className="justify-start text-xs"
                      onClick={() => handleSourceToggle(source)}
                    >
                      {source}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
