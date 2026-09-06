function ProjectCard({ name, description, taskCount, completedCount }) {
  const progress =
    taskCount > 0
      ? Math.round((completedCount / taskCount) * 100)
      : 0;

  return (
    <div
      style={{
        padding: "22px",
        background: "#181b23",
        border: "1px solid #272b36",
        borderRadius: "12px",
        color: "#f8fafc",
      }}
    >
      {/* Project Name */}
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "17px",
        }}
      >
        {name}
      </h3>

      {/* Description */}
      <p
        style={{
          margin: "0 0 20px",
          color: "#94a3b8",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {/* Task Information */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            color: "#94a3b8",
          }}
        >
          {completedCount} of {taskCount} tasks completed
        </span>

        <span
          style={{
            color: "#818cf8",
            fontWeight: 600,
          }}
        >
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "#272b36",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#6366f1",
            borderRadius: "10px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

export default ProjectCard;