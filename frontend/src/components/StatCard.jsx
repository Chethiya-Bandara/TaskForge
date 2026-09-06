function StatCard({ icon, value, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "22px",
        background: "#181b23",
        border: "1px solid #272b36",
        borderRadius: "12px",
      }}
    >
      <span
        style={{
          fontSize: "25px",
        }}
      >
        {icon}
      </span>

      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "25px",
            color: "#f8fafc",
          }}
        >
          {value}
        </h2>

        <p
          style={{
            margin: "5px 0 0",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export default StatCard;