"use client"

import type React from "react"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrendingTopicsProps {
  topics: string[]
  onTopicClick: (topic: string) => void
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics, onTopicClick }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-medium">Tópicos em Alta</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="rounded-full hover:bg-orange-50 hover:text-orange-700"
            onClick={() => onTopicClick(topic)}
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default TrendingTopics
