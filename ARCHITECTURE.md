# System Architecture & Design Flow

This document details the architectural design, data flows, security model, and component interactions of **Kush Middha's Portfolio**.

---

## 1. High-Level Architectural Overview

The portfolio is architected as a modern, lightweight hybrid application:
- **Presentation Layer (Frontend)**: Static, zero-dependency, ultra-fast client-side application built with semantic HTML5, modern CSS3 (Custom Properties & CSS Grid/Flexbox), and vanilla JavaScript (ES6+).
- **Compute Layer (BFF / Serverless Gateway)**: A secure Vercel Serverless Function (`/api/chat.js`) that acts as a Backend-For-Frontend (BFF), protecting sensitive credentials and enforcing request validation.
- **AI Intelligence Layer (LLM Service)**: Anthropic Messages API (`claude-3-5-haiku-20241022`) executing grounded prompt inference to answer visitor inquiries accurately.

```mermaid
flowchart TD
    subgraph Client["Client Tier (Browser)"]
        UI["Responsive Web Interface\n(HTML5 / CSS3 / Vanilla JS)"]
        TimelineEngine["Interactive Timeline\nScrub Engine"]
        SearchFilter["Client-side Search\n& Filter Engine"]
        ThemeStore["Theme State Store\n(localStorage + matchMedia)"]
        ChatWidget["AI Assistant\nInteractive Widget"]
    end

    subgraph CDN["Edge & CDN Tier (Vercel)"]
        EdgeEdge["Global Edge Network\n(Static Asset Caching)"]
        ServerlessProxy["Vercel Serverless Function\n(/api/chat.js)"]
    end

    subgraph External["External Cloud Tier"]
        AnthropicAPI["Anthropic Claude API\n(claude-3-5-haiku)"]
    end

    UI --> EdgeEdge
    ChatWidget -- "POST /api/chat\n(JSON: message, history)" --> ServerlessProxy
    ServerlessProxy -- "Sanitized Request\n+ Grounded System Prompt\n+ ANTHROPIC_API_KEY" --> AnthropicAPI
    AnthropicAPI -- "Generated JSON Stream" --> ServerlessProxy
    ServerlessProxy -- "HTTP 200 { reply: text }" --> ChatWidget
```

---

## 2. Data Flow & Sequence Diagrams

### 2.1 AI Assistant Request Flow

The chatbot employs a privacy-first proxy pattern. At no point is the Anthropic API key exposed to the client.

```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Portfolio Visitor
    participant UI as Browser (script.js)
    participant API as Vercel Function (/api/chat.js)
    participant Claude as Anthropic API (Claude 3.5 Haiku)

    Visitor->>UI: Types question or clicks quick chip
    UI->>UI: Validate input & render user message in chat log
    UI->>UI: Disable submit & display 'Thinking...' indicator
    UI->>API: HTTP POST /api/chat { message, history[last 10] }
    
    activate API
    API->>API: Check HTTP method (POST only)
    API->>API: Verify ANTHROPIC_API_KEY exists in process.env
    API->>API: Sanitize input (slice text to max 500 chars)
    API->>API: Assemble grounded system prompt + conversation history
    API->>Claude: POST https://api.anthropic.com/v1/messages
    activate Claude
    Claude-->>API: 200 OK Response (JSON with content blocks)
    deactivate Claude
    API->>API: Extract text blocks & format payload
    API-->>UI: 200 OK { reply: "..." }
    deactivate API

    UI->>UI: Replace 'Thinking...' with formatted assistant response
    UI->>UI: Append exchange to local history buffer (max 12 turns)
    UI->>UI: Re-enable submit button & refocus input
    UI-->>Visitor: Displays response
```

---

### 2.2 Client-Side Instant Search & Filter Flow

The project grid uses an in-memory client-side search engine with multi-field matching (Title, Description, and Technology tags) running at 60 FPS without layout thrashing.

```mermaid
flowchart LR
    Start([User Types in Search Input]) --> ReadQuery[Extract & Trim Query]
    ReadQuery --> Normalize[Convert to Lowercase]
    Normalize --> FilterProjects{Filter projects array}
    
    FilterProjects -- Matches Title, Desc, or Tags --> MatchList[Add to Filtered List]
    FilterProjects -- No Match --> IgnoreItem[Skip Item]
    
    MatchList --> ClearDOM[Clear Grid InnerHTML]
    IgnoreItem --> ClearDOM
    
    ClearDOM --> RenderCards[Generate Article Cards & Tags]
    RenderCards --> UpdateCounter["Update Counter Text\n('X of Y projects')"]
    UpdateCounter --> DisplayResults([Updated UI Rendered])
```

---

### 2.3 Video Timeline Scrubbing Engine

As a video editor and media creator, the hero section showcases an interactive NLE-style (Non-Linear Editor) timeline that visualizes editing tracks and calculates SMPTE timecode dynamically based on cursor pointer coordinates.

```mermaid
flowchart TD
    PointerEvent["PointerMove Event on #timeline"] --> GetCoords["Get BoundingClientRect & Cursor X"]
    GetCoords --> CalcPercent["Normalize Position (0.0 to 1.0)"]
    CalcPercent --> UpdatePlayhead["Move Playhead Element (left: p%)"]
    CalcPercent --> CalcFrames["Calculate Frame Number:\nf = round(p * 30 * 60 * 24)"]
    CalcFrames --> FormatSMPTE["Convert Frames into HH:MM:SS:FF\n(SMPTE Timecode Format)"]
    FormatSMPTE --> RenderTimecode["Update #tc Text Content"]
```

---

### 2.4 Theme State Management Flow

The application persists user preference across visits while gracefully honoring system-level OS preferences (`prefers-color-scheme`).

```mermaid
stateDiagram-v2
    [*] --> CheckStorage: Page Load
    CheckStorage --> LoadSavedTheme: localStorage has 'theme'
    CheckStorage --> DetectSystemPref: No saved theme
    DetectSystemPref --> SetLight: OS is Light Mode
    DetectSystemPref --> SetDark: OS is Dark Mode (Default)
    
    LoadSavedTheme --> ActiveState: Apply data-theme attribute
    SetLight --> ActiveState: Apply data-theme="light"
    SetDark --> ActiveState: Apply data-theme="dark"
    
    ActiveState --> ToggleClick: User Clicks Theme Button
    ToggleClick --> ToggleTheme: Switch (Light <-> Dark)
    ToggleTheme --> SaveLocalStorage: Persist in localStorage
    SaveLocalStorage --> ActiveState: Update data-theme & Button Label
```

---

## 3. Directory Structure & File Responsibilities

```
portfolio/
├── .env.example          # Environment variable reference template
├── .gitignore            # Excludes secrets, node_modules, and cache files
├── ARCHITECTURE.md       # Architectural blueprints and flow specifications
├── GUIDE.md              # Complete developer setup and deployment guide
├── README.md             # Project overview, quickstart, and features
├── index.html            # Semantic structure, accessibility labels, and metadata
├── style.css             # Design tokens, CSS variables, dark/light theme, typography
├── script.js             # Client state, timeline engine, search filter, and chat client
├── package.json          # Node.js project manifest and developer scripts
├── vercel.json           # Vercel deployment configuration and security headers
├── api/
│   └── chat.js           # Serverless proxy function connecting to Anthropic Claude
└── assets/
    ├── README.md         # Asset instructions
    └── profile.jpg       # Profile picture (placeholder instructions provided)
```

---

## 4. Security & Robustness Highlights

1. **Zero Secret Exposure**: The `ANTHROPIC_API_KEY` is strictly managed within Vercel's server environment. It is never bundled into client-side JS or committed to version control.
2. **Grounding & Jailbreak Mitigation**: The system prompt constrains the model to answer *only* about Kush Middha's background, education, and projects, directing unanswerable queries to LinkedIn or GitHub.
3. **Payload Truncation**:
   - Message character length capped at 500 characters per turn.
   - Conversation history depth capped at 10 items sent to the API, and maximum 12 items retained locally to prevent context bloat and token exhaustion.
4. **Defensive Error Handling**: The frontend handles network timeouts, invalid JSON responses, and HTTP error statuses gracefully, displaying informative feedback without crashing the interface.
5. **Modern Security Headers**: `vercel.json` provides `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Referrer-Policy: strict-origin-when-cross-origin`.
