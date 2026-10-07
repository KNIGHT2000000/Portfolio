export interface CurrentlyBuildingItem {
  number: string;
  topic: string;
  description: string;
  technologies?: string[];
  status?: string;
}

export const currentlyBuilding: CurrentlyBuildingItem[] = [
  {
    number: "01",
    topic: "Distributed Systems & Event Streaming",
    description:
      "Investigating consumer lag optimization, partition rebalancing strategies, and exactly-once processing semantics using Apache Kafka and Spring Cloud Stream.",
    technologies: ["Apache Kafka", "Java", "Spring Cloud", "Docker"]
  },
  {
    number: "02",
    topic: "Cloud-Native Java & Container Optimization",
    description:
      "Evaluating JVM memory footprint tuning, GraalVM native image compilation, and multi-stage OCI container packaging for reduced cold-start latency.",
    technologies: ["Spring Boot 3", "GraalVM", "Docker", "AWS ECS"]
  },
  {
    number: "03",
    topic: "AI Agent Orchestration & Backend Tooling",
    description:
      "Developing resilient backend runtimes for executing multi-step LLM function calls with deterministic schema validation and timeout recovery.",
    technologies: ["Python", "FastAPI", "Asyncio", "OpenAI / Claude APIs"]
  }
];
