import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";

import {
  Zap,
  Plus,
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function NavItem({ to, icon: Icon, children, collapsed }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      title={collapsed ? children : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",

        width: "100%",
        height: "42px",

        padding: collapsed ? "0" : "0 12px",

        borderRadius: "8px",

        color: isActive || isHovered ? "#f8fafc" : "#94a3b8",

        background:
          isActive || isHovered ? "#181b23" : "transparent",

        textDecoration: "none",

        fontSize: "14px",

        transition: "all 0.2s ease",

        gap: "12px",

        overflow: "hidden",

        boxSizing: "border-box",
      })}
    >
      <Icon
        size={19}
        strokeWidth={2}
        style={{
          flexShrink: 0,
        }}
      />

      {!collapsed && (
        <span
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </span>
      )}
    </NavLink>
  );
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    const newCollapsed = !collapsed;

    gsap.to(sidebarRef.current, {
      width: newCollapsed ? "72px" : "240px",
      duration: 0.4,
      ease: "power2.inOut",
    });

    setCollapsed(newCollapsed);
  };

  return (
    <aside
      ref={sidebarRef}
      style={{
        width: "240px",
        minHeight: "100vh",
        flexShrink: 0,

        padding: "24px 18px",

        background: "#0b0d12",

        borderRight: "1px solid #272b36",

        display: "flex",
        flexDirection: "column",

        position: "relative",

        overflow: "hidden",

        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",

          justifyContent: collapsed
            ? "center"
            : "flex-start",

          gap: "10px",

          marginBottom: "25px",

          paddingLeft: collapsed ? "0" : "8px",
        }}
      >
        <Zap
          size={24}
          color="#818cf8"
          strokeWidth={2.5}
          style={{
            flexShrink: 0,
          }}
        />

        {!collapsed && (
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              color: "#f8fafc",
              whiteSpace: "nowrap",
            }}
          >
            TaskForge
          </h2>
        )}
      </div>

      {/* Create Task */}
      <button
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        title={collapsed ? "Create Task" : undefined}
        style={{
          width: collapsed ? "40px" : "100%",
          height: "42px",

          margin: "0 auto",

          padding: 0,

          border: "none",
          borderRadius: "8px",

          background: buttonHovered
            ? "#818cf8"
            : "#6366f1",

          color: "#ffffff",

          cursor: "pointer",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          gap: "8px",

          transition: "background 0.2s ease",

          flexShrink: 0,
        }}
      >
        <Plus
          size={18}
          style={{
            flexShrink: 0,
          }}
        />

        {!collapsed && (
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Create Task
          </span>
        )}
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
        <NavItem
          to="/"
          icon={LayoutDashboard}
          collapsed={collapsed}
        >
          Dashboard
        </NavItem>

        <NavItem
          to="/projects"
          icon={FolderKanban}
          collapsed={collapsed}
        >
          Projects
        </NavItem>

        <NavItem
          to="/tasks"
          icon={ClipboardList}
          collapsed={collapsed}
        >
          My Tasks
        </NavItem>

        <NavItem
          to="/team"
          icon={Users}
          collapsed={collapsed}
        >
          Team
        </NavItem>
      </nav>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          position: "absolute",

          bottom: "20px",
          left: "50%",

          transform: "translateX(-50%)",

          width: "32px",
          height: "32px",

          border: "1px solid #272b36",
          borderRadius: "8px",

          background: "#181b23",

          color: "#94a3b8",

          cursor: "pointer",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          padding: 0,
        }}
      >
        {collapsed ? (
          <PanelLeftOpen size={17} />
        ) : (
          <PanelLeftClose size={17} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;