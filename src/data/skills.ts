export interface EngineeringFocusArea {
  id: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface TechnologyGroup {
  category: string;
  description: string;
  items: {
    name: string;
    level?: string; // e.g. "Primary", "Working Knowledge" — no fake percentages!
    concepts: string[];
  }[];
}

export interface CoreCompetency {
  title: string;
  description: string;
  keyPractices: string[];
}

// 4-6 Focus Cards shown on Homepage
export const engineeringFocusAreas: EngineeringFocusArea[] = [
  {
    id: "backend",
    title: "Backend Engineering",
    summary:
      "Designing resilient REST & RPC services, robust error handling, concurrency control, and clean modular domain architecture.",
    tags: ["Java", "Spring Boot", "Python", "FastAPI", "REST APIs", "gRPC"]
  },
  {
    id: "distributed",
    title: "Distributed Systems",
    summary:
      "Designing asynchronous, event-driven architectures with partitioned message streams, idempotent workflows, and outbox patterns.",
    tags: ["Apache Kafka", "RabbitMQ", "Event-Driven", "Idempotency", "Outbox Pattern"]
  },
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    summary:
      "Automating reproducible cloud environments, containerizing services, and provisioning infrastructure through declarative code.",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform", "CloudFormation"]
  },
  {
    id: "data",
    title: "Databases & Caching",
    summary:
      "Schema modeling, relational indexing, transaction isolation levels, query tuning, and distributed cache topologies.",
    tags: ["PostgreSQL", "MySQL", "Redis", "Connection Pooling", "Data Modeling"]
  },
  {
    id: "devops",
    title: "DevOps & Systems",
    summary:
      "Constructing resilient CI/CD pipelines, container build caching, Linux system administration, and automated test runners.",
    tags: ["GitHub Actions", "CI/CD", "Linux / Bash", "systemd", "Prometheus"]
  },
  {
    id: "ai-backend",
    title: "AI + Backend Systems",
    summary:
      "Building backend services that integrate LLMs, tool-use execution runtimes, structured outputs, and asynchronous agent orchestration.",
    tags: ["Python", "FastAPI", "LLM APIs", "Structured Outputs", "Vector Indexing"]
  }
];

// Comprehensive grouped technology stack for /engineering page
export const technologyGroups: TechnologyGroup[] = [
  {
    category: "Backend & Systems Languages",
    description: "Languages and runtimes used for building reliable services and concurrent workloads.",
    items: [
      {
        name: "Java",
        concepts: ["JVM Internals", "Multithreading", "Concurrency Utilities", "Spring Framework ecosystem"]
      },
      {
        name: "Spring Boot",
        concepts: ["Spring Web", "Spring Data JPA", "Spring Security", "Actuator Metrics", "Kafka Integration"]
      },
      {
        name: "Python",
        concepts: ["Asyncio", "FastAPI", "Pydantic validation", "Multiprocessing", "Scientific ecosystem"]
      },
      {
        name: "SQL & Query Languages",
        concepts: ["Complex Joins", "Execution Plan Analysis", "Window Functions", "Index Strategies"]
      }
    ]
  },
  {
    category: "Cloud & Infrastructure",
    description: "Cloud primitives and container orchestration for resilient production runtime environments.",
    items: [
      {
        name: "AWS",
        concepts: ["EC2", "S3", "VPC Networking", "IAM Security Policies", "RDS", "ECS"]
      },
      {
        name: "Docker & Containerization",
        concepts: ["Multi-stage builds", "Layer optimization", "Container security", "Non-root execution"]
      },
      {
        name: "Kubernetes",
        concepts: ["Deployments", "Services", "ConfigMaps & Secrets", "Ingress", "Resource quotas"]
      },
      {
        name: "Terraform",
        concepts: ["State management", "Reusable modules", "Infrastructure as Code", "Drift detection"]
      }
    ]
  },
  {
    category: "Databases & Storage Topologies",
    description: "Persistent storage engines, caching tiers, and data integrity enforcement.",
    items: [
      {
        name: "PostgreSQL",
        concepts: ["ACID compliance", "B-tree & GIN Indexing", "Connection pooling (PgBouncer)", "Partitioning"]
      },
      {
        name: "Redis",
        concepts: ["In-memory caching", "Pub/Sub", "Sorted Sets", "Distributed locks (Redlock)", "Streams"]
      },
      {
        name: "MySQL",
        concepts: ["InnoDB engine", "Transactions", "Replication", "Query performance tuning"]
      }
    ]
  },
  {
    category: "Messaging & Streaming Infrastructure",
    description: "Event-driven brokers enabling decoupled communication and asynchronous job queues.",
    items: [
      {
        name: "Apache Kafka",
        concepts: ["Topic partitioning", "Consumer groups", "Offset management", "Delivery guarantees", "Replication"]
      },
      {
        name: "RabbitMQ",
        concepts: ["Direct/Topic/Fanout exchanges", "Dead-letter exchanges", "Prefetch tuning", "Ack/Nack handling"]
      }
    ]
  },
  {
    category: "DevOps, Automation & Tooling",
    description: "Continuous integration, deployment workflows, and host management utilities.",
    items: [
      {
        name: "Linux & Shell",
        concepts: ["Process signals", "POSIX shell scripting", "File permissions", "systemd service units", "Networking tools"]
      },
      {
        name: "GitHub Actions",
        concepts: ["CI/CD pipelines", "Build matrices", "Security secret management", "Automated releases"]
      },
      {
        name: "Git",
        concepts: ["Branching strategies", "Interactive rebase", "Semantic versioning", "Conventional commits"]
      }
    ]
  }
];

export const architecturalCompetencies: CoreCompetency[] = [
  {
    title: "System Design & Decomposition",
    description:
      "Evaluating trade-offs between monolithic architectures and decoupled microservices based on domain boundaries, blast radius, and delivery velocity.",
    keyPractices: ["Domain-Driven Design (DDD)", "Clear Service Boundaries", "Failure Isolation"]
  },
  {
    title: "Fault Tolerance & Resilience",
    description:
      "Designing services to operate gracefully in degraded conditions rather than cascading failures across dependent systems.",
    keyPractices: ["Circuit Breakers", "Exponential Backoff & Jitter", "Rate Limiting", "Graceful Degradation"]
  },
  {
    title: "Observability & Telemetry",
    description:
      "Instrumenting backend services for real-time visibility into latency distributions, error budgets, and service dependencies.",
    keyPractices: ["Structured JSON Logging", "Distributed Tracing Context", "Prometheus Metrics", "Health Probes"]
  }
];
