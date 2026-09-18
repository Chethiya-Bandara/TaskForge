import { useState } from "react"
import Dashboard from "./Dashboard"

const FEATURES = [
  {
    number: "01",
    title: "Smart Task Management",
    body: "Create, assign, prioritize, and track tasks from start to finish with clear ownership and progress.",
  },
  {
    number: "02",
    title: "Team Collaboration",
    body: "Bring your team into every project with shared tasks, comments, updates, and a clear view of who is doing what.",
  },
  {
    number: "03",
    title: "Project Workspaces",
    body: "Keep tasks, members, deadlines, and project activity organized inside dedicated collaborative workspaces.",
  },
  {
    number: "04",
    title: "Roles & Permissions",
    body: "Control project access with owner, admin, and member roles so everyone has the right level of control.",
  },
]

const WORKFLOW_STEPS = [
  { id: "01", label: "Backlog", color: "#64748b" },
  { id: "02", label: "In Progress", color: "#2563eb" },
  { id: "03", label: "Review", color: "#0f766e" },
  { id: "04", label: "Done", color: "#16a34a" },
]

const buttonStyle = {
  backgroundColor: "#f0804c",
  color: "#ffffff",
  letterSpacing: "0.08em",
  borderRadius: 999,
  boxShadow: "0 10px 24px rgba(240, 128, 76, 0.22)",
}

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [activeStep, setActiveStep] = useState("02")

  function openAuth(mode) {
    setAuthMode(mode)
    setShowDashboard(true)
  }

  if (showDashboard)
    return (
      <Dashboard authMode={authMode} onBack={() => setShowDashboard(false)} />
    )

  return (
    <div className="min-h-screen landing-page" style={{ color: "#172033" }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 landing-header"
        style={{
          borderBottom: "1px solid #dbe3ef",
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderRadius: 22,
        }}
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center font-display font-bold text-xs"
              style={{ backgroundColor: "#f0804c", color: "#ffffff" }}
            >
              TF
            </div>
            <span
              className="font-display font-700 tracking-wider text-sm uppercase"
              style={{ letterSpacing: "0.12em" }}
            >
              TaskForge
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="px-6 py-3 font-display font-600 uppercase tracking-wider text-sm"
            style={buttonStyle}
          >
            Sign in
          </button>
        </div>
      </header>

      <main>
        <section
          className="px-8 py-24"
          style={{ borderBottom: "1px solid #dbe3ef" }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-8 font-display"
                style={{ color: "#f0804c" }}
              >
                Project management for teams
              </p>
              <h1
                className="font-display font-800 leading-none mb-6"
                style={{
                  fontSize: "clamp(4rem, 10vw, 8rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.92,
                }}
              >
                Track
                <br />
                without
                <br />
                <span style={{ color: "#f0804c" }}>chaos.</span>
              </h1>
              <p
                className="text-lg mb-10 max-w-md"
                style={{ color: "#526277", lineHeight: 1.6 }}
              >
                TaskForge puts projects, tasks, and blockers in one focused
                workspace.
              </p>
              <button
                type="button"
                onClick={() => openAuth("register")}
                className="px-6 py-3 font-display font-600 uppercase tracking-wider text-sm"
                style={buttonStyle}
              >
                Start for free account!
              </button>
            </div>
            <div
              className="p-6 landing-feature-card"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dbe3ef",
                borderRadius: 24,
                boxShadow: "0 18px 48px rgba(235, 139, 37, 0.1)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-6"
                style={{ color: "#64748b" }}
              >
                One focused workspace
              </p>
              {["Plan the work", "Track progress", "Resolve blockers"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 py-4"
                    style={{ borderTop: index ? "1px solid #e7edf5" : "none" }}
                  >
                    <span className="font-display" style={{ color: "#f0804c" }}>
                      0{index + 1}
                    </span>
                    <span className="font-display uppercase tracking-wider">
                      {item}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className="px-8 py-24"
          style={{ borderBottom: "1px solid #dbe3ef" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p
                className="text-xs uppercase tracking-widest mb-4 font-display"
                style={{ color: "#f0804c" }}
              >
                Capabilities
              </p>
              <h2
                className="font-display font-800 leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Built for
                <br />
                Efficiency.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 landing-feature-grid">
              {FEATURES.map((feature) => (
                <article
                  key={feature.number}
                  className="p-8 landing-capability-card"
                  style={{ backgroundColor: "rgba(255,255,255,0.86)" }}
                >
                  <span
                    className="font-display text-xs"
                    style={{ color: "#64748b" }}
                  >
                    {feature.number}
                  </span>
                  <h3 className="font-display font-700 text-xl mt-6 mb-3 uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#526277" }}
                  >
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="px-8 py-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-4 font-display"
                style={{ color: "#f0804c" }}
              >
                Workflow
              </p>
              <h2
                className="font-display font-800 leading-none mb-6"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                EVERY STATE.
                <br />
                ONE VIEW.
              </h2>
              <p
                className="text-base max-w-md"
                style={{ color: "#526277", lineHeight: 1.7 }}
              >
                Customize workflow stages to match how your team actually works.
              </p>
            </div>
            <div
              style={{
                border: "1px solid #dbe3ef",
                backgroundColor: "#ffffff",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
              }}
            >
              {WORKFLOW_STEPS.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                  style={{
                    backgroundColor:
                      activeStep === step.id ? "#eff6ff" : "transparent",
                    borderBottom: "1px solid #e7edf5",
                  }}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className="font-display text-xs"
                      style={{ color: "#64748b" }}
                    >
                      {step.id}
                    </span>
                    <span
                      className="font-display uppercase tracking-wider"
                      style={{
                        color: activeStep === step.id ? step.color : "#172033",
                      }}
                    >
                      {step.label}
                    </span>
                  </span>
                  <span style={{ color: step.color }}>●</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer
        className="px-8 py-10 landing-footer"
        style={{ borderTop: "1px solid #dbe3ef", backgroundColor: "#ffffff" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 flex items-center justify-center font-display font-bold text-xs"
              style={{ backgroundColor: "#f0804c", color: "#ffffff" }}
            >
              TF
            </div>
            <span
              className="font-display font-700 tracking-wider text-xs uppercase"
              style={{ letterSpacing: "0.12em" }}
            >
              TaskForge
            </span>
          </div>
          <p className="text-xs" style={{ color: "#64748b" }}>
            © 2026 TaskForge, Inc.
          </p>
        </div>
      </footer>
    </div>
  )
}
