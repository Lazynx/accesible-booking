# Contributing to STAYZ

Thank you for your interest in contributing to STAYZ — an open-source, accessibility-first hotel booking platform. This guide covers everything you need to get started.

Please also read our [Code of Conduct](.github/CODE_OF_CONDUCT.md) before participating.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Forking & Pull Requests](#forking--pull-requests)
- [Code Style](#code-style)
- [Review Process](#review-process)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Local setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/accesible-booking.git
cd accesible-booking

# 2. Install dependencies
pnpm install

# 3. Start the dev server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Forking & Pull Requests

### 1. Fork the repository

Click **Fork** on the [GitHub repo page](https://github.com/Lazynx/accesible-booking) to create your own copy.

### 2. Create a feature branch

Always branch off `master`. Use a descriptive name:

```bash
git checkout -b feat/keyboard-navigation
git checkout -b fix/contrast-ratio-header
git checkout -b docs/update-readme
```

Branch naming conventions:

| Prefix | When to use |
|--------|-------------|
| `feat/` | New feature or enhancement |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code change with no functional effect |
| `a11y/` | Accessibility improvement |
| `chore/` | Tooling, dependencies, config |

### 3. Make your changes

- Keep commits focused — one logical change per commit.
- Write clear commit messages in the imperative mood:
  ```
  fix: improve focus ring visibility on booking button
  feat: add skip-to-content link for keyboard users
  ```

### 4. Check your work

```bash
pnpm lint      # ESLint
pnpm build     # Verify the project builds without errors
```

If your change touches UI, manually verify it with a screen reader (VoiceOver on macOS, NVDA on Windows) and keyboard-only navigation.

### 5. Open a Pull Request

Push your branch and open a PR against `master`:

```bash
git push origin feat/your-branch-name
```

In your PR description, include:

- **What** — a brief summary of the change
- **Why** — the motivation or issue it addresses (link the issue with `Closes #123`)
- **Accessibility** — how you verified the change meets WCAG 2.1 AA, if applicable
- Screenshots or a short screen recording for visual changes

---

## Code Style

The project uses **TypeScript**, **Next.js 16**, **Tailwind CSS v4**, and **shadcn/ui** (Radix UI primitives). Follow the patterns already established in the codebase.

### TypeScript

- Prefer explicit types over `any`. Use `unknown` when the type is truly unknown.
- Use `interface` for object shapes, `type` for unions and aliases.
- Avoid type assertions (`as`) unless unavoidable; add a comment explaining why.

### React & Next.js

- Use Server Components by default; add `"use client"` only when you need browser APIs or interactivity.
- Co-locate a component's styles, logic, and markup. Avoid splitting trivial helpers into separate files.
- Name components in PascalCase; name files to match the component (`BookingCard.tsx`).

### Tailwind CSS

- Use utility classes directly — do not write custom CSS unless a utility doesn't exist.
- Keep className strings readable: group related utilities (layout → spacing → typography → color → interaction).
- Use `cn()` from `lib/utils` to conditionally join classes.

### Accessibility (non-negotiable)

All UI contributions must:

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<header>`, etc.)
- Provide meaningful `aria-label` or `aria-labelledby` for interactive elements that lack visible text
- Meet **WCAG 2.1 AA** contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Be fully operable via keyboard (visible focus styles required)
- Not rely solely on color to convey information

---

## Review Process

### What to expect

1. A maintainer will review your PR within **3–5 business days**.
2. Automated checks (lint + build) must pass before review begins.
3. Reviewers may request changes — address each comment and re-request review when done.
4. Once approved by at least **one maintainer**, the PR will be merged into `master`.

### Review criteria

| Area | What reviewers check |
|------|----------------------|
| Correctness | Does the change do what it claims? No regressions? |
| Accessibility | WCAG 2.1 AA compliance, keyboard navigability, screen reader support |
| Code quality | Follows project conventions, no unnecessary complexity |
| Scope | Change is focused; no unrelated edits bundled in |
| Tests/verification | Evidence that the change was manually tested |

### Feedback etiquette

- Reviewers: be specific and constructive. Suggest alternatives when blocking.
- Contributors: treat feedback as collaborative, not personal. Ask for clarification if a comment is unclear.

---

## Reporting Issues

Found a bug or have a feature idea? Open an issue on GitHub:

- **Bug report** — include steps to reproduce, expected vs. actual behavior, and your browser/OS.
- **Feature request** — describe the problem it solves and who benefits.
- **Accessibility issue** — include the assistive technology and version you were using.

For security vulnerabilities, do **not** open a public issue. Contact the maintainers directly.

---

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
