# Wijaywi Web Agent Reliability Lab

<p align="center">
  <img src="public/logo.png" alt="Agentic Wijaywi Logo" width="200"/>
</p>

> **AI agents can act on the web.**
> Wijaywi makes their actions observable, evidence-backed, uncertainty-aware, falsifiable, and accountable.

This project implements the **Agentic Wijaywi** architecture, a human-agent collaboration environment that treats AI agents as persistent goal-maintaining entities operating on a shared world model via **WebMCP**.

## The Problem
As AI agents become capable of operating on web properties, we need a trustworthy interface for understanding their beliefs, hypotheses, and provenance. This is an Agent Reliability and Epistemic Collaboration Layer for the Open Web.

## WebMCP Integration
Agents interact directly with this environment through `document.modelContext.registerTool`.
**You can inspect the WebMCP source code at:** `src/lib/webmcp/registerTools.ts`.

## Features
- **Epistemic Engine**: Explicit representation of Objective, Hypothesis, Evidence, and Belief.
- **Hypothesis Ledger**: Tracks failed attempts and unverified claims.
- **Falsifier Agent Role**: An adversarial approach to prevent confirmation bias.
- **Zero-API-Key Demo**: A full simulated scenario accessible in `/demo`.

## Local Setup
1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Navigate to `http://localhost:3000`.

## Testing
Run unit tests with Vitest:
```bash
npm run test
```

## Security
- Input schemas validated using Zod.
- Sandbox and Production operations have explicit `PermissionLevel` boundaries requiring human approval.

## MIT License

Copyright (c) Winjay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
