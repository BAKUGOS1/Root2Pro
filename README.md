# Root2Pro

**Learn from the root. Build like a pro.**

Root2Pro is a roadmap-first interactive learning platform for students and developers. It combines visual learning paths with deep topic workspaces built around a repeatable learning loop:

```text
Root -> Practice -> Build -> Pro -> Recall
```

## What this repository contains

This migration version converts Root2Pro from a simple course-folder repository into an interactive learning platform foundation.

```text
root2pro/
├── src/                     Astro application source
├── content/                 Topic, project and question content
├── data/                    Curriculum graph and registry data
├── schemas/                 JSON Schema and Zod validators
├── scripts/                 Validation and index generation scripts
├── docs/                    Migration, architecture and product notes
├── public/                  Static assets
└── .github/                 Workflows and contribution templates
```

## MVP pilot tracks

| Track | Purpose | Status |
|---|---|---|
| Git & GitHub | Version control and collaboration foundation | Pilot graph |
| HTML | Web structure foundation | Pilot graph |

More tracks will be added after the pilot validation flow is stable.

## Local development

```bash
npm install
npm run validate
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Contribution philosophy

Root2Pro is not a notes dump. Every topic should help a beginner understand, practice, build, improve, and recall.

Before contributing, read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [content-style-guide.md](content-style-guide.md)
- [docs/migration/MIGRATION_STEPS.md](docs/migration/MIGRATION_STEPS.md)
