import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const container = useRef();

  useGSAP(
    () => {
      // Welcome animation
      gsap.from(".welcome-section", {
        opacity: 0,
        y: -20,
        duration: 0.7,
        ease: "power2.out",
      });

      // Statistics cards
      gsap.from(".stat-card", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        stagger: 0.12,
        delay: 0.2,
        ease: "power2.out",
      });

      // Recent tasks section
      gsap.from(".recent-tasks", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: 0.5,
        ease: "power2.out",
      });

      // Individual task cards
      gsap.from(".task-card", {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.7,
        ease: "power2.out",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      {/* Welcome */}
      <section
        className="welcome-section"
        style={{
          padding: "24px 28px",
          marginBottom: "24px",
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "14px",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 600,
            color: "#f8fafc",
          }}
        >
          Welcome to TaskForge!
        </p>
      </section>

      {/* Statistics */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        <div className="stat-card">
          <StatCard
            icon="📋"
            value="12"
            label="Total Tasks"
          />
        </div>

        <div className="stat-card">
          <StatCard
            icon="⏳"
            value="5"
            label="In Progress"
          />
        </div>

        <div className="stat-card">
          <StatCard
            icon="✅"
            value="7"
            label="Completed"
          />
        </div>
      </section>

      {/* Recent Tasks */}
      <section
        className="recent-tasks"
        style={{
          padding: "24px",
          background: "#181b23",
          border: "1px solid #272b36",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#f8fafc",
            }}
          >
            Recent Tasks
          </h2>

          <button
            style={{
              border: "none",
              background: "none",
              color: "#818cf8",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            View All →
          </button>
        </div>

        <div>
          <div className="task-card">
            <TaskCard
              title="Design dashboard UI"
              project="TaskForge Project"
              status="In Progress"
            />
          </div>

          <div className="task-card">
            <TaskCard
              title="Set up database"
              project="Backend Development"
              status="Completed"
            />
          </div>

          <div className="task-card">
            <TaskCard
              title="Implement authentication"
              project="Backend Development"
              status="Pending"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;