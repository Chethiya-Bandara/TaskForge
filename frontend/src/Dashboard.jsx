import { useEffect, useMemo, useState } from "react"
import AuthScreen from "./AuthScreen"
import { api } from "./api"

const COLUMNS = [
  {
    key: "todo",
    label: "To do",
    shortLabel: "Todo",
    color: "#f4a261",
    tint: "#fff8ef",
  },
  {
    key: "in_progress",
    label: "In progress",
    shortLabel: "In progress",
    color: "#3478f6",
    tint: "#f2f7ff",
  },
  {
    key: "completed",
    label: "Completed",
    shortLabel: "Done",
    color: "#18a999",
    tint: "#effbf8",
  },
]

function Icon({ name, size = 20 }) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    folder: (
      <>
        <path d="M3 7.5h6l2-2h10v13H3z" />
        <path d="M3 9h18" />
      </>
    ),
    check: (
      <>
        <path d="M9 11l2 2 4-5" />
        <rect x="4" y="4" width="16" height="16" rx="5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    logout: (
      <>
        <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function getLocalDateString() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function isOverdue(task) {
  return (
    task.dueDate &&
    task.status !== "completed" &&
    task.dueDate.slice(0, 10) < getLocalDateString()
  )
}

function formatDate(date) {
  if (!date) return "No due date"
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date.slice(0, 10)}T00:00:00`))
}

function DueDateEditor({ task, overdue, onSave }) {
  const savedDueDate = task.dueDate ? task.dueDate.slice(0, 10) : ""
  const [draftDueDate, setDraftDueDate] = useState(savedDueDate)
  const [isSaving, setIsSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const hasChanges = draftDueDate !== savedDueDate

  useEffect(() => setDraftDueDate(savedDueDate), [savedDueDate, task.id])

  async function saveDueDate() {
    if (!hasChanges) return
    setIsSaving(true)
    const saved = await onSave(task.id, draftDueDate)
    setIsSaving(false)
    if (saved) setIsOpen(false)
  }

  async function removeDueDate() {
    setIsSaving(true)
    const saved = await onSave(task.id, "")
    setIsSaving(false)
    if (saved) setIsOpen(false)
  }

  return (
    <div className="date-editor">
      <button
        type="button"
        className={`date-trigger ${overdue ? "overdue" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
      >
        <Icon name="calendar" size={14} />
        {formatDate(savedDueDate)}
      </button>
      {isOpen && (
        <div className="date-popover">
          <label>
            Due date
            <input
              aria-label={`Due date for ${task.title}`}
              type="date"
              value={draftDueDate}
              onChange={(event) => setDraftDueDate(event.target.value)}
              disabled={isSaving}
            />
          </label>
          <div className="date-actions">
            <button
              type="button"
              onClick={saveDueDate}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
            {savedDueDate && (
              <button
                type="button"
                className="muted-button"
                onClick={removeDueDate}
                disabled={isSaving}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard({ authMode, onBack }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("taskforge-token"),
  )
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState("")
  const [tasks, setTasks] = useState([])
  const [newProject, setNewProject] = useState("")
  const [newTask, setNewTask] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("This month")
  const [showProjectForm, setShowProjectForm] = useState(false)

  const activeProject = projects.find(
    (project) => project.id === activeProjectId,
  )
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [tasks, search],
  )
  const grouped = useMemo(
    () =>
      Object.fromEntries(
        COLUMNS.map((column) => [
          column.key,
          filteredTasks.filter((task) => task.status === column.key),
        ]),
      ),
    [filteredTasks],
  )
  const stats = useMemo(
    () =>
      Object.fromEntries(
        COLUMNS.map((column) => [
          column.key,
          tasks.filter((task) => task.status === column.key).length,
        ]),
      ),
    [tasks],
  )
  const totalTasks = tasks.length
  const completion = totalTasks
    ? Math.round((stats.completed / totalTasks) * 100)
    : 0

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
      setShowProjectForm(false)
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

  if (!token)
    return (
      <AuthScreen
        initialMode={authMode}
        onAuthenticated={setToken}
        onBack={onBack}
      />
    )

  return (
    <main>
      <div className="dashboard-shell">
        <aside className="nav-rail" aria-label="Primary navigation">
          <div className="brand-mark">
            T<span>F</span>
          </div>
          <nav>
            <button className="nav-icon active" aria-label="Dashboard">
              <Icon name="grid" />
            </button>
            <button className="nav-icon" aria-label="Projects">
              <Icon name="folder" />
            </button>
            <button className="nav-icon" aria-label="Tasks">
              <Icon name="check" />
            </button>
            <button className="nav-icon" aria-label="Reports">
              <Icon name="chart" />
            </button>
          </nav>
          <button
            className="nav-icon signout"
            aria-label="Sign out"
            onClick={logout}
          >
            <Icon name="logout" />
          </button>
        </aside>
        <div className="workspace">
          <header className="dashboard-header">
            <div>
              <p className="eyebrow">Manage and track your projects</p>
              <h1>Project Dashboard</h1>
            </div>
            <div className="header-controls">
              {/* <div className="period-tabs" aria-label="Dashboard period">
                {["Today", "This week", "This month"].map((item) => (
                  <button
                    key={item}
                    className={period === item ? "active" : ""}
                    onClick={() => setPeriod(item)}
                  >
                    {item}
                  </button>
                ))}
              </div> */}
              <label className="search-box">
                <Icon name="search" size={19} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Filter tasks"
                />
              </label>
              <div className="user-chip" title={user?.name || "User"}>
                {(user?.name || "U").slice(0, 1).toUpperCase()}
              </div>
            </div>
          </header>
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError("")}>Dismiss</button>
            </div>
          )}
          <section className="overview-grid">
            <article className="panel projects-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Workspace</p>
                  <h2>My projects</h2>
                </div>
                <button
                  className="circle-button"
                  onClick={() => setShowProjectForm((value) => !value)}
                  aria-label="Create project"
                >
                  <Icon name="plus" />
                </button>
              </div>
              {showProjectForm && (
                <form onSubmit={createProject} className="project-form">
                  <input
                    required
                    minLength="3"
                    value={newProject}
                    onChange={(event) => setNewProject(event.target.value)}
                    placeholder="Project name"
                    autoFocus
                  />
                  <button>Create</button>
                </form>
              )}
              <div className="project-list">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveProjectId(project.id)}
                    className={project.id === activeProjectId ? "active" : ""}
                  >
                    <span className="project-glyph">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{project.name}</span>
                    <Icon name="arrow" size={16} />
                  </button>
                ))}
                {!projects.length && !loading && (
                  <p className="empty-copy">
                    Create a project to start tracking work.
                  </p>
                )}
                {loading && <p className="empty-copy">Loading projects…</p>}
              </div>
            </article>
            <article className="panel progress-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">{period}</p>
                  <h2>Projects overview</h2>
                </div>
                <span className="completion-number">{completion}%</span>
              </div>
              <div className="progress-content">
                <div
                  className="donut"
                  style={{
                    "--todo": `${
                      totalTasks ? (stats.todo / totalTasks) * 360 : 0
                    }deg`,
                    "--progress": `${
                      totalTasks
                        ? ((stats.todo + stats.in_progress) / totalTasks) * 360
                        : 0
                    }deg`,
                  }}
                >
                  <div>
                    <strong>{totalTasks}</strong>
                    <span>Total tasks</span>
                  </div>
                </div>
                <div className="stat-list">
                  {COLUMNS.map((column) => (
                    <div key={column.key}>
                      <span
                        className="stat-dot"
                        style={{ background: column.color }}
                      />
                      <span>{column.label}</span>
                      <strong>{stats[column.key]}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            <article className="panel focus-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Snapshot</p>
                  <h2>Team focus</h2>
                </div>
                <div className="spark-icon">
                  <Icon name="spark" />
                </div>
              </div>
              <div className="focus-stat">
                <strong>{stats.in_progress}</strong>
                <span>tasks currently moving</span>
              </div>
              <p className="focus-note">
                {stats.completed
                  ? `${stats.completed} task${
                      stats.completed === 1 ? "" : "s"
                    } completed. Keep the momentum going.`
                  : "Your progress story starts with the first completed task."}
              </p>
            </article>
          </section>
          <section className="board-section">
            <div className="board-heading">
              <div>
                <p className="panel-kicker">
                  {activeProject
                    ? `Projects / ${activeProject.name}`
                    : "Your workspace"}
                </p>
                <h2>{activeProject ? "Task board" : "No project selected"}</h2>
              </div>
              {activeProject && (
                <form onSubmit={createTask} className="task-form">
                  <input
                    required
                    minLength="3"
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                    placeholder="What needs to be done?"
                  />
                  <input
                    aria-label="New task due date"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(event) => setNewTaskDueDate(event.target.value)}
                  />
                  <button>
                    <Icon name="plus" size={17} />
                    Add task
                  </button>
                </form>
              )}
            </div>
            {!activeProject ? (
              <div className="blank-state">
                <Icon name="folder" size={30} />
                <p>
                  {loading
                    ? "Loading your workspace…"
                    : "Create a project to start tracking work."}
                </p>
              </div>
            ) : (
              <div className="kanban-grid">
                {COLUMNS.map((column) => (
                  <div className="kanban-column" key={column.key}>
                    <div className="column-heading">
                      <div>
                        <span style={{ background: column.color }} />
                        <h3>{column.label}</h3>
                      </div>
                      <b>{grouped[column.key].length}</b>
                    </div>
                    <div className="task-list">
                      {grouped[column.key].map((task) => {
                        const overdue = isOverdue(task)
                        return (
                          <article
                            className={`task-card ${
                              overdue ? "is-overdue" : ""
                            }`}
                            key={task.id}
                            style={{
                              "--card-tint": overdue ? "#fff4f2" : column.tint,
                            }}
                          >
                            <div className="task-top">
                              <span
                                className="status-pill"
                                style={{
                                  color: column.color,
                                  background: `${column.color}18`,
                                }}
                              >
                                {column.shortLabel}
                              </span>
                              <button
                                className="delete-button"
                                onClick={() => deleteTask(task.id)}
                                aria-label={`Delete ${task.title}`}
                              >
                                <Icon name="trash" size={16} />
                              </button>
                            </div>
                            <h4>{task.title}</h4>
                            {overdue && (
                              <span className="overdue-label">Overdue</span>
                            )}
                            <div className="task-footer">
                              <DueDateEditor
                                task={task}
                                overdue={overdue}
                                onSave={updateTaskDueDate}
                              />
                              <div
                                className="status-select"
                                style={{
                                  "--status-color": column.color,
                                  "--status-tint": `${column.color}14`,
                                }}
                              >
                                <span className="status-select-dot" />
                                <select
                                  aria-label={`Status for ${task.title}`}
                                  value={task.status}
                                  onChange={(event) =>
                                    updateTask(task.id, event.target.value)
                                  }
                                >
                                  {COLUMNS.map((option) => (
                                    <option key={option.key} value={option.key}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <span className="status-select-chevron" />
                              </div>
                            </div>
                          </article>
                        )
                      })}
                      {!grouped[column.key].length && (
                        <div className="column-empty">
                          No {search ? "matching " : ""}tasks
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
