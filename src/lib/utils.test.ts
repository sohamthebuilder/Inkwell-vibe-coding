import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDate, truncateText, extractPlainText, truncateToWords } from "./utils";

describe("formatDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Just now' for timestamps less than 1 minute ago", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    expect(formatDate(now - 30_000)).toBe("Just now");
  });

  it("returns 'Xm ago' for timestamps within the last hour", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    expect(formatDate(now - 5 * 60_000)).toBe("5m ago");
    expect(formatDate(now - 59 * 60_000)).toBe("59m ago");
  });

  it("returns 'Xh ago' for timestamps within the last 24 hours", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    expect(formatDate(now - 2 * 3600_000)).toBe("2h ago");
    expect(formatDate(now - 23 * 3600_000)).toBe("23h ago");
  });

  it("returns 'Xd ago' for timestamps within the last 7 days", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    expect(formatDate(now - 3 * 86400_000)).toBe("3d ago");
  });

  it("returns formatted date for older timestamps", () => {
    const now = new Date("2025-03-11T12:00:00Z");
    vi.setSystemTime(now);
    const older = new Date("2025-03-01T12:00:00Z");
    expect(formatDate(older.getTime())).toMatch(/Mar\s+1/);
  });

  it("includes year when different from current year", () => {
    const now = new Date("2025-03-11T12:00:00Z");
    vi.setSystemTime(now);
    const older = new Date("2024-12-01T12:00:00Z");
    expect(formatDate(older.getTime())).toMatch(/2024/);
  });
});

describe("truncateText", () => {
  it("returns full text when length is within maxLength", () => {
    const text = "Hello world";
    expect(truncateText(text, 20)).toBe("Hello world");
    expect(truncateText(text, 11)).toBe("Hello world");
  });

  it("truncates text and adds ellipsis when exceeding maxLength", () => {
    const text = "Hello world";
    expect(truncateText(text, 5)).toBe("Hello...");
  });

  it("trims trailing whitespace before adding ellipsis", () => {
    const text = "Hello world foo bar";
    expect(truncateText(text, 11)).toBe("Hello world...");
  });

  it("handles empty string", () => {
    expect(truncateText("", 10)).toBe("");
  });
});

describe("extractPlainText", () => {
  it("returns empty string for empty input", () => {
    expect(extractPlainText("")).toBe("");
  });

  it("extracts text from simple TipTap JSON", () => {
    const doc = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello world" }],
        },
      ],
    });
    expect(extractPlainText(doc)).toBe("Hello world");
  });

  it("extracts text from multiple paragraphs with newlines", () => {
    const doc = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "First" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Second" }],
        },
      ],
    });
    expect(extractPlainText(doc)).toBe("First\nSecond");
  });

  it("returns original string when JSON is invalid", () => {
    const invalid = "not valid json";
    expect(extractPlainText(invalid)).toBe("not valid json");
  });

  it("handles nested content (paragraph joins text siblings with newline)", () => {
    const doc = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hello " },
            { type: "text", text: "world" },
          ],
        },
      ],
    });
    // Paragraph joins child text nodes with newline per implementation
    expect(extractPlainText(doc)).toBe("Hello \nworld");
  });

  it("handles empty doc", () => {
    const doc = JSON.stringify({ type: "doc", content: [] });
    expect(extractPlainText(doc)).toBe("");
  });
});

describe("truncateToWords", () => {
  it("returns full text when word count is within limit", () => {
    expect(truncateToWords("Hello world", 5)).toBe("Hello world");
    expect(truncateToWords("One two three", 3)).toBe("One two three");
  });

  it("truncates to specified word count and adds ellipsis", () => {
    expect(truncateToWords("Hello world foo bar", 2)).toBe("Hello world...");
    expect(truncateToWords("One two three four five", 3)).toBe("One two three...");
  });

  it("handles empty string", () => {
    expect(truncateToWords("", 5)).toBe("");
  });

  it("handles single word", () => {
    expect(truncateToWords("Hello", 1)).toBe("Hello");
  });
});
