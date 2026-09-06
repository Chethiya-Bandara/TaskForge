function TaskCard({ title, project, status }) {
  const statusStyles = {
    "In Progress": {
      background: "rgba(99, 102, 241, 0.15)",
      color: "#818cf8",
    },

    Completed: {
      background: "rgba(34, 197, 94, 0.15)",
      color: "#4ade80",
    },

    Pending: {
      background: "rgba(245, 158, 11, 0.15)",
      color: "#fbbf24",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        padding: "18px 0",
        borderTop: "1px solid #272b36",
      }}
    >
      <div>
        <h3
          style={{
            margin: "0 0 5px",
            fontSize: "15px",
            color: "#f8fafc",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          {project}
        </p>
      </div>

      <span
        style={{
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          ...statusStyles[status],
        }}
      >
        {status}
      </span>
    </div>
  );
}

export default TaskCard;