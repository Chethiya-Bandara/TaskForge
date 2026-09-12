import { useState } from "react";
import Dashboard from "./Dashboard";

const NAV_LINKS = ["Product", "Pricing", "Customers", "Docs"];

const FEATURES = [
  {
    number: "01",
    title: "Unified Command Board",
    body: "All tasks, milestones, and blockers in one surface. No tab switching, no context loss.",
    stat: "3.2×",
    statLabel: "faster triage",
  },
  {
    number: "02",
    title: "Dependency Forge",
    body: "Draw hard and soft dependencies across tasks, teams, and sprints. See the critical path instantly.",
    stat: "91%",
    statLabel: "on-time delivery",
  },
  {
    number: "03",
    title: "Live Burndown Engine",
    body: "Real-time velocity charts update as work lands. Forecast slippage before it hits.",
    stat: "14 hrs",
    statLabel: "saved per sprint",
  },
  {
    number: "04",
    title: "Access Architecture",
    body: "Role-based permissions at the project, team, and field level. Audit logs on every state change.",
    stat: "SOC 2",
    statLabel: "Type II compliant",
  },
];

const WORKFLOW_STEPS = [
  { id: "01", label: "Backlog", count: 142, color: "#6b6b65" },
  { id: "02", label: "In Progress", count: 38, color: "#d4ff00" },
  { id: "03", label: "Review", count: 17, color: "#f0efe8" },
  { id: "04", label: "Done", count: 284, color: "#3a3a38" },
];

const TESTIMONIALS = [
  {
    quote: "TaskForge replaced four tools. Our engineering org of 200 now ships without a program manager overhead.",
    name: "Sadie Okonkwo",
    role: "VP Engineering, Meridian Cloud",
    avatar: "SO",
  },
  {
    quote: "The dependency graph alone saved our Q3 launch. We caught the blocker three weeks before the deadline.",
    name: "Tomás Rueda",
    role: "Director of Product, Arcline",
    avatar: "TR",
  },
  {
    quote: "We tried Linear, Jira, Monday. Nothing handles cross-team work like TaskForge.",
    name: "Priya Nath",
    role: "Head of Delivery, Kove Systems",
    avatar: "PN",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For small teams getting organized.",
    features: ["Up to 10 users", "5 active projects", "Basic analytics", "7-day history"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$18",
    period: "per user / mo",
    description: "For teams that ship fast.",
    features: ["Unlimited users", "Unlimited projects", "Dependency graph", "Live burndown", "API access", "Priority support"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual contract",
    description: "For orgs that can't afford downtime.",
    features: ["SSO / SAML", "Custom roles", "Audit logs", "SLA guarantee", "Dedicated CSM", "On-prem option"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [activeStep, setActiveStep] = useState("02");

  if (showDashboard) return <Dashboard onBack={() => setShowDashboard(false)} />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#f0efe8" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ borderBottom: "1px solid #222220", backgroundColor: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center font-display font-bold text-xs"
              style={{ backgroundColor: "#d4ff00", color: "#0a0a0a" }}
            >
              TF
            </div>
            <span className="font-display font-700 tracking-wider text-sm uppercase" style={{ letterSpacing: "0.12em" }}>
              TaskForge
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm transition-colors"
                style={{ color: "#6b6b65" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0efe8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b65")}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="text-sm" style={{ color: "#6b6b65" }}>
            Sign in
          </a>
          <button
            className="px-4 py-2 text-sm font-medium font-display uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{ border: "1px solid #222220", color: "#a0a09a" }}
            onClick={() => setShowDashboard(true)}
          >
            Dashboard →
          </button>
          <button
            className="px-4 py-2 text-sm font-medium font-display uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#d4ff00", color: "#0a0a0a", letterSpacing: "0.08em" }}
          >
            Start free
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-8 pt-24 pb-20" style={{ borderBottom: "1px solid #222220" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-display uppercase tracking-widest"
              style={{ border: "1px solid #222220", color: "#6b6b65" }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#d4ff00", display: "inline-block" }} />
              Now in general availability
            </div>
            <h1
              className="font-display font-800 leading-none mb-6"
              style={{ fontSize: "clamp(4rem, 10vw, 8rem)", letterSpacing: "-0.02em", lineHeight: 0.92 }}
            >
              SHIP
              <br />
              WITHOUT
              <br />
              <span style={{ color: "#d4ff00" }}>CHAOS.</span>
            </h1>
            <p className="text-lg mb-10 max-w-md" style={{ color: "#a0a09a", lineHeight: 1.6 }}>
              TaskForge is the project management platform built for engineering teams that move fast and can&apos;t afford ambiguity.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="px-6 py-3 font-display font-600 uppercase tracking-wider text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#d4ff00", color: "#0a0a0a", letterSpacing: "0.08em" }}
              >
                Start for free
              </button>
              <button
                className="px-6 py-3 text-sm transition-colors"
                style={{ border: "1px solid #222220", color: "#a0a09a" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#6b6b65")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#222220")}
              >
                See a demo →
              </button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs" style={{ color: "#6b6b65" }}>
              <span>No credit card required</span>
              <span style={{ color: "#222220" }}>|</span>
              <span>14-day Pro trial included</span>
              <span style={{ color: "#222220" }}>|</span>
              <span>SOC 2 compliant</span>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative">
            <div
              className="rounded-sm overflow-hidden"
              style={{ border: "1px solid #222220", backgroundColor: "#111111" }}
            >
              {/* Mockup title bar */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid #1a1a1a", backgroundColor: "#0f0f0f" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3a3a38" }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3a3a38" }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3a3a38" }} />
                </div>
                <span className="text-xs" style={{ color: "#6b6b65" }}>
                  Q4 Platform Launch — Active Sprint
                </span>
                <span className="text-xs" style={{ color: "#d4ff00" }}>
                  ● Live
                </span>
              </div>

              {/* Sprint header */}
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-600 text-sm uppercase tracking-wider">Sprint 14 · Oct 7–20</span>
                  <span className="text-xs" style={{ color: "#6b6b65" }}>
                    6 days left
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="h-full rounded-full" style={{ width: "62%", backgroundColor: "#d4ff00" }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: "#6b6b65" }}>
                    62% complete
                  </span>
                  <span className="text-xs" style={{ color: "#6b6b65" }}>
                    38 / 61 tasks
                  </span>
                </div>
              </div>

              {/* Task list */}
              <div className="px-4 pb-4 space-y-1 mt-2">
                {[
                  { title: "API rate limiting middleware", assignee: "KL", status: "Done", priority: "P1" },
                  { title: "Redesign onboarding flow step 2", assignee: "MR", status: "In Progress", priority: "P1" },
                  { title: "Write migration script for v2 schema", assignee: "SO", status: "In Progress", priority: "P2" },
                  { title: "Add audit log export endpoint", assignee: "TN", status: "Review", priority: "P2" },
                  { title: "Fix Stripe webhook retry loop", assignee: "KL", status: "Blocked", priority: "P0" },
                ].map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 rounded-sm text-xs transition-colors"
                    style={{ backgroundColor: i === 4 ? "#1a0a0a" : "transparent", border: i === 4 ? "1px solid #3a1a1a" : "1px solid transparent" }}
                  >
                    <div
                      className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-sm text-xs"
                      style={{
                        backgroundColor:
                          task.status === "Done" ? "#1a2a0a" : task.status === "Blocked" ? "#3a1a1a" : "#1a1a1a",
                        color:
                          task.status === "Done" ? "#d4ff00" : task.status === "Blocked" ? "#ff6b6b" : "#6b6b65",
                      }}
                    >
                      {task.status === "Done" ? "✓" : task.status === "Blocked" ? "!" : "·"}
                    </div>
                    <span className="flex-1 truncate" style={{ color: task.status === "Done" ? "#6b6b65" : "#f0efe8" }}>
                      {task.title}
                    </span>
                    <span
                      className="flex-shrink-0 px-1.5 py-0.5 font-display text-xs uppercase"
                      style={{
                        color: task.priority === "P0" ? "#ff6b6b" : task.priority === "P1" ? "#d4ff00" : "#6b6b65",
                        border: `1px solid ${task.priority === "P0" ? "#3a1a1a" : task.priority === "P1" ? "#2a2a00" : "#222220"}`,
                      }}
                    >
                      {task.priority}
                    </span>
                    <div
                      className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-display font-600"
                      style={{ backgroundColor: "#1a1a1a", color: "#a0a09a" }}
                    >
                      {task.assignee[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Accent glow */}
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ backgroundColor: "#d4ff00", opacity: 0.06, filter: "blur(40px)" }}
            />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-8 py-10" style={{ borderBottom: "1px solid #222220" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x" style={{ borderColor: "#222220" }}>
          {[
            { value: "14,000+", label: "Teams shipping" },
            { value: "99.98%", label: "Uptime SLA" },
            { value: "4.9★", label: "G2 rating" },
            { value: "< 80ms", label: "p95 API latency" },
          ].map((s) => (
            <div key={s.label} className="px-8 first:pl-0 last:pr-0 text-center" style={{ borderColor: "#222220" }}>
              <div className="font-display font-800 text-4xl mb-1" style={{ letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: "#6b6b65" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24" style={{ borderBottom: "1px solid #222220" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest mb-4 font-display" style={{ color: "#d4ff00" }}>
              Capabilities
            </p>
            <h2 className="font-display font-800 leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
              BUILT FOR
              <br />
              ENGINEERING ORGS.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: "#222220" }}>
            {FEATURES.map((f) => (
              <div
                key={f.number}
                className="p-8 group transition-colors"
                style={{ backgroundColor: "#0a0a0a" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f0f0f")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0a0a0a")}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-display font-600 text-xs" style={{ color: "#3a3a38" }}>
                    {f.number}
                  </span>
                  <div className="text-right">
                    <div className="font-display font-800 text-3xl" style={{ color: "#d4ff00", letterSpacing: "-0.02em" }}>
                      {f.stat}
                    </div>
                    <div className="text-xs" style={{ color: "#6b6b65" }}>
                      {f.statLabel}
                    </div>
                  </div>
                </div>
                <h3 className="font-display font-700 text-xl mb-3 uppercase tracking-wide">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#a0a09a" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow visualizer */}
      <section className="px-8 py-24" style={{ borderBottom: "1px solid #222220" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest mb-4 font-display" style={{ color: "#d4ff00" }}>
              Workflow
            </p>
            <h2 className="font-display font-800 leading-none mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em" }}>
              EVERY STATE.
              <br />
              ONE VIEW.
            </h2>
            <p className="text-base mb-8" style={{ color: "#a0a09a", lineHeight: 1.7 }}>
              Customize workflow stages to match how your team actually works — not how a vendor thinks you should. Transitions are auditable, reversible, and automatable.
            </p>
            <div className="space-y-2">
              {WORKFLOW_STEPS.map((step) => (
                <button
                  key={step.id}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
                  style={{
                    border: `1px solid ${activeStep === step.id ? step.color : "#222220"}`,
                    backgroundColor: activeStep === step.id ? "rgba(212,255,0,0.04)" : "transparent",
                  }}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xs" style={{ color: "#6b6b65" }}>
                      {step.id}
                    </span>
                    <span
                      className="font-display font-600 uppercase tracking-wider text-sm"
                      style={{ color: activeStep === step.id ? step.color : "#f0efe8" }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <span className="font-display font-700 text-lg" style={{ color: step.color }}>
                    {step.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual board */}
          <div className="rounded-sm overflow-hidden" style={{ border: "1px solid #222220", backgroundColor: "#111111" }}>
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid #1a1a1a", backgroundColor: "#0f0f0f" }}
            >
              <span className="font-display font-600 text-sm uppercase tracking-wider">Board View</span>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#6b6b65" }}>
                <span>Filter</span>
                <span>·</span>
                <span>Group by</span>
                <span>·</span>
                <span>Sort</span>
              </div>
            </div>
            <div className="p-4 grid grid-cols-4 gap-2">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="text-xs font-display uppercase tracking-wide"
                      style={{ color: activeStep === step.id ? step.color : "#6b6b65" }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {Array.from({ length: step.id === "02" ? 3 : step.id === "01" ? 4 : step.id === "03" ? 2 : 2 }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-sm"
                          style={{
                            backgroundColor: "#1a1a1a",
                            border: `1px solid ${activeStep === step.id ? step.color + "33" : "#222220"}`,
                          }}
                        >
                          <div
                            className="h-1.5 rounded-full mb-1.5"
                            style={{
                              width: `${60 + i * 15}%`,
                              backgroundColor: activeStep === step.id ? step.color + "44" : "#3a3a38",
                            }}
                          />
                          <div className="h-1 rounded-full" style={{ width: "40%", backgroundColor: "#2a2a2a" }} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-24" style={{ borderBottom: "1px solid #222220" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-16 font-display text-center" style={{ color: "#6b6b65" }}>
            From engineering leaders who've made the switch
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: "#222220" }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-8" style={{ backgroundColor: "#0a0a0a" }}>
                <div className="mb-6 text-xl" style={{ color: "#d4ff00" }}>
                  ❝
                </div>
                <p className="text-base mb-8 leading-relaxed" style={{ color: "#f0efe8" }}>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center font-display font-700 text-xs flex-shrink-0"
                    style={{ backgroundColor: "#1a1a1a", color: "#a0a09a", border: "1px solid #222220" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs" style={{ color: "#6b6b65" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-8 py-24" style={{ borderBottom: "1px solid #222220" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-4 font-display" style={{ color: "#d4ff00" }}>
              Pricing
            </p>
            <h2 className="font-display font-800 leading-none mb-8" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
              NO SURPRISES.
            </h2>
            <div
              className="inline-flex items-center gap-1 p-1"
              style={{ border: "1px solid #222220", backgroundColor: "#111111" }}
            >
              <button
                className="px-4 py-1.5 text-sm font-display uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: billingAnnual ? "#d4ff00" : "transparent",
                  color: billingAnnual ? "#0a0a0a" : "#6b6b65",
                }}
                onClick={() => setBillingAnnual(true)}
              >
                Annual <span style={{ color: billingAnnual ? "#0a0a0a" : "#d4ff00", fontSize: "0.7em" }}>-20%</span>
              </button>
              <button
                className="px-4 py-1.5 text-sm font-display uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: !billingAnnual ? "#d4ff00" : "transparent",
                  color: !billingAnnual ? "#0a0a0a" : "#6b6b65",
                }}
                onClick={() => setBillingAnnual(false)}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: "#222220" }}>
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="p-8 flex flex-col"
                style={{
                  backgroundColor: plan.highlight ? "#0d1a00" : "#0a0a0a",
                  border: plan.highlight ? "1px solid #d4ff00" : "none",
                  position: "relative",
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-px left-0 right-0 h-px"
                    style={{ backgroundColor: "#d4ff00" }}
                  />
                )}
                {plan.highlight && (
                  <div
                    className="absolute top-4 right-4 px-2 py-0.5 text-xs font-display uppercase tracking-widest"
                    style={{ backgroundColor: "#d4ff00", color: "#0a0a0a" }}
                  >
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="font-display font-700 text-sm uppercase tracking-widest mb-4" style={{ color: "#6b6b65" }}>
                    {plan.name}
                  </div>
                  <div className="font-display font-800 leading-none mb-1" style={{ fontSize: "3rem", letterSpacing: "-0.02em" }}>
                    {plan.price === "$18" && billingAnnual ? "$14" : plan.price}
                  </div>
                  <div className="text-xs mb-3" style={{ color: "#6b6b65" }}>
                    {plan.period}
                  </div>
                  <p className="text-sm" style={{ color: "#a0a09a" }}>
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span style={{ color: "#d4ff00" }}>+</span>
                      <span style={{ color: "#f0efe8" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 font-display font-600 uppercase tracking-wider text-sm transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: plan.highlight ? "#d4ff00" : "transparent",
                    color: plan.highlight ? "#0a0a0a" : "#f0efe8",
                    border: plan.highlight ? "none" : "1px solid #222220",
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="font-display font-800 leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)", letterSpacing: "-0.02em", lineHeight: 0.9 }}
          >
            READY TO
            <br />
            <span style={{ color: "#d4ff00" }}>FORGE?</span>
          </h2>
          <p className="text-lg mb-10 mx-auto max-w-md" style={{ color: "#a0a09a" }}>
            Join 14,000+ engineering teams. Up and running in under 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="px-8 py-4 font-display font-700 uppercase tracking-wider text-base transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#d4ff00", color: "#0a0a0a", letterSpacing: "0.08em" }}
            >
              Start for free →
            </button>
            <span className="text-sm" style={{ color: "#6b6b65" }}>
              No card required · Cancel any time
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-10" style={{ borderTop: "1px solid #222220" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 flex items-center justify-center font-display font-bold text-xs"
              style={{ backgroundColor: "#d4ff00", color: "#0a0a0a" }}
            >
              TF
            </div>
            <span className="font-display font-700 tracking-wider text-xs uppercase" style={{ letterSpacing: "0.12em" }}>
              TaskForge
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs" style={{ color: "#6b6b65" }}>
            {["Privacy", "Terms", "Security", "Status", "Changelog"].map((l) => (
              <a
                key={l}
                href="#"
                className="transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0efe8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b65")}
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-xs" style={{ color: "#3a3a38" }}>
            © 2026 TaskForge, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
