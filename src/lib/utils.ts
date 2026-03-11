export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function extractPlainText(jsonContent: string): string {
  if (!jsonContent) return "";
  try {
    const doc = JSON.parse(jsonContent);
    return extractTextFromNode(doc);
  } catch {
    return jsonContent;
  }
}

export function truncateToWords(text: string, count: number): string {
  const words = text.split(/\s+/);
  if (words.length <= count) return text;
  return words.slice(0, count).join(" ") + "...";
}

function extractTextFromNode(node: Record<string, unknown>): string {
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }
  if (Array.isArray(node.content)) {
    return node.content
      .map((child: Record<string, unknown>) => extractTextFromNode(child))
      .join(node.type === "doc" || node.type === "paragraph" ? "\n" : "");
  }
  return "";
}
