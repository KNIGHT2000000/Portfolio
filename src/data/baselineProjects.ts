import type { Project } from './projects';

/**
 * Baseline Architectural Projects
 * ─────────────────────────────────────────────────────────────
 * These showcase projects serve as the foundation when no GitHub
 * repositories have been tagged with the 'portfolio' topic yet, or
 * as a safe fallback so the website is never published blank or broken.
 *
 * Once real repositories are tagged with 'portfolio' on GitHub, the sync
 * script automatically pulls them in and replaces these baseline projects.
 */
export const baselineProjects: Project[] = [
  {
    slug: "resipay",
    title: "ResiPay",
    category: "Distributed Systems",
    featured: true,
    status: "Completed",
    date: "2024",
    description:
      "Payment orchestration engine designed around asynchronous message queues, transactional outbox pattern, and failure recovery.",
    longDescription:
      "A resilient payment processing service designed to decouple payment validation, gateway dispatch, and ledger journaling across distributed message boundaries with strict state guarantees.",
    technologies: [
      "Java",
      "Spring Boot",
      "Apache Kafka",
      "PostgreSQL",
      "Docker",
      "Redis"
    ],
    github: "https://github.com/KNIGHT2000000",
    demo: "",
    documentation: {
      architecture: "https://github.com/KNIGHT2000000",
      api: "https://github.com/KNIGHT2000000",
      deployment: "https://github.com/KNIGHT2000000"
    },
    blog: {
      title: "Designing Idempotent Payment Workflows with the Outbox Pattern",
      url: "https://linkedin.com/in/vyomeshshukla/"
    },
    architectureImage: "/images/projects/resipay-arch.svg",
    problem:
      "Payment transactions interacting with third-party banking gateways are vulnerable to network timeouts, duplicate submissions, and inconsistent state transitions when services restart during transit.",
    solution:
      "Engineered an event-driven workflow utilizing the Transactional Outbox pattern to atomically persist transaction intent and ledger updates, paired with Kafka consumers using idempotent keys and exponential backoff retry topics.",
    challenges: [
      "Handling network partitions during gateway reconciliation without creating orphaned charge states.",
      "Guaranteeing message ordering per customer account across Kafka partitions while maintaining horizontal consumer concurrency.",
      "Deduplicating incoming payment webhooks without locking hot database rows."
    ],
    decisions: [
      {
        title: "Transactional Outbox over Two-Phase Commit (2PC)",
        description:
          "Avoided distributed 2PC locking overhead across database and broker by persisting outbox events in the local database transaction and utilizing a CDC relay to publish to Kafka."
      },
      {
        title: "Deterministic Idempotency Keys in Redis & PostgreSQL",
        description:
          "Implemented short-lived atomic Redis leases for in-flight requests and an immutable PostgreSQL idempotency table with unique constraints for terminal settlement states."
      },
      {
        title: "Dead Letter Queue (DLQ) & Delayed Retry Topology",
        description:
          "Separated transient transport errors from fatal validation rejections by routing unrecoverable payloads to a persistent DLQ with replay tooling."
      }
    ],
    order: 1
  },
  {
    slug: "cloudscale-orchestrator",
    title: "CloudScale Orchestrator",
    category: "Cloud",
    featured: true,
    status: "Completed",
    date: "2024",
    description:
      "Lightweight declarative container deployment daemon and health-check supervisor built for isolated Linux host environments.",
    longDescription:
      "A modular infrastructure utility that monitors service specifications, coordinates zero-downtime rolling updates, and integrates automated DNS and container health supervision.",
    technologies: [
      "Go / Python",
      "Docker Engine API",
      "Linux Cgroups",
      "systemd",
      "AWS EC2",
      "GitHub Actions"
    ],
    github: "https://github.com/KNIGHT2000000",
    demo: "",
    documentation: {
      architecture: "https://github.com/KNIGHT2000000",
      deployment: "https://github.com/KNIGHT2000000"
    },
    blog: {
      title: "Supervising Container Lifecycles with Linux Signals and Cgroups",
      url: "https://linkedin.com/in/vyomeshshukla/"
    },
    architectureImage: "/images/projects/cloudscale-arch.svg",
    problem:
      "Deploying microservice containers on standalone host machines often involves brittle bash scripts that lack health checking, graceful signal forwarding, and safe rollback mechanisms.",
    solution:
      "Built a daemon that ingests declarative YAML declarations, performs canary health polling via local sockets, and handles SIGTERM propagation for rolling blue/green port swaps on single hosts.",
    challenges: [
      "Gracefully draining active HTTP connections before killing retired container instances.",
      "Safely managing file descriptors and process namespaces under Linux without privileged root leaks.",
      "Providing atomic rollback when new revisions fail initial health checks."
    ],
    decisions: [
      {
        title: "Declarative Desired-State Loop",
        description:
          "Implemented a reconciliation loop pattern that continuously compares running container signatures against the target manifest rather than imperatively executing commands."
      },
      {
        title: "Socket-Based Health Verification",
        description:
          "Enforced strict TCP and HTTP readiness probes before mutating upstream local reverse proxy routes, preventing premature traffic routing."
      }
    ],
    order: 2
  },
  {
    slug: "telemetry-stream",
    title: "TelemetryStream",
    category: "Backend",
    featured: true,
    status: "Active",
    date: "2024",
    description:
      "High-throughput structured log ingestion worker and batch aggregation pipeline with backpressure regulation.",
    longDescription:
      "A backend service engineered to consume high-frequency operational metrics and event streams, batching insertions into time-series relational schemas with backpressure management.",
    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "TimescaleDB",
      "Redis",
      "Docker"
    ],
    github: "https://github.com/KNIGHT2000000",
    demo: "",
    documentation: {
      architecture: "https://github.com/KNIGHT2000000",
      api: "https://github.com/KNIGHT2000000"
    },
    architectureImage: "/images/projects/telemetry-arch.svg",
    problem:
      "Spikes in client diagnostic events can overwhelm ingestion database connections, resulting in connection pool starvation and discarded log payloads.",
    solution:
      "Created an asynchronous buffer tier using Redis streams with non-blocking ingestion workers that batch inserts into partitioned relational tables using copy operations.",
    challenges: [
      "Preventing memory ballooning during sudden traffic bursts while preserving ingest latency.",
      "Partitioning database storage by ingestion timestamp without degradation in query lookup speeds.",
      "Ensuring worker consumer group rebalances do not create duplicate ingestion records."
    ],
    decisions: [
      {
        title: "Buffered Micro-Batching with Copy Streams",
        description:
          "Replaced single-row database inserts with buffered micro-batches written via PostgreSQL binary COPY protocol, improving throughput significantly."
      },
      {
        title: "Adaptive Rate Throttling and Token Bucket",
        description:
          "Implemented client tenant token buckets backed by Redis to shed non-critical debug telemetry when system ingestion headroom falls below safety margins."
      }
    ],
    order: 3
  }
];
