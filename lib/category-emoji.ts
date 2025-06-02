export function getCategoryEmoji(category: string): string {
  switch (category.toLowerCase()) {
    case "gym":
      return "🤸";
    case "basket":
      return "🏀";
    case "tennis":
      return "🎾";
    case "bowling":
      return "🎳";
    case "vtt":
      return "🚵‍♂️";
    default:
      return "🏅";
  }
}