export interface BlogItem {
  id: string;
  title: string;
  description: string;
  topic: string;
  date: string;
  readTime?: string;
  url: string;
  platform?: "Personal" | "Medium" | "Hashnode" | "Dev.to" | "GitHub" | "Internal";
}

/**
 * ENGINEERING NOTES & ARTICLES
 * Add your engineering articles, architecture write-ups, or notes here.
 * If this array is empty (i.e. `export const blogs: BlogItem[] = [];`),
 * the UI will automatically render a clean placeholder: "Engineering write-ups coming soon."
 */
export const blogs: BlogItem[] = [
  {
    id: "idempotent-payments",
    title: "Designing Idempotent Payment Systems",
    topic: "Distributed Systems",
    date: "2024",
    readTime: "7 min read",
    description:
      "A technical walkthrough of how idempotency keys and outbox tables prevent duplicate side effects in distributed asynchronous financial workflows.",
    url: "https://example.com/notes/idempotent-payments",
    platform: "Internal"
  },
  {
    id: "kafka-consumer-ordering",
    title: "Preserving Message Ordering at Scale in Kafka",
    topic: "Messaging Architecture",
    date: "2024",
    readTime: "5 min read",
    description:
      "Balancing key-based partition affinity with horizontal consumer concurrency when processing strict sequence domain events.",
    url: "https://example.com/notes/kafka-partition-ordering",
    platform: "Internal"
  }
];
