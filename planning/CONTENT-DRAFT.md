# Content Draft — English With a Bangla Pulse

This is a first-pass voice draft, not final copy. The intent is plain, specific, quietly intense, and a little dry. The English carries all essential meaning; Bangla adds a personal rhythm rather than creating a translation puzzle.

## Voice rules

- Start from concrete things the owner has worked on: checkout, slow queries, payment gateways, deployment, OCR, and production incidents.
- Prefer short claims that can be defended over grand claims about being “obsessed with excellence,” “building the future,” or “solving impossible problems.”
- Use Bangla naturally and sparingly. A reader who does not understand Bangla should still understand the entire section.
- Avoid writing every paragraph as a perfect three-item list. A short aside, a sentence fragment, or a blunt factual note is welcome if it is genuinely the author's voice.
- Do not fake vulnerability, slang, personal habits, or incidents. Mustafizur should edit every line so it sounds like something he would say out loud.

## Hero

**Name:** Mustafizur Rahman  
**Role:** Full-stack & systems engineer

**Headline:**  
> It worked in staging.

**Second line:**  
> Good. Now let real traffic have a go.

**Body:**  
I work across WooCommerce, payments, security, databases, and Linux infrastructure — usually where a small failure has a way of becoming everyone's problem.

**Bangla aside:**  
সব ঠিক থাকলে কেউ দেখে না।

**English cue beside it:**  
When everything works, nobody notices.

**Proof, not animated counters:**
- 236,000+ orders processed by a production retail platform
- 134,000+ customers served by that platform
- 200+ independent client projects (confirm count definition before publishing)

The interaction can mutate the headline's surface form, but the real headline remains in the semantic/accessibility layer.

## Presence / About

**Heading:** The demo is the easy part.

Most of my experience comes from living with systems after launch: traffic spikes, odd edge cases, slow queries, payment-gateway behaviour, security problems, and the bits nobody remembers to put in the ticket.

Not just writing the feature. Figuring out what it does when conditions stop being polite.

Checkout ঠিক থাকলে সেটাই normal. When it quietly fails, you notice fast.

For six years, I was the sole technical owner of a high-volume retail platform — handling work across application code, integrations, databases, deployment, and day-to-day production problems. The platform numbers are real context, not a personal trophy.

## Production case study

**Title:** A retail platform, kept running.

**Summary:**  
I owned the technical surface across a high-volume WooCommerce operation: application behaviour, payment integrations, security, database performance, deployment, and production support. The interesting work was rarely one isolated feature; it was how the pieces behaved together.

**Evidence strip:**
- 236,000+ orders
- 134,000+ customers
- Nine services/components — only use “microservices” if that is technically accurate

**Confidentiality note:**  
Parts of this work are private. I can show the problems and decisions without publishing customer data, credentials, or internal code.

Do not claim a 99.9% uptime figure until the measurement period and evidence are confirmed.

## Selected projects

### SentinelGuard
**WooCommerce security · PHP**

I built SentinelGuard after running into the difference between generic WordPress hardening and the risks that show up at checkout. It focuses on patterns such as card testing, checkout skimmers, fake administrator accounts, and gateway tampering.

The plugin is public, and so is the source. Start there; don't take my word for it.

Links: [WordPress.org listing](https://wordpress.org/plugins/sentinelguard-ecommerce-protection/) · [GitHub source](https://github.com/Xbot-me/sentinelwp-security)

### Repo-Brain
**Codebase intelligence · Python / static analysis**

A file tree tells you where code lives. It doesn't always tell you what matters. Repo-Brain indexes imports and symbols, then ranks and packs useful context for coding agents under a token budget. Python uses its AST; several other language families use lighter extraction rules.

It is a practical structural index, not a claim that static analysis can understand every runtime path.

Link: [GitHub source](https://github.com/Xbot-me/repo-brain)

### PulseDeploy
**Linux operations · Bash**

Shell scripts aren't magic. They should tell you what they changed — and give you a way to recover. PulseDeploy helps set up and operate Linux servers across common web stacks, TLS, firewall rules, backups, deployment, rollback, and load testing.

Link: [GitHub source](https://github.com/Xbot-me/PulseDeploy)

### KhojBangla
**Bangla OCR · Python**

Old newspaper scans are messy. OCR is worse when it quietly guesses. KhojBangla preprocesses pages, separates columns and lines, runs OCR, and routes uncertain output to human review.

The current documented pipeline has been tested on synthetic two-column pages. Real historical scans still need broader validation. That distinction matters.

Link: [GitHub source](https://github.com/Xbot-me/KhojBangla)

### PerfKit
**Website performance · Lighthouse / Core Web Vitals**

PerfKit pulls performance signals into one place: Core Web Vitals, request waterfalls, filmstrip frames, screenshots, history, and prioritized audit findings. AI-assisted analysis is optional; the documented workflow is local-first.

Link: [GitHub source](https://github.com/Xbot-me/PerfKit)

### GeoProspector AI
**Lead research workflow · FastAPI / LangGraph**

A self-hosted workflow for discovering and enriching business leads, checking website quality, scoring prospects, and drafting tailored outreach. It combines a multi-step backend pipeline with a live dashboard.

The generated copy is a draft, not a message sent on anyone's behalf.

Link: [GitHub source](https://github.com/Xbot-me/GeoProspector-AI)

### Signal Watch
**Observability · Go / Prometheus / Grafana**

The supplied handoff describes this as an observability project for real-time video and WebSocket workloads. Its public repository or demo was not found during this review, so the public description should be finalized only after status, evidence, and confidentiality are confirmed.

Do not fabricate a demo link, graph screenshot, or performance claim.

## Approach / how I work

**I care about what happens after deploy.**

A system should leave clues when it goes wrong. Logs, metrics, retries, and rollback paths aren't decorations. They're how you avoid fixing the same problem twice.

I don't need every part to use the same language or framework. I need the pieces to have clear boundaries and behave predictably when the outside world doesn't.

বাংলায় বললে: সবসময় ঠিক থাকবে — এই আশা করি না। কীভাবে ফিরে আসবে, সেটা ভাবি।  
In other words: I don't expect everything to stay perfect. I think about how it recovers.

## Stack

**Most familiar:** PHP, WordPress/WooCommerce, MySQL, Linux, Docker, payment/security integrations.  
**Also used:** Python, FastAPI, PostgreSQL, Redis, Bash, TypeScript, React, Next.js.  
**Exploring/building with:** LangGraph, RAG, MCP, and related AI tooling.

Keep this as a concise tool index. Do not make all technologies look equally deep.

## Experience

**E-commerce & Systems Developer — KC Investment LLC / Kpop USA**  
2020–2026 (confirm the exact end month)

Sole technical owner across the full surface of a high-volume retail platform: application development, payment integrations, security, data, performance, deployment, and operations.

**Independent consultant**  
2019–present

200+ projects across e-commerce/CMS, integrations, debugging, performance, and production support. The count definition should be confirmed before launch.

## Contact

**Have a system that's misbehaving?**

Tell me what it's doing, what you expected, and what you've already tried. A useful bug report beats a polished pitch.

Email: hello@mustafizur.info  
GitHub: [Xbot-me](https://github.com/Xbot-me)

The contact details and email link must remain immediately usable even when the visuals are in a high-chaos state.

## Alien layer: a rule, not a translation

Never write fake alien paragraphs as if they reveal hidden expertise. The alien layer is a procedural visual mutation of the real English/Bangla copy. It has no stable grammar and no hidden message. Its only job is to make the page feel temporarily unstable, then reform.

The accessible text and links always retain their real content. No alien mutation can change a URL, a project name in the link destination, an email address, a metric, a source-code snippet, or a user's ability to select/copy the actual content.
