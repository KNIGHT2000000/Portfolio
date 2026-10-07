export interface Profile {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  github: string;
  linkedin: string;
  email: string;
  resume: string;
  location?: string;
  availability?: string;
  about: {
    lead: string;
    paragraphs: string[];
    technicalPhilosophy: {
      title: string;
      description: string;
    }[];
    education: {
      degree: string;
      institution: string;
      year: string;
      focus?: string;
    }[];
    careerInterests: string[];
  };
}

export const profile: Profile = {
  name: "Vyomesh Shukla",
  role: "Backend & Cloud Engineer",
  tagline: "Building backend systems, distributed applications and cloud-native infrastructure.",
  summary:
    "Building backend systems, distributed applications and cloud-native infrastructure with a focus on reliability, scalability and clean engineering.",
  github: "https://github.com/KNIGHT2000000",
  linkedin: "https://www.linkedin.com/in/vyomeshshukla/",
  email: "mailto:shuklavyom12@gmail.com",
  // Point to a local static PDF in /public/resume.pdf or an external Google Drive / cloud URL
  resume: "/resume.pdf",
  location: "pune,Maharastra,India",
  availability: "Open to Backend, Distributed Systems, Cloud & Infrastructure roles",

  about: {
    lead: "Backend engineer focused on distributed computing, deterministic systems, and cloud infrastructure.",
    paragraphs: [
      "[Provide 1-2 paragraphs detailing your engineering background. Focus on systems architecture, data pipelines, backend APIs, and infrastructure automation rather than generic fluff.]",
      "Specializing in designing services with strict reliability requirements, handling asynchronous messaging topologies, and deploying immutable cloud infrastructure with automation."
    ],
    technicalPhilosophy: [
      {
        title: "Deterministic & Idempotent Workflows",
        description: "Designing workflows that can safely retry, recover from partition failures, and preserve strict state consistency without duplicate side effects."
      },
      {
        title: "Observability by Default",
        description: "Treating structured logging, distributed tracing, metrics, and actionable health probes as first-class citizens in every backend service."
      },
      {
        title: "Infrastructure as Code & Automation",
        description: "Declaring environment topologies in version-controlled configurations with reproducible, auditable CI/CD build pipelines."
      },
      {
        title: "Practical Simplicity",
        description: "Preferring boring, well-understood architectural patterns until genuine bottlenecks require distributed coordination and sharding."
      }
    ],
    education: [
      {
        degree: "B.Tech in Computer Science and Engineering",
        institution: "Symbiosis Institute of Technology ,Pune",
        year: "2028",
        focus: "Distributed Systems, Operating Systems, Database Internals"
      }
    ],
    careerInterests: [
      "Backend Engineering (High-throughput APIs & microservices)",
      "Distributed Systems & Event-Driven Architecture",
      "Cloud Infrastructure & Platform Engineering (AWS, Kubernetes, Terraform)",
      "Database Optimization & Cache Topologies (PostgreSQL, Redis)",
      "AI/LLM Backend Integration & Agent Execution Runtimes"
    ]
  }
};
