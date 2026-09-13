import { useEffect, useMemo, useState } from "react"
import AuthScreen from "./AuthScreen"
import { api } from "./api"

const COLUMNS = [
  { key: "todo", label: "To do", color: "#64748b" },
  { key: "in_progress", label: "In progress", color: "#2563eb" },
  { key: "completed", label: "Done", color: "#16a34a" },
]
const inputStyle = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  color: "#172033",
}

function getLocalDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function isOverdue(task) {
  return (
    task.dueDate &&
    task.status !== "completed" &&
    task.dueDate.slice(0, 10) < getLocalDateString()
  )
}

function DueDateEditor({ task, overdue, onSave }) {
  const savedDueDate = task.dueDate ? task.dueDate.slice(0, 10) : ""
  const [draftDueDate, setDraftDueDate] = useState(savedDueDate)
  const [isSaving, setIsSaving] = useState(false)
  const hasChanges = draftDueDate !== savedDueDate

  useEffect(() => {
    setDraftDueDate(savedDueDate)
  }, [savedDueDate, task.id])

  async function saveDueDate() {
    if (!hasChanges) return

    setIsSaving(true)
    await onSave(task.id, draftDueDate)
    setIsSaving(false)
  }

  async function removeDueDate() {
    setIsSaving(true)
    await onSave(task.id, "")
    setIsSaving(false)
  }

  return (
    <div className="mb-3">
      <label
        className="block text-xs"
        style={{ color: overdue ? "#dc2626" : "#526277" }}
      >
        Due date
        <input
          aria-label={`Due date for ${task.title}`}
          type="date"
          value={draftDueDate}
          onChange={(event) => setDraftDueDate(event.target.value)}
          disabled={isSaving}
          className="block w-full mt-1 p-1 text-xs disabled:opacity-50"
          style={inputStyle}
        />
      </label>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={saveDueDate}
          disabled={!hasChanges || isSaving}
          className="text-xs disabled:opacity-50"
          style={{ color: "#2563eb" }}
        >
          {isSaving ? "Saving…" : "Save due date"}
        </button>
        {savedDueDate && (
          <button
            type="button"
            onClick={removeDueDate}
            disabled={isSaving}
            className="text-xs disabled:opacity-50"
            style={{ color: "#526277" }}
          >
            Remove due date
          </button>
        )}
      </div>
    </div>
  )
}

export default function Dashboard({ authMode, onBack }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("taskforge-token"),
  )
  const [user, setUser] = useState(null),
    [projects, setProjects] = useState([]),
    [activeProjectId, setActiveProjectId] = useState(""),
    [tasks, setTasks] = useState([])
  const [newProject, setNewProject] = useState(""),
    [newTask, setNewTask] = useState(""),
    [newTaskDueDate, setNewTaskDueDate] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false)
  const activeProject = projects.find(
    (project) => project.id === activeProjectId,
  )
  const grouped = useMemo(
    () =>
      Object.fromEntries(
        COLUMNS.map((column) => [
          column.key,
          tasks.filter((task) => task.status === column.key),
        ]),
      ),
    [tasks],
  )

  function logout() {
    localStorage.removeItem("taskforge-token")
    setToken(null)
    setUser(null)
    setProjects([])
    setTasks([])
    setActiveProjectId("")
    onBack()
  }
  async function loadProjects(sessionToken = token) {
    if (!sessionToken) return
    setLoading(true)
    setError("")
    try {
      const [me, list] = await Promise.all([
        api("/auth/me", { token: sessionToken }),
        api("/projects", { token: sessionToken }),
      ])
      setUser(me)
      setProjects(list)
      setActiveProjectId((id) =>
        list.some((project) => project.id === id) ? id : list[0]?.id || "",
      )
    } catch (requestError) {
      setError(requestError.message)
      if (requestError.message.includes("token")) logout()
    } finally {
      setLoading(false)
    }
  }
  async function loadTasks(id = activeProjectId) {
    if (!id || !token) return setTasks([])
    try {
      setTasks(await api(`/projects/${id}/tasks`, { token }))
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  useEffect(() => {
    loadProjects()
  }, [token])
  useEffect(() => {
    loadTasks()
  }, [activeProjectId])
  async function createProject(event) {
    event.preventDefault()
    try {
      const project = await api("/projects", {
        token,
        method: "POST",
        body: { name: newProject },
      })
      setNewProject("")
      await loadProjects()
      setActiveProjectId(project.id)
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  async function createTask(event) {
    event.preventDefault()
    if (!activeProjectId) return
    try {
      const task = await api(`/projects/${activeProjectId}/tasks`, {
        token,
        method: "POST",
        body: {
          title: newTask,
          ...(newTaskDueDate
            ? { dueDate: `${newTaskDueDate}T00:00:00.000Z` }
            : {}),
        },
      })
      setTasks((current) => [...current, task])
      setNewTask("")
      setNewTaskDueDate("")
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  async function updateTask(id, status) {
    try {
      const changed = await api(`/tasks/${id}`, {
        token,
        method: "PATCH",
        body: { status },
      })
      setTasks((current) =>
        current.map((task) => (task.id === id ? changed : task)),
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  async function updateTaskDueDate(id, dueDate) {
    try {
      const changed = await api(`/tasks/${id}`, {
        token,
        method: "PATCH",
        body: { dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null },
      })
      setTasks((current) =>
        current.map((task) => (task.id === id ? changed : task)),
      )
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    }
  }
  async function deleteTask(id) {
    try {
      await api(`/tasks/${id}`, { token, method: "DELETE" })
      setTasks((current) => current.filter((task) => task.id !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  if (!token) {
    return (
      <AuthScreen
        initialMode={authMode}
        onAuthenticated={setToken}
        onBack={onBack}
      />
    )
  }
  return (
    <main
      className="min-h-screen p-6 md:p-8"
      style={{ background: "#f5f7fb", color: "#172033" }}
    >
      <header
        className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between pb-6"
        style={{ borderBottom: "1px solid #dbe3ef" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 grid place-items-center font-display font-bold"
            style={{ background: "#2563eb", color: "#ffffff", borderRadius: 8 }}
          >
            TF
          </span>
          <div>
            <h1 className="font-display text-xl uppercase tracking-wider">
              TaskForge
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={logout}
            className="px-3 py-2 text-sm"
            style={inputStyle}
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[260px_1fr] gap-6 pt-6">
        <p className="text-xl" style={{ color: "#172033" }}>
          Welcome back, {user?.name || "User!"}!
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[260px_1fr] gap-6 pt-6">
        <aside
          className="p-4"
          style={{
            background: "#ffffff",
            border: "1px solid #dbe3ef",
            borderRadius: 12,
          }}
        >
          <p
            className="font-display uppercase tracking-widest text-xs mb-3"
            style={{ color: "#64748b" }}
          >
            Projects
          </p>
          <div className="space-y-1 mb-5">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                className="w-full text-left p-2 text-sm"
                style={{
                  background:
                    project.id === activeProjectId ? "#eff6ff" : "transparent",
                  color: project.id === activeProjectId ? "#2563eb" : "#526277",
                }}
              >
                {project.name}
              </button>
            ))}
          </div>
          <form onSubmit={createProject} className="space-y-2">
            <input
              required
              minLength="3"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="New project"
              className="w-full p-2 text-sm"
              style={inputStyle}
            />
            <button
              className="w-full p-2 text-xs font-display uppercase"
              style={{
                background: "#2563eb",
                color: "#ffffff",
                borderRadius: 6,
              }}
            >
              Create project
            </button>
          </form>
        </aside>
        <section>
          {error && (
            <p
              className="mb-4 p-3 text-sm"
              style={{
                color: "#dc2626",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                borderRadius: 8,
              }}
            >
              {error}
            </p>
          )}
          {!activeProject ? (
            <div
              className="p-10 text-center"
              style={{
                border: "1px solid #dbe3ef",
                color: "#526277",
                background: "#ffffff",
                borderRadius: 12,
              }}
            >
              {loading
                ? "Loading projects…"
                : "Create a project to start tracking work."}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-between gap-4 mb-5">
                <div>
                  <p
                    className="text-xl uppercase tracking-widest"
                    style={{ color: "#2563eb" }}
                  >
                    Projects / {activeProject.name}
                  </p>
                  <h2 className="font-display text-4xl uppercase">Board</h2>
                </div>
                <form
                  onSubmit={createTask}
                  className="flex flex-wrap gap-2 self-end"
                >
                  <input
                    required
                    minLength="3"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Task title"
                    className="p-2 text-sm"
                    style={inputStyle}
                  />
                  <input
                    aria-label="Due date"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="p-2 text-sm"
                    style={inputStyle}
                  />
                  <button
                    className="px-3 py-2 text-sm font-display uppercase"
                    style={{
                      background: "#2563eb",
                      color: "#ffffff",
                      borderRadius: 6,
                    }}
                  >
                    + Task
                  </button>
                </form>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {COLUMNS.map((column) => (
                  <div
                    key={column.key}
                    className="p-3 min-h-80"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dbe3ef",
                      borderRadius: 10,
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3
                        className="font-display uppercase tracking-wider"
                        style={{ color: column.color }}
                      >
                        {column.label}
                      </h3>
                      <span className="text-xs" style={{ color: "#64748b" }}>
                        {grouped[column.key].length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {grouped[column.key].map((task) => {
                        const overdue = isOverdue(task)

                        return (
                          <article
                            key={task.id}
                            className="p-3"
                            style={{
                              background: overdue ? "#fef2f2" : "#ffffff",
                              border: overdue
                                ? "1px solid #fca5a5"
                                : "1px solid #dbe3ef",
                              borderRadius: 8,
                            }}
                          >
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <p className="text-sm">{task.title}</p>
                              {overdue && (
                                <span
                                  className="px-2 py-1 text-xs font-display uppercase"
                                  style={{
                                    color: "#dc2626",
                                    border: "1px solid #fca5a5",
                                    background: "#fff1f2",
                                  }}
                                >
                                  Overdue
                                </span>
                              )}
                            </div>
                            <DueDateEditor
                              task={task}
                              overdue={overdue}
                              onSave={updateTaskDueDate}
                            />
                            <div className="flex gap-2 items-center">
                              <select
                                value={task.status}
                                onChange={(e) =>
                                  updateTask(task.id, e.target.value)
                                }
                                className="flex-1 p-1 text-xs"
                                style={{
                                  background: "#ffffff",
                                  border: "1px solid #cbd5e1",
                                  color: "#526277",
                                }}
                              >
                                {COLUMNS.map((option) => (
                                  <option key={option.key} value={option.key}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-xs"
                                style={{ color: "#dc2626" }}
                              >
                                Delete
                              </button>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
