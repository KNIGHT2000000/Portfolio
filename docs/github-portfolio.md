# Phase 2 — GitHub-Driven Portfolio Automation

## How it works

```
Your GitHub Repo (tagged: portfolio)
         │
         ▼
  GitHub Actions (nightly + on push)
         │
         ▼  node scripts/sync-github.mjs
         │  ↳ GitHub REST API (public, no PAT required)
         │  ↳ reads portfolio.yaml from each tagged repo (optional)
         │  ↳ reads README.md for description fallback
         ▼
  src/data/generated-projects.json
         │
         ▼  npm run build (Astro static generation)
         │
         ▼
  dist/ → GitHub Pages
```

---

## Step 1 — Set your GitHub username (one-time setup)

In your GitHub repository go to:

> **Settings → Secrets and variables → Actions → Variables → New repository variable**

| Name | Value |
|------|-------|
| `GITHUB_USERNAME` | `your-github-username` |

> **Note:** `GITHUB_TOKEN` is automatically provided by GitHub Actions — you do **not** need to create or store a Personal Access Token.

---

## Step 2 — Tag repositories for inclusion

For any GitHub repository you want to appear in the portfolio:

1. Go to the repository on GitHub
2. Click the ⚙️ gear icon next to **About** (top right of the repo page)
3. Under **Topics**, add: `portfolio`
4. *(Optional)* Also add any of these to improve categorization and metadata:

| Topic | Effect |
|-------|--------|
| `featured` | Shows the project on the homepage |
| `backend` | Category → Backend |
| `distributed-systems` | Category → Distributed Systems |
| `cloud` or `infrastructure` | Category → Cloud |
| `devops` | Category → DevOps |
| `ai` or `machine-learning` | Category → AI Systems |
| `java`, `spring-boot`, `python`, `kafka`, `docker`, etc. | Adds technology tags automatically |

---

## Step 3 — (Optional) Add `portfolio.yaml` to a repository

For richer project pages, create `portfolio.yaml` at the root of any tagged repository:

```yaml
# All fields are optional. The sync script falls back to GitHub metadata.

title: "Custom Project Title"
description: "A compelling one-liner about what this project solves."
category: "Backend"         # Distributed Systems | Backend | Cloud | DevOps | AI Systems
status: "Completed"         # Completed | Active | In Progress
featured: true
order: 1                    # Lower number = shown first (default: 999)

technologies:
  - Java
  - Spring Boot
  - Apache Kafka

documentation:
  architecture: "https://github.com/you/repo#architecture"
  api: "https://github.com/you/repo#api"
  deployment: "https://github.com/you/repo#deployment"
  general: "https://your-docs.example.com"

blog:
  title: "How I built this"
  url: "https://your-blog.example.com/post"

demo:
  url: "https://your-demo.example.com"

architectureImage:
  url: "https://raw.githubusercontent.com/you/repo/main/docs/arch.png"
```

See [`portfolio.yaml.example`](../portfolio.yaml.example) for the full reference.

---

## Data priority (what wins)

| Field | Priority 1 | Priority 2 | Priority 3 |
|-------|-----------|-----------|-----------|
| Title | `portfolio.yaml: title` | GitHub repo name (title-cased) | — |
| Description | `portfolio.yaml: description` | GitHub repo description | README first paragraph |
| Category | `portfolio.yaml: category` | Topics (backend, cloud, etc.) | "Backend" (default) |
| Technologies | `portfolio.yaml: technologies` | Topics + primary language | Primary language only |
| Featured | `portfolio.yaml: featured` | `featured` topic | false |
| Docs/Blog/Demo | `portfolio.yaml` only | — | — |

---

## Manual overrides & private projects

Edit [`src/data/manual-projects.ts`](../src/data/manual-projects.ts) to:

- **Override** fields on any GitHub-imported project (by matching its slug)
- **Add** projects that aren't on GitHub (private work, client projects, etc.)

Example — add manually crafted challenge bullets to a GitHub project:

```typescript
export const manualProjects = [
  {
    slug: "my-github-repo",  // Must match the GitHub repo slug
    challenges: [
      "Custom challenge 1",
      "Custom challenge 2"
    ],
    decisions: [
      {
        title: "Why we chose X over Y",
        description: "..."
      }
    ]
  }
];
```

---

## Running the sync locally

```bash
# Set your username (or use GITHUB_USERNAME env var)
export GITHUB_USERNAME=your-github-username

# Optional: set a token for higher rate limits (60 → 5000 req/hr)
export GITHUB_TOKEN=ghp_your_token_here

# Run the sync
npm run sync:github

# Sync + build in one step
npm run sync:github:ci
```

The sync writes to `src/data/generated-projects.json`. Commit this file or run
`npm run sync:github` as part of your local dev workflow.

---

## Deployment trigger schedule

| Event | Trigger |
|-------|---------|
| Push to `main`/`master` | Sync + rebuild immediately |
| Nightly (02:00 UTC) | Automatic sync + rebuild |
| Manual | GitHub Actions → Run workflow |

---

## Error handling

| Situation | Behaviour |
|-----------|-----------|
| No repos tagged `portfolio` | Warns, writes empty JSON. Build succeeds, no projects shown. |
| Invalid `portfolio.yaml` YAML | Warns, falls back to GitHub metadata. Build continues. |
| Invalid `portfolio.yaml` field values | Warns, skips invalid field. Fallback applies. |
| API rate limit exceeded | Build **fails** with a clear error. Set `GITHUB_TOKEN`. |
| GitHub API returns error | Build **fails** with error. Prevents deploying stale/empty site. |
| All repos fail to process | Build **fails** with error. Prevents blank portfolio. |

> **Safe failure by design:** The sync script exits with code 1 on fatal errors,
> which stops the GitHub Actions job **before** the Astro build runs.
> This means a sync failure will never push an empty portfolio to production.
