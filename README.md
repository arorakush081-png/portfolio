# Kush Middha — Personal Portfolio & AI Assistant

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Anthropic Claude](https://img.shields.io/badge/AI-Claude%203.5%20Haiku-blueviolet?style=flat&logo=anthropic)](https://www.anthropic.com)
[![JavaScript](https://img.shields.io/badge/Language-Vanilla%20JS%20(ES6+)-yellow?style=flat&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, high-performance personal portfolio for **Kush Middha** — Video Editor, Graphic Designer, and Computer Science Engineering student at JECRC University, Jaipur. Features a live SMPTE video timeline scrubbing engine, client-side project search, dark/light theme switching, and an intelligent AI assistant powered by Claude 3.5.

---

## 🌟 Live Demo

- **Live Deployment:** [Deploy on Vercel](#deploying-to-vercel) *(Add your live Vercel URL here)*
- **GitHub Profile:** [@arorakush081-png](https://github.com/arorakush081-png)
- **LinkedIn:** [Kush Middha](https://www.linkedin.com/in/kush-middha-650722381)

---

## ✨ Features

- **🎬 Interactive Video Editor Timeline**: A custom hero element simulating a multi-track Non-Linear Editor (NLE). Hover or drag across the timeline to scrub playhead position and compute real-time SMPTE timecode (`00:00:00:00`).
- **🤖 Grounded AI Portfolio Assistant**: An embedded chatbot running on a secure serverless backend proxy (`/api/chat`). Visitors can ask freeform questions or choose quick chips to learn about Kush's experience, skills, and background without leaking API secrets.
- **⚡ Instant Multi-Attribute Project Search**: Zero-delay client-side search filtering projects across title, description, and technology tags simultaneously.
- **🌓 Adaptive Theme Engine**: Supports dark and light modes with seamless persistence in `localStorage` and fallback to OS-level system preferences (`prefers-color-scheme`).
- **📱 Fully Responsive & Accessible**: Crafted with semantic HTML5, accessible ARIA roles, live regions, responsive typography using modern CSS `clamp()`, and reduced-motion compliance.
- **🚀 Ultra-Fast Zero-Framework Frontend**: No heavy runtime frameworks or bundlers required — delivers near-instant Time to First Byte (TTFB) and perfect Core Web Vitals scores.

---

## 🏗️ System Architecture & Flow

The portfolio follows a secure **Serverless Backend-For-Frontend (BFF)** architecture:

```
[ Visitor Browser (Client) ]
       │
       ├──► Static Assets (HTML5, CSS3, ES6+ JS) ── Served from Vercel Edge CDN
       │
       └──► Chat Query ──► POST /api/chat (Vercel Serverless Function)
                                 │
                                 ├──► Grounded Knowledge Base Prompt
                                 ├──► Enforce Payload & History Depth Limits
                                 └──► Anthropic Messages API (Claude 3.5 Haiku)
```

> 📖 **Deep Dive**: For full sequence diagrams, component breakdowns, security specifications, and data flow charts, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📁 Project Structure

```
portfolio/
├── .env.example          # Environment variables template
├── .gitignore            # Git exclusion rules
├── ARCHITECTURE.md       # Comprehensive system architecture & flow documentation
├── GUIDE.md              # Detailed developer setup & deployment guide
├── README.md             # Repository documentation & overview
├── index.html            # Semantic HTML5 layout and accessibility markup
├── style.css             # Design tokens, variables, typography, and responsive styles
├── script.js             # Timeline scrubbing, project search, theme, & chat client
├── package.json          # Node project configuration and scripts
├── vercel.json           # Vercel deployment and security header configuration
├── api/
│   └── chat.js           # Serverless proxy function connecting to Anthropic Claude
└── assets/
    ├── README.md         # Guidelines for asset management
    └── profile.jpg       # Profile picture (recommended: 4:5 or 1:1 portrait)
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5 Semantic Markup, Modern CSS3 (Grid, Flexbox, Custom Properties), Vanilla JavaScript (ES6+) |
| **Backend / Edge** | Vercel Serverless Functions (Node.js runtime, ES Modules) |
| **AI / LLM Engine** | Anthropic Claude 3.5 Haiku via Messages API |
| **Deployment & Hosting**| Vercel Edge Network, GitHub |
| **Typography** | Bricolage Grotesque, DM Sans (Google Fonts) |

---

## 🚀 Quickstart & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/arorakush081-png/portfolio.git
cd portfolio
```

### 2. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Add your Anthropic API key to `.env.local`:
```ini
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CHAT_MODEL=claude-3-5-haiku-20241022
```

### 3. Run Locally with Vercel CLI
```bash
# Install Vercel CLI globally if you haven't already
npm install -g vercel

# Start local dev server (emulates serverless functions at /api/chat)
vercel dev
```

Visit `http://localhost:3000` in your browser.

> 📖 For full setup and customization details, refer to [GUIDE.md](GUIDE.md).

---

## ☁️ Deploying to Vercel

1. Push this repository to your GitHub account ([see deployment guide](GUIDE.md#deploying-to-github)).
2. Log into [Vercel](https://vercel.com/) and click **Add New... > Project**.
3. Import your `portfolio` repository.
4. In the **Environment Variables** section, add:
   - `ANTHROPIC_API_KEY`: Your private Anthropic key
5. Click **Deploy**.

---

## ⚙️ Environment Variables

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `ANTHROPIC_API_KEY` | **Yes** | Your API key from Anthropic Console | — |
| `CHAT_MODEL` | No | Claude model identifier | `claude-3-5-haiku-20241022` |

---

## 👤 Author

**Kush Middha**  
- GitHub: [@arorakush081-png](https://github.com/arorakush081-png)  
- LinkedIn: [kush-middha](https://www.linkedin.com/in/kush-middha-650722381)  
- Institution: B.Tech Computer Science Engineering, JECRC University, Jaipur  

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
