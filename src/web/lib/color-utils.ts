// Generate a consistent color based on a string (category name)
export function generateColorFromString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Generate vibrant colors by using hsl with high saturation and appropriate lightness
  const h = Math.abs(hash % 360)
  const s = 85 // High saturation for vibrant colors
  const l = 60 // Lightness that works well for backgrounds

  return `hsl(${h}, ${s}%, ${l}%)`
}

// Get a darker version of the color for text that will be readable on the background
export function getDarkerColor(color: string): string {
  // Extract HSL values
  const match = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
  if (!match) return "hsl(0, 0%, 20%)"

  const h = Number.parseInt(match[1])
  const s = Number.parseInt(match[2])
  const l = Math.max(Number.parseInt(match[3]) - 40, 15) // Make it darker but not too dark

  return `hsl(${h}, ${s}%, ${l}%)`
}

// Get a lighter version of the color for hover states
export function getLighterColor(color: string): string {
  const match = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
  if (!match) return "hsl(0, 0%, 90%)"

  const h = Number.parseInt(match[1])
  const s = Number.parseInt(match[2])
  const l = Math.min(Number.parseInt(match[3]) + 15, 90) // Make it lighter but not too light

  return `hsl(${h}, ${s}%, ${l}%)`
}

// Get a complementary color (opposite on the color wheel)
export function getComplementaryColor(color: string): string {
  const match = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
  if (!match) return "hsl(180, 85%, 60%)"

  const h = (Number.parseInt(match[1]) + 180) % 360 // Opposite hue
  const s = Number.parseInt(match[2])
  const l = Number.parseInt(match[3])

  return `hsl(${h}, ${s}%, ${l}%)`
}

// Get category icon based on category name
export function getCategoryIcon(category: string): string {
  const categoryMap: Record<string, string> = {
    Electronics: "laptop",
    "Home & Kitchen": "home",
    Clothing: "shirt",
    Books: "book-open",
    Sports: "dumbbell",
    Beauty: "sparkles",
    Toys: "gamepad-2",
    Furniture: "armchair",
  }

  return categoryMap[category] || "package"
}
