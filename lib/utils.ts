import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format date as MM/DD
export function formatShortDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
  } catch (error) {
    return dateString
  }
}

// Helper function to format date in long format
export function formatLongDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    return dateString
  }
}

// Helper function to group items by year
export function groupByYear(items: any[]) {
  const grouped: Record<string, any[]> = {}

  items.forEach((item) => {
    try {
      const date = new Date(item.date)
      const year = date.getFullYear().toString()

      if (!grouped[year]) {
        grouped[year] = []
      }

      grouped[year].push(item)
    } catch (error) {
      // If date parsing fails, use "Other" as fallback
      if (!grouped["Other"]) {
        grouped["Other"] = []
      }
      grouped["Other"].push(item)
    }
  })

  // Sort years in descending order
  return Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .reduce((result: Record<string, any[]>, year) => {
      result[year] = grouped[year]
      return result
    }, {})
}

// Calculate reading time
export function calculateReadingTime(content: string) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const time = Math.ceil(words / wordsPerMinute)
  return time
}
