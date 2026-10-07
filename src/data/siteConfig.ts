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
  // Replace with your GitHub Pages URL (e.g. "https://username.github.io" or "https://username.github.io/portfolio")
  url: "https://vyomeshshukla.github.io",
  // If deploying to a subdirectory like https://username.github.io/portfolio, set base to "/portfolio"
  // If deploying to a root custom domain or username.github.io repository root, leave as "/"
  base: "/",
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
