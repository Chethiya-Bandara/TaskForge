import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import ProjectCard from "../components/ProjectCard";

function Projects() {
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  
  return (
    <div ref={pageRef}>
      {/* Page Header */}
      <div
        ref={headerRef}
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            color: "#f8fafc",
          }}
        >
          Projects
        </h1>

        <p
          style={{
            marginTop: "7px",
            color: "#94a3b8",
          }}
        >
          Manage and track your projects.
        </p>
      </div>

      {/* Project Cards */}
      <section
        ref={cardsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
        }}
      >
        <ProjectCard
          name="TaskForge"
          description="Project management application."
          taskCount={12}
          completedCount={7}
        />

        <ProjectCard
          name="Backend Development"
          description="TaskForge backend and API development."
          taskCount={8}
          completedCount={5}
        />

        <ProjectCard
          name="Frontend Development"
          description="TaskForge frontend implementation."
          taskCount={10}
          completedCount={4}
        />
      </section>
    </div>
  );
}

export default Projects;