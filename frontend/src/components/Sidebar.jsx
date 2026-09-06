import { useState } from "react";
import { NavLink } from "react-router-dom";

function NavItem({ to, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={({ isActive }) => ({
        padding: "11px 12px",
        borderRadius: "8px",
        color: isActive || isHovered ? "#f8fafc" : "#94a3b8",
        background:
          isActive || isHovered ? "#181b23" : "transparent",
        textDecoration: "none",
        fontSize: "14px",
        transition: "all 0.2s ease",
      })}
    >
      {children}
    </NavLink>
  );
}

function Sidebar() {
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        flexShrink: 0,
        padding: "24px 18px",
        background: "#0b0d12",
        borderRight: "1px solid #272b36",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <h2
        style={{
          margin: "0 0 25px",
          paddingLeft: "8px",
          fontSize: "22px",
          color: "#f8fafc",
        }}
      >
        TaskForge
      </h2>

      {/* Create Task */}
      <button
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        style={{
          width: "100%",
          padding: "12px 15px",
          border: "none",
          borderRadius: "8px",
          background: buttonHovered ? "#818cf8" : "#6366f1",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: buttonHovered
            ? "translateY(-1px)"
            : "translateY(0)",
          boxShadow: buttonHovered
            ? "0 6px 15px rgba(99, 102, 241, 0.25)"
            : "none",
        }}
      >
        + Create Task
      </button>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          marginTop: "25px",
        }}
      >
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/projects">Projects</NavItem>
        <NavItem to="/tasks">My Tasks</NavItem>
        <NavItem to="/team">Team</NavItem>
      </nav>
    </aside>
  );
}

export default Sidebar;