/**
 * ============================================================
 * MANUAL PROJECTS — Optional Local Additions / Overrides
 * ============================================================
 *
 * Use this file to:
 *   a) Add projects that are not on GitHub (e.g. private work,
 *      client projects, research papers)
 *   b) Override specific fields of a GitHub-imported project
 *      (e.g. add manually crafted challenges / decisions that
 *       cannot be extracted from README automatically)
 *
 * How overrides work:
 *   If a project here has the SAME SLUG as a GitHub-imported
 *   project, the fields in this file WIN (merged on top of
 *   the generated data). You only need to specify the fields
 *   you want to override — you don't have to repeat everything.
 *
 * How additions work:
 *   If a project here has a UNIQUE SLUG (not in GitHub), it
 *   is appended to the portfolio as a standalone entry.
 *
 * ============================================================
 * TO KEEP SAMPLE PROJECTS VISIBLE DURING DEVELOPMENT
 * (before you have real portfolio-tagged GitHub repos):
 * uncomment the sample entries below.
 * ============================================================
 */

import type { Project } from './projects';

export const manualProjects: Partial<Project>[] = [
  // ──────────────────────────────────────────────────────────
  // EXAMPLE: Override a GitHub-imported project to add
  // manually written challenges & architectural decisions
  // (these cannot be auto-extracted from README reliably).
  //
  // {
  //   slug: "resipay",                // Must match the GitHub repo name slug
  //   challenges: [
  //     "Handling network partitions during gateway reconciliation.",
  //     "Guaranteeing message ordering per customer account across Kafka partitions.",
  //     "Deduplicating incoming payment webhooks without locking hot rows."
  //   ],
  //   decisions: [
  //     {
  //       title: "Transactional Outbox over Two-Phase Commit",
  //       description: "Avoided distributed 2PC locking overhead by persisting outbox events locally."
  //     }
  //   ]
  // },
  //
  // ──────────────────────────────────────────────────────────
  // EXAMPLE: Add a project not hosted on GitHub
  //
  // {
  //   slug: "private-client-api",
  //   title: "Client API Platform",
  //   category: "Backend",
  //   featured: false,
  //   description: "High-throughput REST API built for a private client.",
  //   technologies: ["Java", "Spring Boot", "PostgreSQL"],
  //   status: "Completed",
  //   date: "2024",
  //   _source: "manual"
  // },
];
