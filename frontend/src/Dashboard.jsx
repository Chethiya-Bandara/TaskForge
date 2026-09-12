import { useEffect, useMemo, useState } from "react";
import { api, API_URL } from "./api";

const COLUMNS = [
  { key: "todo", label: "To do", color: "#a0a09a" },
  { key: "in_progress", label: "In progress", color: "#d4ff00" },
  { key: "completed", label: "Done", color: "#7dd3fc" },
];
const inputStyle = { background: "#0a0a0a", border: "1px solid #222220" };

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (mode === "register") await api("/auth/register", { method: "POST", body: { name, email, password } });
      const session = await api("/auth/login", { method: "POST", body: { email, password } });
      localStorage.setItem("taskforge-token", session.token); onAuthenticated(session.token);
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }
  return <main className="min-h-screen grid place-items-center p-6" style={{ background: "#0a0a0a", color: "#f0efe8" }}>
    <form onSubmit={submit} className="w-full max-w-md p-8" style={{ background: "#111", border: "1px solid #222220" }}>
      <div className="flex items-center gap-2 mb-8"><span className="w-8 h-8 grid place-items-center font-display font-bold" style={{ background: "#d4ff00", color: "#0a0a0a" }}>TF</span><span className="font-display uppercase tracking-widest">TaskForge</span></div>
      <h1 className="font-display text-4xl uppercase mb-2">{mode === "login" ? "Welcome back" : "Create account"}</h1><p className="text-sm mb-6" style={{ color: "#a0a09a" }}>Local API: {API_URL}</p>
      {mode === "register" && <label className="block text-sm mb-4">Name<input required minLength="2" value={name} onChange={(e) => setName(e.target.value)} className="block mt-1 w-full p-3" style={inputStyle} /></label>}
      <label className="block text-sm mb-4">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block mt-1 w-full p-3" style={inputStyle} /></label>
      <label className="block text-sm mb-5">Password<input required minLength="6" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block mt-1 w-full p-3" style={inputStyle} /></label>
      {error && <p className="text-sm mb-4" style={{ color: "#ff6b6b" }}>{error}</p>}
      <button disabled={busy} className="w-full p-3 font-display uppercase tracking-wider disabled:opacity-50" style={{ background: "#d4ff00", color: "#0a0a0a" }}>{busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}</button>
      <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="w-full mt-4 text-sm" style={{ color: "#a0a09a" }}>{mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}</button>
    </form>
  </main>;
}

export default function Dashboard({ onBack }) {
  const [token, setToken] = useState(() => localStorage.getItem("taskforge-token"));
  const [user, setUser] = useState(null), [projects, setProjects] = useState([]), [activeProjectId, setActiveProjectId] = useState(""), [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState(""), [newTask, setNewTask] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  const activeProject = projects.find((project) => project.id === activeProjectId);
  const grouped = useMemo(() => Object.fromEntries(COLUMNS.map((column) => [column.key, tasks.filter((task) => task.status === column.key)])), [tasks]);
  function logout() { localStorage.removeItem("taskforge-token"); setToken(null); setUser(null); setProjects([]); setTasks([]); setActiveProjectId(""); }
  async function loadProjects(sessionToken = token) {
    if (!sessionToken) return; setLoading(true); setError("");
    try { const [me, list] = await Promise.all([api("/auth/me", { token: sessionToken }), api("/projects", { token: sessionToken })]); setUser(me); setProjects(list); setActiveProjectId((id) => list.some((project) => project.id === id) ? id : (list[0]?.id || "")); }
    catch (requestError) { setError(requestError.message); if (requestError.message.includes("token")) logout(); } finally { setLoading(false); }
  }
  async function loadTasks(id = activeProjectId) { if (!id || !token) return setTasks([]); try { setTasks(await api(`/projects/${id}/tasks`, { token })); } catch (requestError) { setError(requestError.message); } }
  useEffect(() => { loadProjects(); }, [token]);
  useEffect(() => { loadTasks(); }, [activeProjectId]);
  async function createProject(event) { event.preventDefault(); try { const project = await api("/projects", { token, method: "POST", body: { name: newProject } }); setNewProject(""); await loadProjects(); setActiveProjectId(project.id); } catch (requestError) { setError(requestError.message); } }
  async function createTask(event) { event.preventDefault(); if (!activeProjectId) return; try { const task = await api(`/projects/${activeProjectId}/tasks`, { token, method: "POST", body: { title: newTask } }); setTasks((current) => [...current, task]); setNewTask(""); } catch (requestError) { setError(requestError.message); } }
  async function updateTask(id, status) { try { const changed = await api(`/tasks/${id}`, { token, method: "PATCH", body: { status } }); setTasks((current) => current.map((task) => task.id === id ? changed : task)); } catch (requestError) { setError(requestError.message); } }
  async function deleteTask(id) { try { await api(`/tasks/${id}`, { token, method: "DELETE" }); setTasks((current) => current.filter((task) => task.id !== id)); } catch (requestError) { setError(requestError.message); } }
  if (!token) return <AuthScreen onAuthenticated={setToken} />;
  return <main className="min-h-screen p-6 md:p-8" style={{ background: "#0a0a0a", color: "#f0efe8" }}>
    <header className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between pb-6" style={{ borderBottom: "1px solid #222220" }}><div className="flex items-center gap-3"><span className="w-8 h-8 grid place-items-center font-display font-bold" style={{ background: "#d4ff00", color: "#0a0a0a" }}>TF</span><div><h1 className="font-display text-xl uppercase tracking-wider">TaskForge</h1><p className="text-xs" style={{ color: "#6b6b65" }}>{user?.email || "Loading account…"}</p></div></div><div className="flex gap-2"><button onClick={logout} className="px-3 py-2 text-sm" style={inputStyle}>Sign out</button><button onClick={onBack} className="px-3 py-2 text-sm" style={inputStyle}>Exit</button></div></header>
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[260px_1fr] gap-6 pt-6"><aside className="p-4" style={{ background: "#111", border: "1px solid #222220" }}><p className="font-display uppercase tracking-widest text-xs mb-3" style={{ color: "#6b6b65" }}>Projects</p><div className="space-y-1 mb-5">{projects.map((project) => <button key={project.id} onClick={() => setActiveProjectId(project.id)} className="w-full text-left p-2 text-sm" style={{ background: project.id === activeProjectId ? "#1a1a1a" : "transparent", color: project.id === activeProjectId ? "#d4ff00" : "#a0a09a" }}>{project.name}</button>)}</div><form onSubmit={createProject} className="space-y-2"><input required minLength="3" value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="New project" className="w-full p-2 text-sm" style={inputStyle} /><button className="w-full p-2 text-xs font-display uppercase" style={{ background: "#d4ff00", color: "#0a0a0a" }}>Create project</button></form></aside>
      <section>{error && <p className="mb-4 p-3 text-sm" style={{ color: "#ff6b6b", border: "1px solid #3a1a1a" }}>{error}</p>}{!activeProject ? <div className="p-10 text-center" style={{ border: "1px solid #222220", color: "#a0a09a" }}>{loading ? "Loading projects…" : "Create a project to start tracking work."}</div> : <><div className="flex flex-wrap justify-between gap-4 mb-5"><div><p className="text-xs uppercase tracking-widest" style={{ color: "#6b6b65" }}>Project workspace</p><h2 className="font-display text-4xl uppercase">{activeProject.name}</h2></div><form onSubmit={createTask} className="flex gap-2 self-end"><input required minLength="3" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Task title" className="p-2 text-sm" style={inputStyle} /><button className="px-3 py-2 text-sm font-display uppercase" style={{ background: "#d4ff00", color: "#0a0a0a" }}>+ Task</button></form></div><div className="grid md:grid-cols-3 gap-4">{COLUMNS.map((column) => <div key={column.key} className="p-3 min-h-80" style={{ background: "#111", border: "1px solid #222220" }}><div className="flex justify-between items-center mb-3"><h3 className="font-display uppercase tracking-wider" style={{ color: column.color }}>{column.label}</h3><span className="text-xs" style={{ color: "#6b6b65" }}>{grouped[column.key].length}</span></div><div className="space-y-2">{grouped[column.key].map((task) => <article key={task.id} className="p-3" style={{ background: "#0a0a0a", border: "1px solid #222220" }}><p className="text-sm mb-3">{task.title}</p><div className="flex gap-2 items-center"><select value={task.status} onChange={(e) => updateTask(task.id, e.target.value)} className="flex-1 p-1 text-xs" style={{ background: "#111", border: "1px solid #222220", color: "#a0a09a" }}>{COLUMNS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}</select><button onClick={() => deleteTask(task.id)} className="text-xs" style={{ color: "#ff6b6b" }}>Delete</button></div></article>)}</div></div>)}</div></>}</section></div>
  </main>;
}
