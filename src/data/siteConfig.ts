export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  base?: string;
  author: string;
  role: string;
  keywords: string[];
  locale: string;
}

export const siteConfig: SiteConfig = {
  title: "Vyomesh Shukla | Backend & Cloud Systems Engineer",
  description:
    "Portfolio of a Backend & Cloud Engineer specializing in distributed systems, cloud-native architecture, Java / Spring Boot, Python, messaging infrastructure, and resilient APIs.",
  // GitHub Pages URL for repository KNIGHT2000000/Portfolio
  url: "https://knight2000000.github.io",
  // Base repository path for GitHub Pages
  base: "/Portfolio",
  author: "Vyomesh Shukla",
  role: "Backend & Cloud Engineer",
  keywords: [
    "Backend Engineer",
    "Cloud Engineer",
    "Distributed Systems",
    "DevOps",
    "Java",
    "Spring Boot",
    "Python",
    "Microservices",
    "Kafka",
    "AWS",
    "Docker",
    "Kubernetes",
    "System Design"
  ],
  locale: "en-US"
};
