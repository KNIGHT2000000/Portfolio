# Backend & Cloud Engineer Portfolio (Phase 1)

A production-grade, completely static, recruiter-focused personal portfolio website tailored for **Backend & Cloud Engineers**.

Built with **Astro**, **TypeScript**, and modern **Vanilla CSS**. Designed for high contrast, clean typography, zero visual gimmicks, and immediate deployment to **GitHub Pages**.

---

## Architecture Overview (Content → Components → Pages)

```text
d:/Portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── favicon.svg                 # Custom engineering favicon
│   ├── resume.pdf                  # Local resume PDF document
│   ├── robots.txt                  # Search engine crawler configuration
│   └── images/
│       └── projects/               # System architecture SVG diagrams
│           ├── resipay-arch.svg
│           ├── cloudscale-arch.svg
│           └── telemetry-arch.svg
├── src/
│   ├── data/                       # 100% Centralized Content Layer
│   │   ├── siteConfig.ts           # Site-wide meta, URLs, and SEO tokens
│   │   ├── profile.ts              # Personal info, about, and philosophy
│   │   ├── projects.ts             # Project data & TypeScript Project interface
│   │   ├── skills.ts               # Core focus domains & grouped technologies
│   │   ├── building.ts             # Active experiments ("Currently Building")
│   │   ├── blogs.ts                # Engineering notes & article links
│   │   └── experience.ts           # Professional engineering roles
│   ├── components/                 # Reusable UI Components
│   │   ├── ThemeToggle.astro       # Dark/Light mode toggle with persistence
│   │   ├── Navbar.astro            # Sticky header with mobile drawer
│   │   ├── Hero.astro              # Punchy engineering hero with CTA buttons
│   │   ├── EngineeringFocus.astro  # 6 Technical focus domain cards
│   │   ├── ProjectCard.astro       # Project card with conditional links
│   │   ├── ProjectGrid.astro       # Responsive card grid
│   │   ├── CurrentlyBuilding.astro # Active workbench cards
│   │   ├── BlogLinks.astro         # Publications & empty-state fallback
│   │   ├── ContactCta.astro        # Direct contact banner
│   │   └── Footer.astro            # Minimal engineering footer
│   ├── layouts/
│   │   └── BaseLayout.astro        # Meta tags, OpenGraph, theme bootstrap, layout
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── projects/
│   │   │   ├── index.astro         # All projects with client category filtering
│   │   │   └── [slug].astro        # Dynamic technical case study pages
│   │   ├── engineering.astro       # Grouped technologies & system design
│   │   ├── about.astro             # Background, philosophy, and education
│   │   ├── resume.astro            # Dedicated resume viewer & PDF download
│   │   └── 404.astro               # Technical 404 error page
│   ├── styles/
│   │   └── global.css              # Design tokens, CSS variables, dark/light themes
│   └── utils/
│       └── url.ts                  # Base URL resolution for GitHub Pages
├── astro.config.mjs                # Astro configuration (static output + sitemap)
├── CONTENT_GUIDE.md                # Field-by-field placeholder replacement guide
├── package.json
└── tsconfig.json
```

---

## 1. How to Run Locally

### Prerequisites
- Node.js v18.17.1+ or v20+ (tested on Node v20.16.0)
- npm v9+

### Commands:
```bash
# 1. Install dependencies
npm install

# 2. Start local development server (with hot reload)
npm run dev

# 3. Build static production bundle
npm run build

# 4. Preview the built static output locally
npm run preview
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## 2. How to Replace Personal Information

All personal details are decoupled from templates in `src/data/`:
1. Open `src/data/siteConfig.ts`:
   - Set `title`: `"Your Name | Backend & Cloud Engineer"`
   - Set `url`: `"https://<YOUR_GITHUB_USERNAME>.github.io"`
   - Set `base`: `"/"` (for root `username.github.io`) or `"/repository-name"` (if deploying to a repository subfolder)
2. Open `src/data/profile.ts`:
   - Change `name`, `role`, `summary`, `github`, `linkedin`, and `email`.
   - Update `about.paragraphs`, `about.education`, and `about.careerInterests`.

*Refer to `CONTENT_GUIDE.md` for a complete field-by-field checklist.*

---

## 3. How to Add a Project Manually

Open `src/data/projects.ts` and add a new entry to the `projects` array:

```ts
{
  slug: "my-distributed-service",
  title: "Distributed Service Name",
  category: "Distributed Systems", // "Distributed Systems" | "Backend" | "Cloud" | "DevOps" | "AI Systems"
  featured: true,                  // true to show on homepage, false for /projects only
  status: "Completed",
  date: "2024",
  description: "Short 1-2 sentence card summary.",
  longDescription: "Detailed architectural summary.",
  technologies: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Docker"],
  github: "https://github.com/yourusername/repo",
  demo: "",                        // Optional: empty string will not render
  documentation: {
    architecture: "https://github.com/yourusername/repo#architecture",
    api: "https://github.com/yourusername/repo#api",
    deployment: "https://github.com/yourusername/repo#deployment"
  },
  blog: {
    title: "Deep-Dive into Consistency Trade-Offs",
    url: "https://example.com/blog/my-post"
  },
  architectureImage: "/images/projects/my-arch.svg",
  problem: "What production problem did this solve?",
  solution: "What was built to solve it?",
  challenges: [
    "Race conditions during concurrent writes",
    "Preserving message ordering across rebalances"
  ],
  decisions: [
    {
      title: "Optimistic Locking with Version Fields",
      description: "Prevented lost updates without pessimistic row locks."
    }
  ]
}
```

A dedicated static page will automatically be created at:
`/projects/my-distributed-service`

---

## 4. How to Add Documentation

In any project entry in `src/data/projects.ts`, fill in the `documentation` object:
- `architecture`: URL pointing to your architecture diagrams or RFC.
- `api`: URL to Swagger/OpenAPI docs or API contract.
- `deployment`: URL to Docker Compose, Kubernetes manifests, or runbook.
- `general`: URL to general project documentation.

Any link left undefined or empty is **omitted automatically** from the UI.

---

## 5. How to Add an Engineering Blog / Note

Open `src/data/blogs.ts` and append to the `blogs` array:

```ts
{
  id: "zero-downtime-deployments",
  title: "Zero-Downtime Blue/Green Swaps with Nginx & Docker",
  topic: "DevOps & Cloud",
  date: "2024",
  readTime: "6 min read",
  description: "A practical guide to socket draining and health check validation before traffic routing.",
  url: "https://yourblog.com/blue-green-deployments",
  platform: "Medium"
}
```

If you have no published notes yet, set `export const blogs: BlogItem[] = [];` and the UI will automatically render a professional placeholder: *"Engineering write-ups coming soon."*

---

## 6. How to Add Architecture Diagrams

1. Save your diagram as an SVG or image (SVG recommended for crisp rendering on high-DPI displays) in `public/images/projects/`:
   ```text
   public/images/projects/my-service-arch.svg
   ```
2. Reference the path in `src/data/projects.ts`:
   ```ts
   architectureImage: "/images/projects/my-service-arch.svg"
   ```

---

## 7. How to Add the Resume

1. Place your compiled resume PDF into `public/resume.pdf`.
2. The site automatically links to `/resume.pdf` from the navigation bar, hero button, and footer.
3. Visiting `/resume` provides an embedded interactive PDF viewer with direct download and open buttons.
4. If you host your resume externally (e.g. Google Drive), change the `resume` field in `src/data/profile.ts`:
   ```ts
   resume: "https://drive.google.com/your-resume-link"
   ```

---

## 8. How to Deploy to GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

### Step-by-Step Setup:
1. In your GitHub repository, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. In `src/data/siteConfig.ts`, confirm:
   - `url`: `"https://<username>.github.io"`
   - `base`: `"/"` (if the repo is named `<username>.github.io`) OR `"/<repo-name>"` (if your repo is named e.g. `portfolio`).
4. Commit and push your code to `main` (or `master`).
5. GitHub Actions will automatically trigger the `Deploy Static Portfolio to GitHub Pages` workflow.
6. Your portfolio will be live at `https://<username>.github.io` in under 2 minutes.

---

## 9. Exact Git Commands for Deployment

Run the following commands in your local terminal:

```bash
# 1. Initialize Git repository (if not already initialized)
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: complete Phase 1 backend & cloud engineer portfolio"

# 4. Set default branch to main
git branch -M main

# 5. Link to your GitHub remote repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 10. Phase 2 Architecture: Future GitHub Automation Integration

The codebase was architected specifically to allow seamless integration with Phase 2 without rewriting or redesigning the UI components:

```text
                    ┌────────────────────────┐
                    │ GitHub Repositories    │
                    │ (topics: 'portfolio')  │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │ GitHub REST / GraphQL  │
                    │ Octokit Build Script   │
                    └───────────┬────────────┘
                                │ (prebuild step)
                    ┌───────────▼────────────┐
                    │ src/data/projects.json │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │ src/data/projects.ts   │ (Exports Project[] interface)
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │ Astro Static Site Gen  │
                    └────────────────────────┘
```

### Why This Separation Works:
1. **The `Project` Interface Is Contract-Locked:**
   Components like `<ProjectCard />`, `<ProjectGrid />`, and `src/pages/projects/[slug].astro` only consume the TypeScript `Project` interface.
2. **Phase 2 Ingestion Strategy:**
   A Phase 2 pre-build script (e.g., `scripts/sync-github.js`) will query GitHub's API for repositories tagged with `#portfolio`, parse their `README.md` frontmatter / metadata, and serialize them to `src/data/projects.json`.
3. **Zero UI Rewrite:**
   `src/data/projects.ts` simply imports the generated JSON or returns it through the existing typed getter function, requiring zero modifications to pages or visual components.
