// Vercel serverless function. The API key stays on the server as an environment variable.
const PORTFOLIO = `
You are the assistant on Kush Middha's portfolio website. Answer ONLY from the information below. If the answer is not here, say you don't have that information and suggest checking GitHub (https://github.com/arorakush081-png) or LinkedIn. Keep answers short and friendly.

ABOUT: Kush Middha is a B.Tech Computer Science Engineering student at JECRC University, Jaipur. He is also a video editor, graphic designer, photographer and videographer.
EXPERIENCE: Video editor at a Jaipur-based company. Member of the JU VERSE media team (video editing, plus graphic design, photography, videography).
SKILLS: Video (editing, cinematic storytelling, post-production); Design (graphic design, visual communication, creative layouts); Media (photography, videography, event coverage); Technical (Python, C++, HTML, CSS, JavaScript, Git and GitHub, Cursor AI).
LINKS: GitHub https://github.com/arorakush081-png ; LinkedIn https://www.linkedin.com/in/kush-middha-650722381
PROJECTS:
1. Python Programs Collection: factorial, Fibonacci and Structure-to-Dictionary conversion programs, with an updated README.
2. Messy Python Code Improvement: a messy Python script improved with AI assistance.
3. Bug Fixing Using Cursor AI: a buggy program identified and corrected using Cursor AI.
4. Interactive Quiz Application: a quiz app from Lecture 10 (HTML, CSS, JavaScript).
5. Book Reading List Application: a reading list app from Lecture 11 (HTML, CSS, JavaScript) whose README has the deployed link.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== "string") return res.status(400).json({ error: "No message" });
  const messages = [...history.slice(-10), { role: "user", content: message.slice(0, 500) }];
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.CHAT_MODEL || "claude-3-5-haiku-20241022", max_tokens: 400, system: PORTFOLIO, messages })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || "API error " + r.status });
    res.status(200).json({ reply: data.content.filter(b => b.type === "text").map(b => b.text).join("") });
  } catch (e) {
    res.status(502).json({ error: "Could not reach the API" });
  }
}
