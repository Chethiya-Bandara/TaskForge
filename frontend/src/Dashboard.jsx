import { useState } from "react";

const INITIAL_BOARD = {
  Backlog: [
    { id: "t1", title: "Migrate auth to Clerk", priority: "P1", assignee: "KL", tag: "Infra", dueDate: "Oct 18", subtasks: 4, comments: 2 },
    { id: "t2", title: "Draft Q4 OKRs doc", priority: "P2", assignee: "PR", tag: "Strategy", dueDate: "Oct 22", comments: 5 },
    { id: "t3", title: "Add CSV export to reports", priority: "P3", assignee: "MR", tag: "Feature", dueDate: "Nov 1", subtasks: 2 },
    { id: "t4", title: "Update privacy policy for EU", priority: "P2", assignee: "SO", tag: "Legal", dueDate: "Oct 28" },
  ],
  "In Progress": [
    { id: "t5", title: "Redesign onboarding flow step 2", priority: "P1", assignee: "MR", tag: "Design", dueDate: "Oct 16", subtasks: 6, comments: 11 },
    { id: "t6", title: "Write migration script for v2 schema", priority: "P1", assignee: "SO", tag: "Infra", dueDate: "Oct 14", subtasks: 3, comments: 4 },
    { id: "t7", title: "Implement webhook retry logic", priority: "P0", assignee: "KL", tag: "Bug", dueDate: "Oct 13", comments: 7 },
  ],
  Review: [
    { id: "t8", title: "Add audit log export endpoint", priority: "P2", assignee: "TN", tag: "Feature", dueDate: "Oct 15", subtasks: 2, comments: 3 },
    { id: "t9", title: "Rate limiting middleware", priority: "P1", assignee: "KL", tag: "Infra", dueDate: "Oct 13", comments: 6 },
  ],
  Done: [
    { id: "t10", title: "Set up Datadog APM", priority: "P1", assignee: "TN", tag: "Infra", dueDate: "Oct 10", subtasks: 5, comments: 2 },
    { id: "t11", title: "Fix Stripe webhook race condition", priority: "P0", assignee: "KL", tag: "Bug", dueDate: "Oct 9", comments: 9 },
    { id: "t12", title: "Launch beta invite flow", priority: "P1", assignee: "MR", tag: "Feature", dueDate: "Oct 8", subtasks: 8 },
  ],
};

const TEAM = [
  { initials: "KL", name: "Kai Larsson", role: "Backend", tasks: 8, done: 5 },
  { initials: "MR", name: "Maya Reyes", role: "Design", tasks: 6, done: 3 },
  { initials: "SO", name: "Sadie Okonkwo", role: "Backend", tasks: 5, done: 4 },
  { initials: "TN", name: "Tomás Nkosi", role: "Frontend", tasks: 4, done: 2 },
  { initials: "PR", name: "Priya Rao", role: "PM", tasks: 3, done: 1 },
];

const ACTIVITY = [
  { user: "KL", action: "closed", target: "Fix Stripe webhook race condition", time: "2m ago", type: "done" },
  { user: "MR", action: "moved to Review", target: "Redesign onboarding step 2", time: "18m ago", type: "review" },
  { user: "SO", action: "commented on", target: "Write migration script for v2 schema", time: "34m ago", type: "comment" },
  { user: "TN", action: "opened", target: "Add audit log export endpoint", time: "1h ago", type: "open" },
  { user: "PR", action: "created", target: "Draft Q4 OKRs doc", time: "2h ago", type: "open" },
  { user: "KL", action: "flagged as P0", target: "Implement webhook retry logic", time: "3h ago", type: "alert" },
];

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard" },
  { icon: "◫", label: "Board" },
  { icon: "≡", label: "Backlog" },
  { icon: "◷", label: "Timeline" },
  { icon: "↗", label: "Reports" },
  { icon: "⚙", label: "Settings" },
];

const PROJECTS = [
  { name: "Platform v2", color: "#d4ff00", progress: 62 },
  { name: "Mobile App", color: "#7dd3fc", progress: 41 },
  { name: "API Redesign", color: "#f9a8d4", progress: 88 },
];

const PRIORITY_COLOR = {
  P0: "#ff6b6b",
  P1: "#d4ff00",
  P2: "#a0a09a",
  P3: "#3a3a38",
};

const STATUS_COLUMNS = ["Backlog", "In Progress", "Review", "Done"];

const STATUS_ACCENT = {
  Backlog: "#3a3a38",
  "In Progress": "#d4ff00",
  Review: "#7dd3fc",
  Done: "#6b6b65",
};

function KanbanCard({ task, status }) {
  return (
    <div
      className="p-3 rounded-sm cursor-pointer group transition-colors"
      style={{ backgroundColor: "#111111", border: "1px solid #1e1e1e" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2e2e2e")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="px-1.5 py-0.5 text-xs font-display uppercase"
          style={{ color: PRIORITY_COLOR[task.priority], border: `1px solid ${PRIORITY_COLOR[task.priority]}22` }}
        >
          {task.priority}
        </span>
        <span className="text-xs" style={{ color: "#3a3a38" }}>
          {task.tag}
        </span>
      </div>
      <p className="text-sm mb-3 leading-snug" style={{ color: status === "Done" ? "#6b6b65" : "#f0efe8" }}>
        {task.title}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs" style={{ color: "#6b6b65" }}>
          {task.subtasks && <span title="Subtasks">◧ {task.subtasks}</span>}
          {task.comments && <span title="Comments">◻ {task.comments}</span>}
          <span>· {task.dueDate}</span>
        </div>
        <div
          className="w-6 h-6 flex items-center justify-center text-xs font-display font-700 flex-shrink-0"
          style={{ backgroundColor: "#1a1a1a", color: "#a0a09a", border: "1px solid #222220" }}
        >
          {task.assignee}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ onBack }) {
  const [board] = useState(INITIAL_BOARD);
  const [activeProject, setActiveProject] = useState("Platform v2");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const totalTasks = Object.values(board).flat().length;
  const doneTasks = board["Done"].length;
  const inProgressTasks = board["In Progress"].length;
  const blockers = board["In Progress"].filter((t) => t.priority === "P0").length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0a", color: "#f0efe8" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-200"
        style={{ width: sidebarCollapsed ? 56 : 220, borderRight: "1px solid #1a1a1a", backgroundColor: "#0a0a0a" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #1a1a1a", height: 56 }}
        >
          <div
            className="w-7 h-7 flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
            style={{ backgroundColor: "#d4ff00", color: "#0a0a0a" }}
          >
            TF
          </div>
          {!sidebarCollapsed && (
            <span className="font-display font-700 text-xs uppercase tracking-widest truncate" style={{ letterSpacing: "0.1em" }}>
              TaskForge
            </span>
          )}
          <button
            className="ml-auto text-xs flex-shrink-0 transition-colors"
            style={{ color: "#3a3a38" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6b6b65")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#3a3a38")}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            {sidebarCollapsed ? "▶" : "◀"}
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
              style={{
                color: activeNav === item.label ? "#f0efe8" : "#6b6b65",
                backgroundColor: activeNav === item.label ? "#1a1a1a" : "transparent",
              }}
              onMouseEnter={(e) => { if (activeNav !== item.label) e.currentTarget.style.color = "#a0a09a"; }}
              onMouseLeave={(e) => { if (activeNav !== item.label) e.currentTarget.style.color = "#6b6b65"; }}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="text-base flex-shrink-0 w-5 text-center">{item.icon}</span>
              {!sidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              {!sidebarCollapsed && item.label === "Dashboard" && (
                <span className="ml-auto text-xs font-display px-1.5 py-0.5" style={{ backgroundColor: "#1e2a00", color: "#d4ff00" }}>
                  3
                </span>
              )}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="px-3 py-3" style={{ borderTop: "1px solid #1a1a1a" }}>
            <p className="text-xs uppercase tracking-widest mb-2 font-display" style={{ color: "#3a3a38" }}>
              Projects
            </p>
            {PROJECTS.map((p) => (
              <button
                key={p.name}
                className="w-full flex items-center gap-2 py-1.5 text-left"
                onClick={() => setActiveProject(p.name)}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-xs truncate flex-1" style={{ color: activeProject === p.name ? "#f0efe8" : "#6b6b65" }}>
                  {p.name}
                </span>
                <span className="text-xs" style={{ color: "#3a3a38" }}>{p.progress}%</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid #1a1a1a" }}>
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-display font-700 flex-shrink-0"
            style={{ backgroundColor: "#1a1a1a", color: "#a0a09a", border: "1px solid #222220" }}
          >
            YO
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">Your Org</div>
              <div className="text-xs truncate" style={{ color: "#6b6b65" }}>Pro plan</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex items-center justify-between px-6 flex-shrink-0"
          style={{ height: 56, borderBottom: "1px solid #1a1a1a", backgroundColor: "#0a0a0a" }}
        >
          <div>
            <h1 className="font-display font-700 text-base uppercase tracking-wide">{activeProject}</h1>
            <p className="text-xs" style={{ color: "#6b6b65" }}>Sprint 14 · Oct 7 – 20</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs"
              style={{ border: "1px solid #1a1a1a", color: "#6b6b65", backgroundColor: "#111111", width: 180 }}
            >
              <span>⌕</span>
              <span>Search tasks…</span>
              <span className="ml-auto" style={{ color: "#3a3a38" }}>⌘K</span>
            </div>
            <div className="flex -space-x-2">
              {TEAM.slice(0, 4).map((m) => (
                <div
                  key={m.initials}
                  className="w-7 h-7 flex items-center justify-center text-xs font-display font-700 flex-shrink-0"
                  style={{ backgroundColor: "#1a1a1a", color: "#a0a09a", border: "2px solid #0a0a0a" }}
                  title={m.name}
                >
                  {m.initials}
                </div>
              ))}
            </div>
            <button
              className="px-3 py-1.5 text-xs font-display uppercase tracking-wider transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#d4ff00", color: "#0a0a0a" }}
            >
              + Task
            </button>
            <button
              className="text-xs px-3 py-1.5 transition-colors"
              style={{ border: "1px solid #1a1a1a", color: "#6b6b65" }}
              onClick={onBack}
            >
              ← Exit
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Summary cards */}
          <section className="px-6 pt-6 pb-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Total Tasks", value: totalTasks, sub: "this sprint" },
                { label: "In Progress", value: inProgressTasks, sub: "active right now" },
                { label: "Completed", value: doneTasks, sub: `of ${totalTasks} tasks` },
                { label: "Blockers", value: blockers, sub: "need attention" },
              ].map((card) => (
                <div
                  key={card.label}
                  className="p-4 rounded-sm"
                  style={{
                    backgroundColor: "#111111",
                    border: card.label === "Blockers" && blockers > 0 ? "1px solid #3a1a1a" : "1px solid #1a1a1a",
                  }}
                >
                  <p className="text-xs uppercase tracking-widest mb-2 font-display" style={{ color: "#6b6b65" }}>
                    {card.label}
                  </p>
                  <p
                    className="font-display font-800 text-4xl leading-none mb-1"
                    style={{
                      letterSpacing: "-0.02em",
                      color:
                        card.label === "In Progress" ? "#d4ff00"
                        : card.label === "Blockers" && blockers > 0 ? "#ff6b6b"
                        : "#f0efe8",
                    }}
                  >
                    {card.value}
                  </p>
                  <p className="text-xs" style={{ color: "#6b6b65" }}>{card.sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sprint progress + team */}
          <section className="px-6 pb-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 p-4 rounded-sm" style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-display uppercase tracking-widest" style={{ color: "#6b6b65" }}>Sprint Progress</p>
                <span className="text-xs" style={{ color: "#6b6b65" }}>6 days remaining</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "#1a1a1a" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(doneTasks / totalTasks) * 100}%`, backgroundColor: "#d4ff00" }}
                />
              </div>
              <div className="flex justify-between text-xs mb-5" style={{ color: "#6b6b65" }}>
                <span>{Math.round((doneTasks / totalTasks) * 100)}% complete</span>
                <span>{doneTasks} / {totalTasks} tasks</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {STATUS_COLUMNS.map((col) => (
                  <div key={col}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_ACCENT[col] }} />
                      <span className="text-xs font-display" style={{ color: "#6b6b65" }}>{col}</span>
                    </div>
                    <span className="font-display font-700 text-xl" style={{ color: "#f0efe8" }}>{board[col].length}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-sm" style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a" }}>
              <p className="text-xs font-display uppercase tracking-widest mb-4" style={{ color: "#6b6b65" }}>Team Workload</p>
              <div className="space-y-3">
                {TEAM.map((m) => (
                  <div key={m.initials}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 flex items-center justify-center text-xs font-display font-700"
                          style={{ backgroundColor: "#1a1a1a", color: "#a0a09a", border: "1px solid #222220" }}
                        >
                          {m.initials}
                        </div>
                        <span className="text-xs" style={{ color: "#f0efe8" }}>{m.name}</span>
                      </div>
                      <span className="text-xs" style={{ color: "#6b6b65" }}>{m.done}/{m.tasks}</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(m.done / m.tasks) * 100}%`, backgroundColor: "#d4ff00", opacity: 0.7 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Kanban board */}
          <section className="px-6 pb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-display uppercase tracking-widest" style={{ color: "#6b6b65" }}>Kanban Board</p>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#6b6b65" }}>
                <button onMouseEnter={(e) => (e.currentTarget.style.color = "#f0efe8")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b65")}>Filter</button>
                <span style={{ color: "#1a1a1a" }}>|</span>
                <button onMouseEnter={(e) => (e.currentTarget.style.color = "#f0efe8")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b65")}>Group by: Assignee</button>
                <span style={{ color: "#1a1a1a" }}>|</span>
                <button onMouseEnter={(e) => (e.currentTarget.style.color = "#f0efe8")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b65")}>Sort: Priority</button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 min-w-0">
              {STATUS_COLUMNS.map((col) => (
                <div key={col} className="flex flex-col min-w-0">
                  <div
                    className="flex items-center justify-between px-3 py-2 mb-2 rounded-sm"
                    style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_ACCENT[col] }} />
                      <span className="font-display font-600 text-xs uppercase tracking-wider">{col}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xs px-1.5 py-0.5" style={{ backgroundColor: "#1a1a1a", color: "#6b6b65" }}>
                        {board[col].length}
                      </span>
                      <button className="text-xs" style={{ color: "#3a3a38" }}>+</button>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {board[col].map((task) => (
                      <KanbanCard key={task.id} task={task} status={col} />
                    ))}
                    <button
                      className="w-full py-2 text-xs text-left px-3 rounded-sm transition-colors"
                      style={{ border: "1px dashed #1a1a1a", color: "#3a3a38" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2e2e2e"; e.currentTarget.style.color = "#6b6b65"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#3a3a38"; }}
                    >
                      + Add task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity feed */}
          <section className="px-6 pb-6">
            <div className="rounded-sm p-4" style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a" }}>
              <p className="text-xs font-display uppercase tracking-widest mb-4" style={{ color: "#6b6b65" }}>Activity</p>
              <div className="space-y-0 divide-y" style={{ borderColor: "#1a1a1a" }}>
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <div
                      className="w-6 h-6 flex items-center justify-center text-xs font-display font-700 flex-shrink-0"
                      style={{ backgroundColor: "#1a1a1a", color: "#a0a09a", border: "1px solid #222220" }}
                    >
                      {a.user}
                    </div>
                    <div className="flex-1 text-sm min-w-0">
                      <span style={{ color: "#a0a09a" }}>{a.action} </span>
                      <span className="font-medium" style={{ color: "#f0efe8" }}>{a.target}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            a.type === "done" ? "#d4ff00"
                            : a.type === "alert" ? "#ff6b6b"
                            : a.type === "review" ? "#7dd3fc"
                            : "#3a3a38",
                        }}
                      />
                      <span className="text-xs" style={{ color: "#6b6b65" }}>{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
