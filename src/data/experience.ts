export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export const experiences: ExperienceItem[] = [
  {
    role: "[BACKEND / CLOUD ENGINEER ROLE]",
    organization: "[ORGANIZATION / COMPANY / LAB]",
    period: "2023 — Present",
    location: "[LOCATION / REMOTE]",
    summary:
      "[Brief 1-2 sentence description of your core responsibilities, engineering focus, and system ownership.]",
    highlights: [
      "[Architected and maintained RESTful backend microservices with Java/Spring Boot.]",
      "[Implemented event-driven processing pipelines handling asynchronous message broker delivery.]",
      "[Automated containerized deployment pipelines using Docker, GitHub Actions, and AWS infrastructure.]"
    ],
    technologies: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "AWS", "Docker"]
  }
];
