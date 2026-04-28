# STAYZ — Accessible Hotel Booking Platform

> An open-source, accessibility-first hotel booking platform aligned with UN Sustainable Development Goals.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-brightgreen)](https://accesible-booking.vercel.app)
[![DPG Aligned](https://img.shields.io/badge/DPG-Aligned-blue)](https://digitalpublicgoods.net/)

**Live Demo:** https://accesible-booking.vercel.app  
**Repository:** https://github.com/Lazynx/accesible-booking

---

## Table of Contents

- [About the Project](#about-the-project)
- [Problem & Solution](#problem--solution)
- [SDG Alignment](#sdg-alignment)
- [DPG Justification](#dpg-justification)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Market & Competitor Analysis](#market--competitor-analysis)
- [Sustainability Strategy](#sustainability-strategy)
- [How to Contribute](#how-to-contribute)
- [License](#license)
- [Team](#team)

---

## About the Project

**STAYZ** is a free, open-source hotel booking platform built with accessibility as a core principle — not an afterthought. Most existing booking platforms (Booking.com, Airbnb, Hotels.com) are designed for the average user, leaving people with visual, motor, or cognitive disabilities with a frustrating and often unusable experience.

STAYZ addresses this gap by providing a WCAG 2.1-compliant booking interface that works for everyone, with a transparent codebase that any developer, NGO, or government body can audit, deploy, or extend.

---

## Problem & Solution

**Problem:**  
Over 1.3 billion people worldwide live with some form of disability (WHO, 2023). The vast majority of travel and accommodation platforms fail to meet basic accessibility standards — broken screen reader support, poor color contrast, non-keyboard-navigable interfaces — effectively excluding a significant portion of the global population from independent travel booking.

**Solution:**  
STAYZ is a fully open-source booking platform that:
- Meets **WCAG 2.1 AA** accessibility standards out of the box
- Provides a clean, distraction-free UI designed with cognitive accessibility in mind
- Can be self-hosted by NGOs, travel agencies, or governments at zero licensing cost
- Is fully transparent — any organization can audit the code for privacy and data handling

---

## SDG Alignment

| SDG | Goal | How STAYZ Contributes |
|-----|------|-----------------------|
| **SDG 10** | Reduced Inequalities | Removes digital barriers for people with disabilities in accessing travel services |
| **SDG 11** | Sustainable Cities and Communities | Promotes inclusive infrastructure by supporting accessible tourism |
| **SDG 17** | Partnerships for the Goals | Open-source model encourages collaboration between developers, NGOs, and governments |

---

## DPG Justification

STAYZ is designed to meet the [Digital Public Goods Standard](https://digitalpublicgoods.net/standard/):

| DPG Criterion | Status |
|---------------|--------|
| Open-source license (MIT) | ✅ |
| Relevance to SDGs | ✅ SDG 10, 11, 17 |
| No harmful content | ✅ |
| Privacy compliance (no user tracking) | ✅ |
| Open standards (WCAG 2.1, REST) | ✅ |
| Community contribution model | ✅ |

---

## Features

- **Accessible Search** — keyboard-navigable search with ARIA labels and screen reader support
- **Hotel Listings** — filterable, accessible hotel cards with contrast-compliant design
- **Booking Flow** — simplified, step-by-step booking process designed for cognitive accessibility
- **Responsive Design** — fully functional on mobile and desktop
- **Dark/Light Mode** — system-preference aware theme switching
- **Open API-ready** — structured for easy backend integration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Package Manager | pnpm |
| Deployment | Vercel |
| Linting | ESLint |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Lazynx/accesible-booking.git

# Navigate to the project directory
cd accesible-booking

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
accesible-booking/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components (accessible by default)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── public/               # Static assets
├── styles/               # Global CSS styles
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

---

## Market & Competitor Analysis

### Competitor Positioning

| Platform | Open Source | Accessible | Self-hostable | Free |
|----------|-------------|------------|---------------|------|
| Booking.com | ❌ | ❌ | ❌ | ❌ |
| Airbnb | ❌ | ⚠️ Partial | ❌ | ❌ |
| Hotels.com | ❌ | ❌ | ❌ | ❌ |
| **STAYZ** | ✅ | ✅ | ✅ | ✅ |

### SWOT Analysis

| | Positive | Negative |
|---|----------|----------|
| **Internal** | **Strengths:** Fully accessible, open-source, zero licensing cost, community-driven | **Weaknesses:** No native payment processing, smaller initial feature set, early-stage community |
| **External** | **Opportunities:** 1.3B+ underserved users, growing DPG funding, NGO partnerships, grant eligibility | **Threats:** Large platforms adding accessibility features, slow developer adoption, limited marketing budget |

---

## Sustainability Strategy

### User Acquisition
Partner with 3–5 independent hotels and hostels in Central Asia to pilot STAYZ as their primary booking interface, offering free onboarding support in exchange for public case studies and testimonials.

### Fundraising
Apply for grants from UNICEF's DPG program and the Open Source Collective, while offering a paid white-label deployment plan for travel agencies that want to self-host STAYZ under their own brand.

### Inspiration: WordPress
WordPress sustains itself through Automattic's commercial services (WordPress.com, WooCommerce, Jetpack) while keeping the core software fully open source — demonstrating that open-source and commercial sustainability are not mutually exclusive.

---

## How to Contribute

We welcome contributions from developers, designers, accessibility experts, and translators!

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: describe your change"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style (TypeScript + ESLint)
- All new UI components **must** meet WCAG 2.1 AA standards
- Write clear commit messages using [Conventional Commits](https://www.conventionalcommits.org/)
- Test your changes on both desktop and mobile
- Check for accessibility using a screen reader or browser extension (e.g., axe DevTools)

### Good First Issues

Look for issues labeled `good first issue` to get started. These are small, well-scoped tasks ideal for new contributors.

### Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Please be respectful, inclusive, and constructive in all interactions.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

**What this means:**
- ✅ You can use, copy, modify, and distribute this software
- ✅ You can use it for commercial projects
- ✅ You must include the original license and copyright notice
- ❌ The authors provide no warranty

MIT was chosen to maximize adoption — especially by NGOs, governments, and developers in low-resource environments — while remaining compatible with the DPG standard.

---

## Team
| Name | Role | Contributions |
|------|------|---------------|
| Kudinov Vladislav | Lead Developer & Architect | Project setup, Next.js structure, core booking flow, deployment |
| Yerlan Yessenuly | Frontend Developer | UI components, Tailwind styling, responsive design |
| Tsoy Alexandr | Accessibility Specialist | WCAG compliance review, ARIA implementation, testing |
| Kubenova Aruzhan | Documentation & Research | README, SDG analysis, competitor research, SWOT |
| Kuleshov Ilya | QA & DevOps | Manual testing, bug reporting, Vercel deployment configuration, Dependabot setup |
