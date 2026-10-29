# Developer & Deployment Guide

This guide provides end-to-end instructions for running the portfolio locally, customizing your personal information and projects, and deploying to GitHub and Vercel.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Customization Guide](#customization-guide)
   - [Personal Details & Bio](#personal-details--bio)
   - [Profile Photo](#profile-photo)
   - [Projects Showcase](#projects-showcase)
   - [AI Assistant Knowledge Base](#ai-assistant-knowledge-base)
5. [Deploying to GitHub](#deploying-to-github)
6. [Deploying to Vercel](#deploying-to-vercel)
7. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Prerequisites

Before you start, ensure you have the following installed and set up:
- **Node.js** (v18.0.0 or higher): [nodejs.org](https://nodejs.org/)
- **Git**: [git-scm.com](https://git-scm.com/)
- **GitHub Account**: [github.com](https://github.com/)
- **Vercel Account**: [vercel.com](https://vercel.com/)
- **Anthropic API Key**: [console.anthropic.com](https://console.anthropic.com/) (for the chatbot)

---

## 2. Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arorakush081-png/portfolio.git
   cd portfolio
   ```

2. **Install Vercel CLI globally (recommended)**:
   ```bash
   npm install -g vercel
   ```

3. **Start the local development server**:
   ```bash
   vercel dev
   ```
   *Note: Using `vercel dev` is required to run the `/api/chat.js` serverless function locally.*

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 3. Environment Configuration

1. In the project root, create a file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Anthropic API Key:
   ```ini
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxx
   CHAT_MODEL=claude-3-5-haiku-20241022
   ```

3. Restart `vercel dev` to load the updated environment variables.

> ⚠️ **Important**: `.env.local` is listed in `.gitignore` and must never be pushed to your public GitHub repository.

---

## 4. Customization Guide

### Personal Details & Bio
- Edit [index.html](file:///D:/uni/second%20year/portfolio/portfolio/index.html):
  - Update `<title>` and `<meta name="description">`.
  - Update the hero headline, role tags, and about section bio.
  - Update your LinkedIn and GitHub links in the navigation and contact sections.

### Profile Photo
1. Save your portrait photo as `profile.jpg`.
2. Place it in the `assets/` folder:
   ```
   assets/profile.jpg
   ```
3. Recommended dimensions: minimum 600x750 px (aspect ratio approx 4:5 or 1:1).

### Projects Showcase
- Open [script.js](file:///D:/uni/second%20year/portfolio/portfolio/script.js).
- Locate the `projects` array at the top:
  ```javascript
  const GH = "https://github.com/arorakush081-png/";
  const projects = [
    {
      title: "Python Programs Collection",
      desc: "Factorial, Fibonacci and Structure-to-Dictionary conversion programs, with an updated README.",
      tech: ["Python", "GitHub"],
      repo: GH + "python-programs",
      live: "" // Add live URL if deployed, or leave blank
    },
    // Add additional projects here
  ];
  ```
- Each project object supports:
  - `title`: Project title displayed on the card.
  - `desc`: A concise summary of what was built and why.
  - `tech`: Array of string tags used for badges and search matching.
  - `repo`: GitHub repository URL.
  - `live`: Live demonstration URL (optional; link button is hidden if empty).

### AI Assistant Knowledge Base
- Open [api/chat.js](file:///D:/uni/second%20year/portfolio/portfolio/api/chat.js).
- Update the `PORTFOLIO` context string with any new achievements, project descriptions, or links you want the assistant to be able to talk about.
- The assistant is strictly grounded to answer using only the data defined in this prompt.

---

## 5. Deploying to GitHub

If you are setting up the repository for the first time:

1. **Initialize Git**:
   ```bash
   git init -b main
   ```

2. **Stage and commit your files**:
   ```bash
   git add .
   git commit -m "feat: portfolio release with interactive timeline and AI assistant"
   ```

3. **Link to your GitHub repository**:
   Create a new empty repository on [GitHub](https://github.com/new) named `portfolio`, then run:
   ```bash
   git remote add origin https://github.com/arorakush081-png/portfolio.git
   git branch -M main
   git push -u origin main
   ```

---

## 6. Deploying to Vercel

### Option A: Using the Vercel Web Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import the `portfolio` repository.
3. Keep default settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
4. Expand **Environment Variables**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (Your Anthropic API key)
5. Click **Deploy**.
6. Once deployed, copy your live deployment URL (e.g., `https://kush-portfolio.vercel.app`) and paste it into `README.md`.

### Option B: Deploying via Vercel CLI
```bash
# Link project to Vercel
vercel

# Add production environment variable
vercel env add ANTHROPIC_API_KEY production

# Deploy to production
vercel --prod
```

---

## 7. Troubleshooting & FAQ

#### The Chatbot responds with "Server is missing ANTHROPIC_API_KEY"
- In local development, make sure `.env.local` exists in the project root and you started the server with `vercel dev`.
- In production, check Vercel Dashboard > Project Settings > Environment Variables, and ensure `ANTHROPIC_API_KEY` is added to Production and Preview environments. After adding, trigger a redeploy.

#### Chatbot returns a 502 error
- Check whether your Anthropic account has available credits or an active billing plan.
- Check the Vercel Function logs under the **Runtime Logs** tab in your Vercel dashboard.

#### My profile image is not showing
- Ensure the image file name is exactly `profile.jpg` in lowercase and stored inside the `assets/` folder.
- If no image is provided, `index.html` has an `onerror="this.style.display='none'"` fallback that gracefully hides the image container without breaking layout.
