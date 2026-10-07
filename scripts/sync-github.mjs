/**
 * ============================================================
 * PHASE 2 — GitHub Portfolio Sync Script
 * ============================================================
 *
 * This script fetches GitHub repositories tagged with the
 * "portfolio" topic, reads optional portfolio.yaml metadata
 * from each repo, and generates:
 *
 *   src/data/generated-projects.json
 *
 * which is consumed by the Astro build pipeline.
 *
 * Usage:
 *   npm run sync:github
 *
 * Environment variables (optional):
 *   GITHUB_TOKEN  — GitHub personal access token (increases
 *                   rate limit from 60 to 5000 req/hr)
 *   GITHUB_USERNAME — Overrides the default username in config
 * ============================================================
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { load as yamlLoad } from 'js-yaml';

// ─── Configuration ────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ──  Read GitHub username from siteConfig if available ────────
let GITHUB_USERNAME = process.env.GITHUB_USERNAME || '';

if (!GITHUB_USERNAME) {
  try {
    // Parse profile.ts to extract github URL
    const profileSrc = readFileSync(join(ROOT, 'src/data/profile.ts'), 'utf8');
    const match = profileSrc.match(/github:\s*["']https?:\/\/github\.com\/([^/"']+)["']/);
    if (match && match[1]) {
      GITHUB_USERNAME = match[1];
    }
  } catch (_) {}
}

if (!GITHUB_USERNAME) {
  console.error('❌ GITHUB_USERNAME not set. Set it via environment variable or in src/data/profile.ts');
  process.exit(1);
}

// Optional: GitHub personal access token (for higher rate limits)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// Output path for generated data
const OUTPUT_PATH = join(ROOT, 'src/data/generated-projects.json');

// ─── Topic → Category mapping ──────────────────────────────────
const TOPIC_CATEGORY_MAP = {
  'distributed-systems': 'Distributed Systems',
  'backend': 'Backend',
  'cloud': 'Cloud',
  'devops': 'DevOps',
  'ai': 'AI Systems',
  'infrastructure': 'Cloud',
  'machine-learning': 'AI Systems',
  'ml': 'AI Systems',
};

// Valid categories matching Phase 1 schema
const VALID_CATEGORIES = ['Distributed Systems', 'Backend', 'Cloud', 'DevOps', 'AI Systems'];

// ─── Status mapping ────────────────────────────────────────────
const VALID_STATUSES = ['Completed', 'Active', 'In Progress'];

// ─── Utility: HTTP(S) GET as Promise ──────────────────────────
function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const requestHeaders = {
      'User-Agent': 'portfolio-sync-script/2.0',
      'Accept': 'application/vnd.github.v3+json',
      ...headers
    };
    if (GITHUB_TOKEN) {
      requestHeaders['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const req = https.get({
      hostname: options.hostname,
      path: options.pathname + (options.search || ''),
      headers: requestHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Request timed out: ${url}`));
    });
  });
}

// ─── Utility: GitHub API GET with rate limit awareness ─────────
async function githubGet(path) {
  const url = `https://api.github.com${path}`;
  const res = await httpGet(url);

  if (res.status === 403) {
    const remaining = res.headers['x-ratelimit-remaining'];
    if (remaining === '0') {
      const resetTime = new Date(parseInt(res.headers['x-ratelimit-reset']) * 1000).toISOString();
      throw new Error(`GitHub API rate limit exceeded. Resets at: ${resetTime}. Set GITHUB_TOKEN for 5000 req/hr.`);
    }
    throw new Error(`GitHub API 403 forbidden for path: ${path}`);
  }

  if (res.status === 404) {
    return null; // Caller handles 404 gracefully
  }

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`GitHub API error ${res.status} for path: ${path}\n${res.body}`);
  }

  return JSON.parse(res.body);
}

// ─── Utility: Fetch raw file content from a repo ──────────────
async function fetchRawFile(owner, repo, filePath) {
  try {
    // Use GitHub Contents API to get file
    const data = await githubGet(`/repos/${owner}/${repo}/contents/${filePath}`);
    if (!data || data.type !== 'file') return null;
    // Content is base64 encoded
    return Buffer.from(data.content, 'base64').toString('utf8');
  } catch (err) {
    return null; // File doesn't exist or error
  }
}

// ─── Utility: YAML parser ─────────────────────────────────────
function parsePortfolioYaml(content) {
  return yamlLoad(content);
}

// ─── Utility: Slug generation ──────────────────────────────────
function generateSlug(repoName) {
  return repoName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Utility: URL validation ───────────────────────────────────
function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// ─── Utility: Extract short summary from README ───────────────
function extractReadmeSummary(readme) {
  if (!readme) return '';
  const lines = readme.split('\n').filter(l => l.trim());
  // Skip heading lines (starting with #)
  const description = lines.find(l => !l.startsWith('#') && l.trim().length > 20);
  return description ? description.replace(/[*_`\[\]()]/g, '').trim().slice(0, 300) : '';
}

// ─── Utility: Extract problem from README ─────────────────────
function extractReadmeSection(readme, headings) {
  if (!readme) return '';
  const lines = readme.split('\n');
  let capturing = false;
  let content = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      const headingText = line.replace(/^#+\s*/, '').toLowerCase();
      const isTarget = headings.some(h => headingText.includes(h.toLowerCase()));
      if (isTarget) {
        capturing = true;
        continue;
      } else if (capturing) {
        break; // Hit the next heading — stop
      }
    }
    if (capturing && line.trim()) {
      content.push(line);
    }
  }

  return content.join('\n').trim().slice(0, 800);
}

// ─── Validate portfolio.yaml content ──────────────────────────
function validatePortfolioMeta(meta, repoName) {
  const errors = [];

  if (meta.title !== undefined && typeof meta.title !== 'string') {
    errors.push('title must be a string');
  }
  if (meta.description !== undefined && typeof meta.description !== 'string') {
    errors.push('description must be a string');
  }
  if (meta.technologies !== undefined && !Array.isArray(meta.technologies)) {
    errors.push('technologies must be an array');
  }
  if (meta.featured !== undefined && typeof meta.featured !== 'boolean') {
    errors.push('featured must be a boolean');
  }
  if (meta.order !== undefined && typeof meta.order !== 'number') {
    errors.push('order must be a number');
  }
  if (meta.status !== undefined && !VALID_STATUSES.includes(meta.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (meta.category !== undefined && !VALID_CATEGORIES.includes(meta.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  // URL validations
  const urlFields = [
    ['documentation.general', meta.documentation?.general],
    ['documentation.architecture', meta.documentation?.architecture],
    ['documentation.api', meta.documentation?.api],
    ['documentation.deployment', meta.documentation?.deployment],
    ['blog.url', meta.blog?.url],
    ['demo.url', meta.demo?.url],
    ['architectureImage.url', meta.architectureImage?.url],
  ];
  for (const [field, value] of urlFields) {
    if (value && !isValidUrl(value)) {
      errors.push(`${field}: "${value}" is not a valid URL`);
    }
  }

  if (errors.length > 0) {
    console.warn(`\n⚠️  Validation warnings in portfolio.yaml for "${repoName}":`);
    errors.forEach(e => console.warn(`   • ${e}`));
    console.warn('');
  }

  return errors;
}

// ─── Normalize topics → category ───────────────────────────────
function inferCategoryFromTopics(topics) {
  for (const [topic, category] of Object.entries(TOPIC_CATEGORY_MAP)) {
    if (topics.includes(topic)) return category;
  }
  return 'Backend'; // sensible default
}

// ─── Normalize topics → technologies ──────────────────────────
const TOPIC_TECH_MAP = {
  'java': 'Java', 'spring-boot': 'Spring Boot', 'spring': 'Spring',
  'python': 'Python', 'fastapi': 'FastAPI', 'django': 'Django', 'flask': 'Flask',
  'nodejs': 'Node.js', 'node': 'Node.js', 'typescript': 'TypeScript',
  'go': 'Go', 'golang': 'Go', 'rust': 'Rust', 'kotlin': 'Kotlin',
  'kafka': 'Apache Kafka', 'rabbitmq': 'RabbitMQ', 'redis': 'Redis',
  'postgresql': 'PostgreSQL', 'postgres': 'PostgreSQL', 'mysql': 'MySQL',
  'mongodb': 'MongoDB', 'elasticsearch': 'Elasticsearch',
  'docker': 'Docker', 'kubernetes': 'Kubernetes', 'k8s': 'Kubernetes',
  'terraform': 'Terraform', 'aws': 'AWS', 'gcp': 'GCP', 'azure': 'Azure',
  'linux': 'Linux', 'nginx': 'Nginx', 'grpc': 'gRPC',
  'graphql': 'GraphQL', 'rest': 'REST API',
  'openai': 'OpenAI API', 'llm': 'LLM Integration',
};

function inferTechFromTopics(topics, language) {
  const tech = [];
  for (const topic of topics) {
    if (TOPIC_TECH_MAP[topic]) tech.push(TOPIC_TECH_MAP[topic]);
  }
  if (language && !tech.some(t => t.toLowerCase() === language.toLowerCase())) {
    tech.unshift(language);
  }
  return [...new Set(tech)];
}

// ─── Normalize date from GitHub updatedAt ─────────────────────
function normalizeDate(isoDate) {
  if (!isoDate) return '';
  try {
    return new Date(isoDate).getFullYear().toString();
  } catch (_) {
    return '';
  }
}

// ─── Build normalized project from repo + meta + readme ───────
function buildProject(repo, portfolioMeta, readme) {
  const topics = repo.topics || [];
  const isFeaturedByTopic = topics.includes('featured');
  const readmeSummary = extractReadmeSummary(readme);
  const readmeProblem = extractReadmeSection(readme, ['problem', 'the problem', 'background', 'motivation']);
  const readmeSolution = extractReadmeSection(readme, ['solution', 'the solution', 'approach', 'how it works']);

  // Title priority: portfolio.yaml > repo name
  const title = portfolioMeta?.title || repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Description priority: portfolio.yaml > repo description > readme
  const description = (portfolioMeta?.description || repo.description || readmeSummary || '').trim().slice(0, 500);

  // Technologies priority: portfolio.yaml > topics/languages
  let technologies = [];
  if (portfolioMeta?.technologies && Array.isArray(portfolioMeta.technologies) && portfolioMeta.technologies.length > 0) {
    technologies = portfolioMeta.technologies;
  } else {
    technologies = inferTechFromTopics(topics, repo.language);
  }
  if (technologies.length === 0 && repo.language) {
    technologies = [repo.language];
  }

  // Category priority: portfolio.yaml > topics
  let category = portfolioMeta?.category || inferCategoryFromTopics(topics);
  if (!VALID_CATEGORIES.includes(category)) category = 'Backend';

  // Featured priority: portfolio.yaml > featured topic
  const featured = portfolioMeta?.featured !== undefined ? Boolean(portfolioMeta.featured) : isFeaturedByTopic;

  // Demo URL priority: portfolio.yaml.demo > repo homepage
  const demoUrl = portfolioMeta?.demo?.url || repo.homepage || '';

  // Documentation (only from portfolio.yaml — we don't guess URLs)
  const documentation = {};
  if (isValidUrl(portfolioMeta?.documentation?.general)) documentation.general = portfolioMeta.documentation.general;
  if (isValidUrl(portfolioMeta?.documentation?.architecture)) documentation.architecture = portfolioMeta.documentation.architecture;
  if (isValidUrl(portfolioMeta?.documentation?.api)) documentation.api = portfolioMeta.documentation.api;
  if (isValidUrl(portfolioMeta?.documentation?.deployment)) documentation.deployment = portfolioMeta.documentation.deployment;

  // Blog
  const blog = {};
  if (portfolioMeta?.blog?.url && isValidUrl(portfolioMeta.blog.url)) {
    blog.url = portfolioMeta.blog.url;
    blog.title = portfolioMeta.blog.title || '';
  }

  // Architecture image
  const architectureImage = (portfolioMeta?.architectureImage?.url && isValidUrl(portfolioMeta.architectureImage.url))
    ? portfolioMeta.architectureImage.url
    : '';

  // Status priority:
  // 1. portfolio.yaml (explicit override)
  // 2. GitHub repository topics (completed | in-progress | active)
  // 3. Default: 'Active'
  let status = portfolioMeta?.status;
  if (!status) {
    if (topics.includes('completed') || topics.includes('status-completed')) {
      status = 'Completed';
    } else if (topics.includes('in-progress') || topics.includes('status-in-progress') || topics.includes('wip')) {
      status = 'In Progress';
    } else if (topics.includes('active') || topics.includes('status-active')) {
      status = 'Active';
    } else {
      status = 'Active';
    }
  }
  if (!VALID_STATUSES.includes(status)) status = 'Active';

  // Date
  const date = normalizeDate(repo.pushed_at || repo.updated_at);

  // GitHub metadata (optional display info)
  const githubMetadata = {
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    language: repo.language || '',
    updatedAt: repo.updated_at || '',
  };

  return {
    slug: generateSlug(repo.name),
    title,
    category,
    featured,
    description,
    longDescription: description, // Can be overridden by more detailed README content
    technologies,
    github: repo.html_url,
    demo: isValidUrl(demoUrl) ? demoUrl : '',
    documentation: Object.keys(documentation).length > 0 ? documentation : undefined,
    blog: blog.url ? blog : undefined,
    architectureImage: architectureImage || undefined,
    problem: readmeProblem || undefined,
    solution: readmeSolution || undefined,
    challenges: undefined,  // Cannot be auto-extracted safely from unstructured README
    decisions: undefined,   // Cannot be auto-extracted safely from unstructured README
    status,
    date,
    order: typeof portfolioMeta?.order === 'number' ? portfolioMeta.order : 999,
    githubMetadata,
    _source: 'github', // Internal marker — not rendered in UI
  };
}

// ─── Main sync function ────────────────────────────────────────
async function sync() {
  console.log(`\n🔄 GitHub Portfolio Sync`);
  console.log(`   Username: ${GITHUB_USERNAME}`);
  console.log(`   Auth: ${GITHUB_TOKEN ? 'GitHub Token (5000 req/hr)' : 'No token (60 req/hr)'}\n`);

  // ── Step 1: Discover all portfolio repositories ────────────
  let allRepos = [];
  let page = 1;
  while (true) {
    const batch = await githubGet(
      `/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&type=owner&sort=updated`
    );
    if (!batch || batch.length === 0) break;
    allRepos = allRepos.concat(batch);
    if (batch.length < 100) break;
    page++;
  }

  console.log(`   Total repositories found: ${allRepos.length}`);

  // ── Step 2: Filter for portfolio-tagged, non-fork, non-archived repos
  const portfolioRepos = allRepos.filter(repo => {
    if (repo.fork) {
      console.log(`   ⏭️  Skipping fork: ${repo.name}`);
      return false;
    }
    if (repo.archived) {
      console.log(`   ⏭️  Skipping archived: ${repo.name}`);
      return false;
    }
    if (repo.name.toLowerCase() === 'portfolio') {
      console.log(`   ⏭️  Skipping portfolio repository itself: ${repo.name}`);
      return false;
    }
    const hasPortfolioTopic = (repo.topics || []).includes('portfolio');
    if (!hasPortfolioTopic) return false;
    return true;
  });

  console.log(`   Repositories with 'portfolio' topic: ${portfolioRepos.length}\n`);

  if (portfolioRepos.length === 0) {
    // Not a hard failure — could be a fresh account with no tagged repos yet.
    // Write an empty array with a warning rather than erroring.
    console.warn('⚠️  No repositories found with "portfolio" topic.');
    console.warn('   Add the "portfolio" topic to any GitHub repository to include it.');
    writeOutput([]);
    return;
  }

  // ── Step 3: Process each qualifying repository ─────────────
  const projects = [];
  const errors = [];

  for (const repo of portfolioRepos) {
    console.log(`   📦 Processing: ${repo.name}`);

    try {
      // Fetch portfolio.yaml
      let portfolioMeta = null;
      const yamlContent = await fetchRawFile(GITHUB_USERNAME, repo.name, 'portfolio.yaml');
      if (yamlContent) {
        try {
          portfolioMeta = parsePortfolioYaml(yamlContent);
          console.log(`      ✓ portfolio.yaml found and parsed`);

          // Validate
          const validationErrors = validatePortfolioMeta(portfolioMeta, repo.name);
          if (validationErrors.length > 0) {
            errors.push({ repo: repo.name, type: 'validation', errors: validationErrors });
            // Continue processing with whatever valid data exists
          }
        } catch (yamlErr) {
          console.error(`      ❌ Invalid YAML in ${repo.name}/portfolio.yaml: ${yamlErr.message}`);
          errors.push({ repo: repo.name, type: 'yaml-parse', error: yamlErr.message });
          // Fallback: use GitHub metadata only
          portfolioMeta = null;
        }
      } else {
        console.log(`      ℹ️  No portfolio.yaml — using GitHub metadata fallback`);
      }

      // Fetch README (for description fallback and section extraction)
      const readme = await fetchRawFile(GITHUB_USERNAME, repo.name, 'README.md')
        || await fetchRawFile(GITHUB_USERNAME, repo.name, 'readme.md')
        || '';

      // Build normalized project
      const project = buildProject(repo, portfolioMeta, readme);
      projects.push(project);
      console.log(`      ✓ Built: "${project.title}" (featured: ${project.featured}, category: ${project.category})`);

    } catch (err) {
      console.error(`      ❌ Failed to process ${repo.name}: ${err.message}`);
      errors.push({ repo: repo.name, type: 'processing', error: err.message });
      // Do NOT skip — if it has portfolio topic it should still appear with minimal data
    }
  }

  // ── Step 4: Sort by order → featured → updatedAt ──────────
  projects.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    if (a.featured !== b.featured) return b.featured ? 1 : -1;
    return (b.githubMetadata?.updatedAt || '').localeCompare(a.githubMetadata?.updatedAt || '');
  });

  // ── Step 5: Validate we have meaningful data before writing ─
  if (projects.length === 0 && portfolioRepos.length > 0) {
    throw new Error('Processing failed: all portfolio repositories failed. Not writing empty data to prevent blank portfolio.');
  }

  // ── Step 6: Write generated output ────────────────────────
  writeOutput(projects);

  // ── Step 7: Report summary ─────────────────────────────────
  console.log(`\n✅ Sync complete!`);
  console.log(`   Projects generated: ${projects.length}`);
  console.log(`   Featured: ${projects.filter(p => p.featured).length}`);
  if (errors.length > 0) {
    console.warn(`\n⚠️  Non-fatal errors encountered (${errors.length}):`);
    errors.forEach(e => console.warn(`   • ${e.repo}: ${e.type} — ${e.error || e.errors?.join(', ')}`));
  }
  console.log(`   Output: src/data/generated-projects.json\n`);
}

// ─── Write output file ─────────────────────────────────────────
function writeOutput(projects) {
  const output = {
    _meta: {
      generated: new Date().toISOString(),
      source: 'github-sync',
      username: GITHUB_USERNAME,
      count: projects.length,
      warning: 'THIS FILE IS GENERATED AUTOMATICALLY. DO NOT EDIT MANUALLY. Run npm run sync:github to regenerate.'
    },
    projects
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
}

// ─── Run ───────────────────────────────────────────────────────
sync().catch(err => {
  console.error(`\n❌ SYNC FAILED: ${err.message}`);
  console.error('\nThe portfolio build will NOT proceed to prevent deploying an empty or broken site.');
  console.error('Check the error above and retry with GITHUB_TOKEN set if this is a rate limit issue.\n');
  process.exit(1);
});
