# Portfolio Content Replacement Guide

This guide details every file and field where placeholder information can be customized with your actual engineering details. All content is strictly separated from presentation logic in `src/data/`.

---

## 1. Personal Information & Global Configuration

### Files:
- `src/data/siteConfig.ts`
- `src/data/profile.ts`

### What to Replace:
| Field | File | Description / Example |
| :--- | :--- | :--- |
| `siteConfig.title` | `siteConfig.ts` | Browser tab title: `"Your Name | Backend & Cloud Engineer"` |
| `siteConfig.url` | `siteConfig.ts` | GitHub Pages base URL: `"https://yourusername.github.io"` |
| `siteConfig.base` | `siteConfig.ts` | Set to `"/"` (for `username.github.io`) or `"/portfolio"` if deploying to a subfolder repository |
| `profile.name` | `profile.ts` | Your full name |
| `profile.role` | `profile.ts` | `"Backend & Cloud Engineer"` |
| `profile.location` | `profile.ts` | E.g. `"San Francisco, CA"` or `"Remote"` |
| `profile.availability` | `profile.ts` | E.g. `"Open to Backend & Distributed Systems Roles"` |
| `profile.about.lead` | `profile.ts` | 1-line lead summary on About page |
| `profile.about.paragraphs` | `profile.ts` | 1–2 paragraphs detailing engineering background and systems ownership |
| `profile.about.education` | `profile.ts` | Your degree, institution, graduation year, and coursework |

---

## 2. Hero Text & Headlines

### File:
- `src/data/profile.ts`

### What to Replace:
- `profile.summary`: The 1–2 sentence statement shown directly below your name on the homepage.
  ```ts
  summary: "Building backend systems, distributed applications and cloud-native infrastructure with a focus on reliability, scalability and clean engineering."
  ```
- `profile.tagline`: Minimal 1-line engineering slogan used in the footer and metadata.

---

## 3. Skills & Engineering Focus

### File:
- `src/data/skills.ts`
- `src/data/building.ts`

### What to Replace:
- `engineeringFocusAreas`: The 6 focus cards displayed on the homepage (Backend Engineering, Distributed Systems, Cloud & Infrastructure, Databases & Caching, DevOps & Systems, AI + Backend Systems).
  - Update `title`, `summary`, and `tags`.
- `technologyGroups`: Grouped technical skills displayed on `/engineering`:
  - `Backend & Systems Languages`
  - `Cloud & Infrastructure`
  - `Databases & Storage Topologies`
  - `Messaging & Streaming Infrastructure`
  - `DevOps, Automation & Tooling`
- `architecturalCompetencies`: Principles like System Design & Decomposition, Fault Tolerance, and Observability.
- `currentlyBuilding`: The 3 numbered focus items under "Currently Building" on the homepage.

---

## 4. Projects & Case Studies

### File:
- `src/data/projects.ts`

### What to Replace:
Add, edit, or remove project objects in the `projects` array. Each project follows the TypeScript `Project` interface:

```ts
{
  slug: "resipay",                              // URL slug: /projects/resipay
  title: "ResiPay",                             // Project name
  category: "Distributed Systems",              // "Distributed Systems" | "Backend" | "Cloud" | "DevOps" | "AI Systems"
  featured: true,                               // Set true to show on Homepage
  status: "Completed",                          // "Completed" | "Active" | "In Progress"
  date: "2024",
  description: "Short 1-2 sentence overview for cards",
  longDescription: "Deeper technical summary for case study",
  technologies: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Docker"],
  github: "https://github.com/username/project", // View Source Code link
  demo: "",                                     // Live demo (leave empty "" if none)
  documentation: {
    architecture: "https://...",                // Architecture link
    api: "https://...",                         // API docs link
    deployment: "https://..."                   // Deployment guide link
  },
  blog: {
    title: "Engineering Write-up Title",
    url: "https://..."                          // Optional blog/article link
  },
  architectureImage: "/images/projects/resipay-arch.svg", // Static image or SVG path
  problem: "What real-world problem does this project solve?",
  solution: "What was built to solve the problem?",
  challenges: [                                 // Array of 2-4 hard engineering edge cases
    "Idempotency and deduplication",
    "Message ordering guarantees"
  ],
  decisions: [                                  // Array of architectural trade-off decisions
    {
      title: "Transactional Outbox over 2PC",
      description: "Rationale for choosing this architectural pattern"
    }
  ]
}
```

> **Note on Conditional Links:** If any link (`github`, `demo`, `documentation`, or `blog`) is empty string `""` or omitted, it **will not render** in the UI.

---

## 5. Documentation Links

### File:
- `src/data/projects.ts`

### What to Replace:
Inside each project's `documentation` field:
- `architecture`: Link to system architecture specs (Markdown doc, Wiki, or GitHub README section)
- `api`: Link to Swagger/OpenAPI docs or API spec markdown
- `deployment`: Link to deployment instructions or runbook
- `general`: General wiki or repository documentation

---

## 6. Engineering Notes & Blog Links

### File:
- `src/data/blogs.ts`

### What to Replace:
- Add your technical blog posts, Medium/Hashnode/Dev.to articles, or internal write-ups:
  ```ts
  {
    id: "idempotent-payments",
    title: "Designing Idempotent Payment Systems",
    topic: "Distributed Systems",
    date: "2024",
    readTime: "7 min read",
    description: "Brief summary of the article",
    url: "https://example.com/notes/idempotent-payments"
  }
  ```
- If you don't have published articles yet, simply set:
  ```ts
  export const blogs: BlogItem[] = [];
  ```
  The UI will automatically display a clean placeholder: **"Engineering write-ups coming soon."**

---

## 7. Resume (Curriculum Vitae)

### File:
- `public/resume.pdf`
- `src/data/profile.ts`

### How to Update:
1. Export your resume as a PDF.
2. Name the file `resume.pdf`.
3. Overwrite the file at `public/resume.pdf`.
4. (Optional): If you prefer hosting your resume on Google Drive, Dropbox, or AWS S3, change the `resume` property in `src/data/profile.ts` to your public URL.

---

## 8. Social Links & Direct Contact

### File:
- `src/data/profile.ts`

### What to Replace:
- `profile.github`: `"https://github.com/YOUR_USERNAME"`
- `profile.linkedin`: `"https://linkedin.com/in/YOUR_HANDLE"`
- `profile.email`: `"mailto:your.email@example.com"`
