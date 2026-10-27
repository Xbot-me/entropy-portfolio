# Content Inventory & Evidence Ledger

## Identity and positioning

| Item | Current known value | Publication note |
|---|---|---|
| Name | Mustafizur Rahman | Confirm preferred display spelling and any professional short name. |
| Core positioning | Full-stack / systems engineer | Lead with systems ownership and production work; avoid implying equal seniority in every framework. |
| Primary specialism | Production e-commerce, WooCommerce, payment flows, performance, security, infrastructure | Strong differentiator because it is grounded in real operational ownership. |
| Experience | 6+ years | Safe as a broad statement if dates remain consistent. |
| Independent work | 200+ client/freelance projects | Preserve if the count can be defended; distinguish client projects from small tasks. |
| Production scale | 236,000+ orders; 134,000+ customers | The supplied handoff identifies these as platform figures. Use “platform processed/served” rather than implying the portfolio author personally generated those numbers. |
| Uptime | 99.9% | **Confirm before publication.** Need the measured system, period, monitoring method, and whether this was an SLA or observed availability. |
| Services operated | 9 | Supplied handoff says nine Dockerized services/microservices. **Confirm what “service” means** before calling them microservices. |
| Current location | Dhaka, Bangladesh | Optional. Do not make location central to the positioning. |
| Education | BSc in CSE, Daffodil International University | Include only if the live portfolio currently includes it or the owner confirms it belongs in the inventory. |

## Experience

### KC Investment LLC / Kpop USA

**Role:** E-commerce & Systems Developer; described as sole technical owner for the platform.

**Scope in the supplied handoff:** WordPress/WooCommerce, HPOS, payment integrations, anti-fraud, database/performance work, deployment, infrastructure, and production support.

**Dates need reconciliation:** the supplied handoff says 2020–present, but more recent career context indicates the engagement ended in 2026. For the draft, use **2020–2026** and verify the exact end month before launch. Never retain “present” just because it exists in an older file.

**Numbers:** 236,000+ orders, 134,000+ customers. These are platform scale metrics, not personal performance metrics. Pair them with the owner’s responsibility and scope.

**Confidentiality:** Do not expose private dashboards, customer data, source code, incident details, merchant credentials, payment IDs, or non-public company information. A sanitized architecture diagram or clearly labelled public case study is preferable.

### Independent consulting

**Dates:** 2019–present (supplied handoff).  
**Scale:** 200+ client projects (supplied handoff).  
**Scope:** CMS/e-commerce, full-stack work, API integration, plugin development, debugging, performance optimization, deployment and ongoing support.

Do not manufacture client logos or testimonials. If the majority of work was under NDA, say so plainly and use anonymized, technically specific examples.

## Project inventory

### 1. SentinelGuard — WooCommerce security

- **Year:** 2026 (supplied handoff; verify first public release date if year matters).
- **Public evidence:** [GitHub repository](https://github.com/Xbot-me/sentinelwp-security), [WordPress.org listing](https://wordpress.org/plugins/sentinelguard-ecommerce-protection/).
- **README supports:** WordPress/WooCommerce protection focused on checkout/card-testing attacks, checkout skimmers/Magecart-style script behavior, fake administrator accounts, gateway tampering, checkout flooding, and pre-gateway risk scoring. The README describes an observe-first workflow and WooCommerce HPOS readiness.
- **Portfolio angle:** a security tool rooted in operating real commerce systems, not another generic WordPress scanner.
- **Avoid:** claiming it prevents every fraud pattern or is independently audited unless evidence exists. Be precise about which detections are implemented and which are experimental.

### 2. Repo-Brain — codebase intelligence

- **Year:** 2025 in supplied handoff.
- **Public evidence:** [GitHub repository](https://github.com/Xbot-me/repo-brain).
- **README supports:** lightweight import-graph indexing, multi-signal symbol search, context budgeting for AI coding agents, AST parsing for Python, regex-based symbol extraction for several other languages, graph/PageRank ranking, and 0/1-knapsack packing under token budgets. Core use is offline and the README advertises zero required dependencies.
- **Portfolio angle:** making code structure and context selection inspectable.
- **Avoid:** calling it a complete semantic-understanding engine. The README notes limitations around dynamic/runtime behavior and language-specific parsing.

### 3. Signal Watch — observability

- **Year:** 2026 in supplied handoff.
- **Stack in handoff:** Go, Prometheus, Grafana.
- **Purpose in handoff:** observability for real-time video/WebSocket workloads.
- **Public source link:** **not located in the connected public repositories during this review.**
- **Action:** keep it in the content inventory, but do not claim it is open source or link to a guessed repository. Confirm whether it is private, unfinished, NDA-bound, renamed, or available under another URL. If private, a sanitized diagram and clear project-status label are acceptable.

### 4. PulseDeploy — server automation

- **Year:** 2024 in supplied handoff.
- **Public evidence:** [GitHub repository](https://github.com/Xbot-me/PulseDeploy).
- **README supports:** a modular Bash toolkit for preparing and operating Linux servers, including LEMP/LAMP and Node stacks, TLS, firewall, backups, Redis, deployment/rollback operations, auditing/tuning, and load testing. It supports VPS and AWS EC2 scenarios.
- **Portfolio angle:** infrastructure automation that stays inspectable and recoverable.
- **Avoid:** displaying a fake terminal transcript as if it were an actual run or inventing flags/commands. Any terminal visual is illustrative unless it is captured from a verified invocation.

### 5. PerfKit — local performance analysis

- **Year:** 2024 in supplied handoff.
- **Public evidence:** [GitHub repository](https://github.com/Xbot-me/PerfKit).
- **README supports:** local Lighthouse-style analysis, Core Web Vitals, request waterfalls, filmstrip and screenshots, history/trends, prioritized audit recommendations, and optional Groq-powered analysis. The README says data stays local except for optional AI analysis.
- **Portfolio angle:** a developer tool for interpreting performance findings, not simply a score badge.
- **Avoid:** implying every feature runs in production on Cloudflare; the README describes a local desktop-oriented workflow.

### 6. KhojBangla — Bangla newspaper OCR

- **Year:** 2024 in supplied handoff.
- **Public evidence:** [GitHub repository](https://github.com/Xbot-me/KhojBangla).
- **README supports:** newspaper image preprocessing, two-column and line segmentation, OCR engine abstraction, confidence gating, SQLite storage of multiple engine outputs, a human-review queue, and a Streamlit interface with review/search/process flows.
- **Important status caveat:** the README says the pipeline was validated on a synthetic two-column Bangla test page and that real old newspaper scans still need broader validation. State that clearly if discussing accuracy. Do not claim production-grade historical archive OCR without real-scan evidence.
- **Portfolio angle:** language access and honest uncertainty handling.

### 7. GeoProspector AI — lead research workflow

- **Year:** 2024 in supplied handoff.
- **Public evidence:** [GitHub repository](https://github.com/Xbot-me/GeoProspector-AI).
- **README supports:** a self-hosted B2B lead-discovery and enrichment workflow using LangGraph, FastAPI, PostgreSQL, a browser/dashboard layer, website checks, prospect scoring, and AI-assisted outreach drafting.
- **Portfolio angle:** an end-to-end workflow combining data acquisition, enrichment, scoring, and a UI.
- **Avoid:** presenting generated outreach as sent messages, or suggesting all sources are authoritative. Describe it as lead research and drafting; respect source terms and privacy law.

## Technical inventory

From the supplied handoff, the current skill set includes:

- **Commerce/backend:** PHP 8.x, WordPress, WooCommerce, HPOS, payment gateways, REST APIs, MySQL.
- **Services/data:** Python, FastAPI, PostgreSQL, Redis, service integration.
- **Frontend:** JavaScript/TypeScript, React, Next.js, Tailwind.
- **Operations:** Linux, Docker, Bash, CI/CD, deployment, observability, performance troubleshooting.
- **AI tooling:** LangGraph, RAG/MCP-related learning and experiments (phrase as current exploration, not deep professional expertise unless confirmed).

The stack is evidence, not the headline. Avoid a giant skill constellation where every technology appears equally important.

## Claims to verify before public release

1. Whether uptime is truly 99.9%, and over which measured period.
2. The exact date the KC Investment LLC/Kpop USA engagement ended.
3. Whether “9 microservices” is technically accurate or should read “nine services/components.”
4. The public status and evidence link for Signal Watch.
5. The exact WordPress.org listing and public release date for SentinelGuard.
6. Which project demonstrations can safely be shown without exposing NDA material.
7. Whether “200+ projects” is a project count, client count, or a mixture.

## Content rules

- Use numbers only when there is an attributable source or a defensible owner-confirmed basis.
- Separate the owner’s action from the business/platform outcome.
- Label public repositories, private client work, prototypes, and research projects differently.
- A caveat is better than fake certainty. It makes the portfolio more credible, not less.
