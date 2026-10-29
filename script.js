// ---- Projects: edit repo names / live links here ----
const GH = "https://github.com/arorakush081-png/";
const projects = [
  { title: "Python Programs Collection", desc: "Factorial, Fibonacci and Structure-to-Dictionary conversion programs, with an updated README.", tech: ["Python", "GitHub"], repo: GH + "python-programs", live: "" },
  { title: "Messy Python Code Improvement", desc: "A messy Python script cleaned up and improved with AI assistance.", tech: ["Python", "AI-assisted coding"], repo: GH + "messy-python-code", live: "" },
  { title: "Bug Fixing Using Cursor AI", desc: "A buggy program identified and corrected using Cursor AI.", tech: ["Python", "Cursor AI", "Debugging"], repo: GH + "cursor-bug-fix", live: "" },
  { title: "Interactive Quiz Application", desc: "A quiz app built in Lecture 10 that asks questions and scores the answers.", tech: ["HTML", "CSS", "JavaScript", "Quiz"], repo: GH + "quiz-app", live: "" },
  { title: "Book Reading List Application", desc: "A reading list app built in Lecture 11 for tracking books to read.", tech: ["HTML", "CSS", "JavaScript", "Book"], repo: GH + "reading-list-app", live: "" }
];

// ---- Theme ----
const root = document.documentElement, tbtn = document.getElementById("theme");
function setTheme(t) {
  root.dataset.theme = t;
  tbtn.textContent = t === "dark" ? "Light" : "Dark";
  tbtn.setAttribute("aria-label", "Switch to " + (t === "dark" ? "light" : "dark") + " mode");
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let saved = null; try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
tbtn.onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");

// ---- Projects render + search ----
const grid = document.getElementById("grid"), count = document.getElementById("count"), search = document.getElementById("search");
function render() {
  const q = search.value.trim().toLowerCase();
  const list = projects.filter(p => (p.title + " " + p.desc + " " + p.tech.join(" ")).toLowerCase().includes(q));
  grid.innerHTML = "";
  list.forEach(p => {
    const c = document.createElement("article"); c.className = "card";
    const h = document.createElement("h3"); h.textContent = p.title;
    const d = document.createElement("p"); d.textContent = p.desc;
    const t = document.createElement("ul"); t.className = "tags";
    p.tech.forEach(x => { const li = document.createElement("li"); li.textContent = x; t.appendChild(li); });
    const l = document.createElement("div"); l.className = "links";
    const links = [["GitHub repository", p.repo]]; if (p.live) links.push(["Live app", p.live]);
    links.forEach(([n, u]) => { const a = document.createElement("a"); a.href = u; a.target = "_blank"; a.rel = "noopener"; a.textContent = n; l.appendChild(a); });
    c.append(h, d, t, l); grid.appendChild(c);
  });
  count.textContent = list.length ? list.length + " of " + projects.length + " projects" : "No projects match \"" + search.value + "\". Try Python, Quiz or Book.";
}
search.addEventListener("input", render); render();

// ---- Hero timeline playhead ----
const tl = document.getElementById("timeline"), ph = document.getElementById("playhead"), tc = document.getElementById("tc");
function scrub(x) {
  const r = tl.getBoundingClientRect(), p = Math.min(1, Math.max(0, (x - r.left) / r.width));
  ph.style.left = p * 100 + "%";
  const f = Math.round(p * 30 * 60 * 24), pad = n => String(n).padStart(2, "0");
  tc.textContent = [Math.floor(f / 86400 % 60), Math.floor(f / 1440 % 60), Math.floor(f / 24 % 60), f % 24].map(pad).join(":");
}
tl.addEventListener("pointermove", e => scrub(e.clientX));

// ---- Chatbot ----
const log = document.getElementById("log"), form = document.getElementById("chat-form"), msg = document.getElementById("msg"), send = document.getElementById("send");
const history = [];
function add(text, cls) { const d = document.createElement("div"); d.className = "m " + cls; d.textContent = text; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
add("Hi, I'm Kush's portfolio assistant. Ask me about his skills, projects or background.", "bot");
["Who are you?", "What are your skills?", "What projects have you completed?", "Where is your GitHub?"].forEach(q => {
  const b = document.createElement("button"); b.type = "button"; b.textContent = q;
  b.onclick = () => { msg.value = q; form.requestSubmit(); };
  document.getElementById("chips").appendChild(b);
});
form.addEventListener("submit", async e => {
  e.preventDefault();
  const text = msg.value.trim(); if (!text) return;
  msg.value = ""; add(text, "you"); send.disabled = true;
  const wait = add("Thinking...", "bot");
  try {
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.reply) throw new Error(data.error || "Status " + res.status);
    wait.textContent = data.reply;
    history.push({ role: "user", content: text }, { role: "assistant", content: data.reply });
    if (history.length > 12) history.splice(0, 2);
  } catch (err) {
    wait.textContent = "The chatbot could not answer right now (" + err.message + "). Check your connection and try again in a moment.";
    wait.classList.add("err");
  }
  send.disabled = false; msg.focus();
});
