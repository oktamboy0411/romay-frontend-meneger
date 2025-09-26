/**
 * Truncates a given text to a specified length and appends ellipsis if it exceeds the limit.
 * @param text - The text to be truncated.
 * @param maxLength - The maximum length of the text before truncation. Default is 30.
 * @returns The truncated text with ellipsis if necessary.
 */
export function truncateText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}
