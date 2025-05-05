import type React from "react"

import { Star } from "lucide-react"

interface StarRatingProps {
  averageRating?: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: "sm" | "md" | "lg"
}

const StarRating: React.FC<StarRatingProps> = ({
  averageRating = 0,
  onRatingChange,
  interactive = false,
  size = "md",
}) => {
  const stars = [1, 2, 3, 4, 5]

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-6 h-6"
      default:
        return "w-5 h-5"
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`${getSizeClass()} ${
            star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
          } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
        />
      ))}
      <span className="text-sm text-gray-500 ml-2">({averageRating?.toFixed(1) || "0"}/5)</span>
    </div>
  )
}

export default StarRating
